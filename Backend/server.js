require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'NestStack_Tech API v1.0', status: 'running' })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/portfolio', require('./routes/portfolio'))
app.use('/api/messages', require('./routes/messages'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/contact', require('./routes/contact'))

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
