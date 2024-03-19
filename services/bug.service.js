import fs from 'fs'

import { utilService } from './utils.service.js'

export const bugService = {
  query,
  getById,
  remove,
  save,
}

const bugs = utilService.readJsonFile('data/bugs.json')

function query(filterBy) {
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

  return Promise.resolve(bugsToReturn)
}

function getById(id) {
  const bug = bugs.find(bug => bug._id === id)
  if (!bug) return Promise.reject('Bug does not exist!')

  return Promise.resolve(bug)
}

function remove(id) {
  const bugIdx = bugs.findIndex(bug => bug._id === id)
  bugs.splice(bugIdx, 1)

  return _saveCarsToFile()
}

function save(bug) {
  if (bug._id) {
    const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
    bugs[bugIdx] = bug
  } else {
    bug._id = utilService.makeId()
    bug.createdAt = Date.now()

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
