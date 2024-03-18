const BASE_URL = '/api/bug/'

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getFilterFromParams,
}

function query(filterBy = getDefaultFilter()) {
  return axios
    .get(BASE_URL)
    .then(res => res.data)
    .then(bugs => {
      if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugs = bugs.filter(bug => regex.test(bug.title))
      }

      if (filterBy.minSeverity) {
        bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
      }

      return bugs
    })
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

function getDefaultFilter() {
  return { title: '', minSeverity: 0 }
}

function getFilterFromParams(searchParams = {}) {
  const defaultFilter = getDefaultFilter()
  return {
    title: searchParams.get('title') || defaultFilter.title,
    minSeverity: searchParams.get('minSeverity') || defaultFilter.minSeverity,
  }
}
