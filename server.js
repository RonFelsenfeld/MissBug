import express from 'express'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

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
  }

  bugService
    .save(bugToSave)
    .then(bug => res.send(bug))
    .catch(err => {
      loggerService.error('Cannot save bug:', err)
      res.status(400).send('Cannot save bug')
    })
})

app.get('/api/bug/:bugId', (req, res) => {
  res.send('/api/bug/bugId!')
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  res.send('/api/bug/bugId/remove!')
})

app.listen(3030, () => console.log('Server ready at port 3030'))
