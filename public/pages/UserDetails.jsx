import { userService } from '../services/user.service.js'

const { useState, useEffect } = React

export function UserDetails() {
  const user = userService.getLoggedinUser()

  return (
    <section>
      <h2>User Profile</h2>
      <p>
        id: <span>{user._id}</span>
      </p>
      <p>
        Full name: <span>{user.fullname}</span>
      </p>
    </section>
  )
}
