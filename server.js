import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

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
  const bugToSave = req.body
  console.log(`bugToSave`, bugToSave)

  bugService
    .save(bugToSave)
    .then(bug => res.send(bug))
    .catch(err => {
      loggerService.error('Cannot save bug:', err)
      res.status(400).send('Cannot save bug')
    })
})

// Update existing bug
app.put('/api/bug', (req, res) => {
  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    severity: +req.body.severity,
    description: req.body.description,
    createdAt: +req.body.createdAt,
  }
  console.log(`bugToSave`, bugToSave)

  bugService
    .save(bugToSave)
    .then(bug => res.send(bug))
    .catch(err => {
      loggerService.error('Cannot save bug:', err)
      res.status(400).send('Cannot save bug')
    })
})

// Remove bug
app.delete('/api/bug/:id', (req, res) => {
  const bugId = req.params.id

  bugService
    .remove(bugId)
    .then(() => res.send(bugId))
    .catch(err => {
      loggerService.error('Cannot remove bug:', err)
      res.status(400).send('Cannot remove bug')
    })
})

// Authentication & Authorization API

// Signup
app.post('/api/auth/signup', (req, res) => {
  res.send('signup')
})

// Login
app.post('/api/auth/login', (req, res) => {
  res.send('login')
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.send('logout')
})

// Fallback route
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

app.listen(3030, () => console.log('Server ready at port 3030'))
