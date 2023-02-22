const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', age: 15 },
    { id: 2, name: 'Jane Doe', age: 15 },
  ])
})

app.post('/api/login', (req, res) => {
  res.json({
    token: '1234567890',
  })
})

const port = 3009
app.listen(port, () => {
  console.log(`Mock API running on http://localhost:${port}`)
})
