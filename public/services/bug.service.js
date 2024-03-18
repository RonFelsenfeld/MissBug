const BASE_URL = '/api/bug/'

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
