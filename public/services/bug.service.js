const BASE_URL = '/api/bug/'

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getFilterFromParams,
}

function query(filterBy = getDefaultFilter(), sortBy) {
  return axios
    .get(BASE_URL, { params: { filterBy, sortBy } })
    .then(res => res.data)
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
  return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(BASE_URL, bug).then(res => res.data)
  } else {
    return axios.post(BASE_URL, bug).then(res => res.data)
  }
}

function getDefaultFilter() {
  return { title: '', minSeverity: 0, label: '', pageIdx: 0 }
}

function getFilterFromParams(searchParams = {}) {
  const defaultFilter = getDefaultFilter()
  return {
    title: searchParams.get('title') || defaultFilter.title,
    minSeverity: searchParams.get('minSeverity') || defaultFilter.minSeverity,
    label: searchParams.get('label') || defaultFilter.label,
    pageIdx: +searchParams.get('pageIdx') || defaultFilter.pageIdx,
  }
}
