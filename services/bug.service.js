import fs from 'fs'

import { utilService } from './utils.service.js'

export const bugService = {
  query,
  getById,
  remove,
  save,
}

const bugs = utilService.readJsonFile('data/bugs.json')

function query() {
  return Promise.resolve(bugs)
}

function getById(id) {
  const bug = bugs.find(bug => bug._id === id)
  if (!bug) return Promise.reject('Bug does not exist!')

  return Promise.resolve(bug)
}

function remove(id) {
  const bugIdx = bugs.findIndex(bug => bug._id === id)
  cars.splice(bugIdx, 1)

  return _saveCarsToFile()
}

function save(bug) {
  if (bug._id) {
    const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
    bugs[bugIdx] = bug
  } else {
    bug._id = utilService.makeId()
    bug.desc = utilService.makeLorem()

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
