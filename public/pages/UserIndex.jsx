import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

const { useState, useEffect } = React

export function UserIndex() {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  function loadUsers() {
    userService.query().then(setUsers)
  }

  function onRemoveUser(userId) {
    userService
      .remove(userId)
      .then(() => {
        console.log('User Deleted Succesfully!')
        const usersToUpdate = users.filter(user => user._id !== userId)
        setUsers(usersToUpdate)
        showSuccessMsg('User removed')
      })
      .catch(err => {
        console.log('Error from onRemoveUser ->', err)
        showErrorMsg('Cannot remove user')
      })
  }

  if (!users) return <div>loading users...</div>
  return (
    <section>
      <ul>
        {users.map(user => {
          if (user.isAdmin) return
          return (
            <li key={user._id}>
              <p>
                Name: <span>{user.fullname}</span>
              </p>
              <p>
                ID: <span>{user._id}</span>
              </p>
              <button onClick={() => onRemoveUser(user._id)}>
                Remove User
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
