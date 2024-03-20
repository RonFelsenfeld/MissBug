import fs from 'fs'

import { utilService } from './util.service.js'
const PAGE_SIZE = 3

export const bugService = {
  query,
  getById,
  remove,
  save,
}

const bugs = utilService.readJsonFile('data/bugs.json')

function query(filterBy, sortBy) {
  let bugsToReturn = bugs.slice()

  if (filterBy.title) {
    const regex = new RegExp(filterBy.title, 'i')
    bugsToReturn = bugsToReturn.filter(bug => regex.test(bug.title))
  }

  if (filterBy.minSeverity) {
    bugsToReturn = bugsToReturn.filter(
      bug => bug.severity >= filterBy.minSeverity
    )
  }

  if (filterBy.label) {
    bugsToReturn = bugsToReturn.filter(bug => {
      for (let i = 0; i < bug.labels.length; i++) {
        const currLabel = bug.labels[i]
        if (currLabel.includes(filterBy.label)) return bug
      }
    })
  }

  const sortByKey = Object.keys(sortBy)[0]
  if (sortByKey) bugsToReturn = _sortBugs(bugsToReturn, sortBy)

  const pageIdx = +filterBy.pageIdx
  const startIdx = pageIdx * PAGE_SIZE
  bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)

  return Promise.resolve(bugsToReturn)
}

function getById(id) {
  const bug = bugs.find(bug => bug._id === id)
  if (!bug) return Promise.reject('Bug does not exist!')

  return Promise.resolve(bug)
}

function remove(id, loggedInUser) {
  const bugIdx = bugs.findIndex(bug => bug._id === id)
  if (bugIdx === -1) return Promise.reject('No such bug')

  const bug = bugs[bugIdx]
  if (loggedInUser._id !== bug.creator._id) {
    return Promise.reject('Not your bug')
  }

  bugs.splice(bugIdx, 1)
  return _saveCarsToFile()
}

function save(bug, loggedInUser) {
  if (bug._id) {
    const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)

    // bugs[bugIdx] === updated bug
    if (loggedInUser._id !== bugs[bugIdx].creator._id) {
      return Promise.reject('Not your bug')
    }

    bugs[bugIdx] = bug
  } else {
    bug._id = utilService.makeId()
    bug.createdAt = Date.now()
    bug.creator = { fullname: loggedInUser.fullname, _id: loggedInUser._id }
    bugs.unshift(bug)
  }
  return _saveCarsToFile().then(() => bug)
}

function _saveCarsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)

    fs.writeFile('data/bugs.json', data, err => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      resolve()
    })
  })
}

////////////////////////////////////////////////////

function _sortBugs(bugs, sortBy) {
  if (sortBy.title) {
    bugs.sort((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.title)
  }

  if (sortBy.severity) {
    bugs.sort((b1, b2) => (b1.severity - b2.severity) * sortBy.severity)
  }

  if (sortBy.createdAt) {
    bugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * sortBy.createdAt)
  }

  return bugs
}
