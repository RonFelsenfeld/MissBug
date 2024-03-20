import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugList } from '../cmps/BugList.jsx'

const { useState, useEffect } = React

export function UserDetails() {
  const [userBugs, setUserBugs] = useState(null)
  const user = userService.getLoggedinUser()

  useEffect(() => {
    bugService
      .query({ creatorId: user._id })
      .then(setUserBugs)
      .catch(err => {
        showErrorMsg('Could not load user bugs')
      })
  }, [])

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        const bugsToUpdate = userBugs.filter(bug => bug._id !== bugId)
        setUserBugs(bugsToUpdate)
        showSuccessMsg('Bug removed')
      })
      .catch(err => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }

    bugService
      .save(bugToSave)
      .then(savedBug => {
        console.log('Updated Bug:', savedBug)
        const bugsToUpdate = userBugs.map(currBug =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
        setUserBugs(bugsToUpdate)
        showSuccessMsg('Bug updated')
      })
      .catch(err => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }

  return (
    <section>
      <h2>User Profile</h2>
      <p>
        id: <span>{user._id}</span>
      </p>
      <p>
        Full name: <span>{user.fullname}</span>
      </p>
      <BugList
        bugs={userBugs}
        onRemoveBug={onRemoveBug}
        onEditBug={onEditBug}
      />
    </section>
  )
}
