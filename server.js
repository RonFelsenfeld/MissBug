import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { CLIENT_RENEG_LIMIT } from 'tls'
import { Certificate } from 'crypto'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Read bugs
app.get('/api/bug', (req, res) => {
  const { query } = req

  const sortBy = JSON.parse(query.sortBy)

  const receivedFilter = JSON.parse(query.filterBy)
  const filterBy = {
    title: receivedFilter.title || '',
    minSeverity: +receivedFilter.minSeverity || 0,
    label: receivedFilter.label || '',
    pageIdx: +receivedFilter.pageIdx || 0,
    creatorId: receivedFilter.creatorId || '',
  }

  bugService
    .query(filterBy, sortBy)
    .then(bugs => res.send(bugs))
    .catch(err => {
      loggerService.error('Cannot get bugs:', err)
      res.status(400).send('Cannot get bugs')
    })
})

// Read bug
app.get('/api/bug/:id', (req, res) => {
  const bugId = req.params.id
  const visitedBugsIds = req.cookies.visitedBugsIds || []

  if (!visitedBugsIds.includes(bugId)) visitedBugsIds.push(bugId)
  res.cookie('visitedBugsIds', visitedBugsIds, { maxAge: 7 * 1000 })
  console.log('User visited at the following bugs:', visitedBugsIds)

  if (visitedBugsIds.length > 3) return res.status(401).send('Wait for a bit')

  bugService
    .getById(bugId)
    .then(bug => res.send(bug))
    .catch(err => {
      loggerService.error('Cannot get bug:', err)
      res.status(400).send('Cannot get bug')
    })
})

// Create new bug
app.post('/api/bug', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Cannot add bug')

  const bugToSave = req.body

  bugService
    .save(bugToSave, loggedInUser)
    .then(bug => res.send(bug))
    .catch(err => {
      loggerService.error('Cannot save bug:', err)
      res.status(400).send('Cannot save bug')
    })
})

// Update existing bug
app.put('/api/bug', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Cannot update bug')

  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    severity: +req.body.severity,
    description: req.body.description,
    createdAt: +req.body.createdAt,
    labels: req.body.labels,
    creator: req.body.creator,
  }

  bugService
    .save(bugToSave, loggedInUser)
    .then(bug => res.send(bug))
    .catch(err => {
      loggerService.error('Cannot save bug:', err)
      res.status(400).send('Cannot save bug')
    })
})

// Remove bug
app.delete('/api/bug/:id', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Cannot remove bug')

  const bugId = req.params.id

  bugService
    .remove(bugId, loggedInUser)
    .then(() => res.send(bugId))
    .catch(err => {
      loggerService.error('Cannot remove bug:', err)
      res.status(400).send('Cannot remove bug')
    })
})

// Authentication & Authorization API

// Get users
app.get('/api/user', (req, res) => {
  userService
    .query()
    .then(users => {
      res.send(users)
    })
    .catch(err => {
      console.log('Cannot load users', err)
      res.status(400).send('Cannot load users')
    })
})

// Remove user
app.delete('/api/user/:id', (req, res) => {
  const userId = req.params.id

  userService
    .remove(userId)
    .then(() => res.send(userId))
    .catch(err => {
      loggerService.error('Cannot remove user:', err)
      res.status(400).send('Cannot remove user')
    })
})

// Signup
app.post('/api/auth/signup', (req, res) => {
  const credentials = req.body

  userService
    .save(credentials)
    .then(user => {
      if (user) {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
      } else {
        res.status(400).send('Cannot signup')
      }
    })
    .catch(err => {
      loggerService.error('Could not signup', err)
      console.log('Could not signup:', err)
    })
})

// Login
app.post('/api/auth/login', (req, res) => {
  const credentials = req.body

  userService
    .checkLogin(credentials)
    .then(user => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch(err => {
      loggerService.warn('Invalid Credentials', err)
      res.status(401).send('Invalid Credentials')
    })
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged-out!')
})

// Fallback route
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

app.listen(3030, () => console.log('Server ready at port 3030'))
