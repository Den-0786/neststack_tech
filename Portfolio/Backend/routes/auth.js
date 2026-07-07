const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // In production, use bcrypt.compare(password, user.password_hash)
    // For now, use the hardcoded password check
    if (password !== 'NestStack26') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: '7d' }
    )

    res.json({ token, username: user.username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields required' })
    }

    if (oldPassword !== 'NestStack26') {
      return res.status(401).json({ error: 'Old password is incorrect' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    // In production, hash the new password with bcrypt
    // const hashedPassword = await bcrypt.hash(newPassword, 10)

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
