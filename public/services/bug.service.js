import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

// _createBugs()

export const bugService = {
  query,
  getById,
  save,
  remove,
}

function query() {
  return axios.get(BASE_URL).then(res => res.data)
}

function getById(bugId) {
  return axios
    .get(BASE_URL + bugId)
    .then(res => res.data)
    .catch(err => {
      console.error('err:', err)
    })
}

function remove(bugId) {
  return axios.get(BASE_URL + bugId + '/remove').then(res => res.data)
}

function save(bug) {
  const url = BASE_URL + 'save'
  let queryParams = `?title=${bug.title}&severity=${bug.severity}&desc=${bug.description}`

  if (bug._id) {
    queryParams += `&_id=${bug._id}`
  }

  return axios.get(url + queryParams).then(res => res.data)
}

// function _createBugs() {
//   let bugs = utilService.loadFromStorage(STORAGE_KEY)
//   if (!bugs || !bugs.length) {
//     bugs = [
//       {
//         title: 'Infinite Loop Detected',
//         severity: 4,
//         _id: '1NF1N1T3',
//         description: utilService.makeLorem(5),
//       },
//       {
//         title: 'Keyboard Not Found',
//         severity: 3,
//         _id: 'K3YB0RD',
//         description: utilService.makeLorem(5),
//       },
//       {
//         title: '404 Coffee Not Found',
//         severity: 2,
//         _id: 'C0FF33',
//         description: utilService.makeLorem(5),
//       },
//       {
//         title: 'Unexpected Response',
//         severity: 1,
//         _id: 'G0053',
//         description: utilService.makeLorem(5),
//       },
//     ]
//     utilService.saveToStorage(STORAGE_KEY, bugs)
//   }
// }
