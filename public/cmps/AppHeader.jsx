const { useState, useEffect } = React
const { useNavigate } = ReactRouter
const { NavLink, Link } = ReactRouterDOM

import { userService } from '../services/user.service.js'

import { LoginSignup } from './LoginSignup.jsx'
import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedinUser())
  const navigate = useNavigate()

  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  function onLogout() {
    userService
      .logout()
      .then(() => {
        onSetUser(null)
      })
      .catch(err => {
        showErrorMsg('OOPs try again')
      })
  }

  return (
    <header>
      <UserMsg />

      <nav>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      <h1>Bugs are Forever</h1>

      {user && (
        <section>
          <p>
            hello {user.fullname}, <Link to={`/user`}>To profile</Link>
          </p>

          {user.isAdmin && (
            <p>
              <Link to={`/users`}>View users</Link>
            </p>
          )}
          <button onClick={onLogout}>Logout</button>
        </section>
      )}

      {!user && <LoginSignup onSetUser={onSetUser} />}
    </header>
  )
}
