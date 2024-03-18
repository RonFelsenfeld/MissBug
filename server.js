import express from 'express'

import { bugService } from './services/bug.service.js'

const app = express()

app.get('/', (req, res) => res.send('Hello there!'))

app.get('/api/bug', (req, res) => {
  res.send('/api/bug!')
})

app.get('/api/bug/save', (req, res) => {
  res.send('/api/bug/save!')
})

app.get('/api/bug/:bugId', (req, res) => {
  res.send('/api/bug/bugId!')
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  res.send('/api/bug/bugId/remove!')
})

app.listen(3030, () => console.log('Server ready at port 3030'))
