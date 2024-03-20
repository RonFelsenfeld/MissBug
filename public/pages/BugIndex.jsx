import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'

import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function BugIndex() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [bugs, setBugs] = useState(null)
  const [sortBy, setSortBy] = useState({})
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(searchParams)
  )

  const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))

  useEffect(() => {
    loadBugs()
    setSearchParams(filterBy)
  }, [filterBy, sortBy])

  function loadBugs() {
    bugService.query(filterBy, sortBy).then(setBugs)
  }

  function onSetFilter(fieldsToUpdate) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...fieldsToUpdate }))
  }

  function onChangePage(diff) {
    let nextPageIdx = filterBy.pageIdx + diff
    if (nextPageIdx < 0) nextPageIdx = 0
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: nextPageIdx }))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug removed')
      })
      .catch(err => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
      description: prompt('Bug description?'),
      labels: [],
    }

    let newLabel = prompt('Bug label? (999 to exit)')
    while (newLabel !== '999') {
      bug.labels.push(newLabel)
      newLabel = prompt('Bug label? (999 to exit)')
    }

    bugService
      .save(bug)
      .then(savedBug => {
        console.log('Added Bug', savedBug)
        setBugs([...bugs, savedBug])
        showSuccessMsg('Bug added')
      })
      .catch(err => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
      })
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    bugService
      .save(bugToSave)
      .then(savedBug => {
        console.log('Updated Bug:', savedBug)
        const bugsToUpdate = bugs.map(currBug =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug updated')
      })
      .catch(err => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugFilter
          onSetFilter={debounceOnSetFilter.current}
          filterBy={filterBy}
        />
        <BugSort setSortBy={setSortBy} sortBy={sortBy} />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>

      <button onClick={() => onChangePage(-1)}>-</button>
      <span>{filterBy.pageIdx + 1}</span>
      <button onClick={() => onChangePage(1)}>+</button>
    </main>
  )
}
