import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => res.send('Hello there!'))

app.get('/api/bug', (req, res) => {
  bugService
    .query()
    .then(bugs => res.send(bugs))
    .catch(err => {
      loggerService.error('Cannot get bugs:', err)
      res.status(400).send('Cannot get bugs')
    })
})

app.get('/api/bug/save', (req, res) => {
  const { query } = req

  const bugToSave = {
    title: query.title,
    severity: query.severity,
    description: query.desc,
  }

  if (query._id) bugToSave._id = query._id

  bugService
    .save(bugToSave)
    .then(bug => res.send(bug))
    .catch(err => {
      loggerService.error('Cannot save bug:', err)
      res.status(400).send('Cannot save bug')
    })
})

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

app.get('/api/bug/:id/remove', (req, res) => {
  const bugId = req.params.id

  bugService
    .remove(bugId)
    .then(() => res.send(bugId))
    .catch(err => {
      loggerService.error('Cannot remove bug:', err)
      res.status(400).send('Cannot remove bug')
    })
})

app.listen(3030, () => console.log('Server ready at port 3030'))
