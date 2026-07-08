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

    // Check if password is hashed (bcrypt) or plaintext (for migration)
    let isValid = false
    if (user.password_hash.startsWith('$2b$')) {
      isValid = await bcrypt.compare(password, user.password_hash)
    } else {
      // Plaintext fallback - only for initial setup
      isValid = password === user.password_hash
    }

    if (!isValid) {
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

    // Get current user
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' })
    }

    const user = result.rows[0]

    // Verify old password
    let isValid = false
    if (user.password_hash.startsWith('$2b$')) {
      isValid = await bcrypt.compare(oldPassword, user.password_hash)
    } else {
      isValid = oldPassword === user.password_hash
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Old password is incorrect' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update in database
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2',
      [hashedPassword, username]
    )

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// One-time setup to create initial admin user
router.post('/setup', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    // Check if any users already exist
    const existing = await pool.query('SELECT COUNT(*) FROM users')
    if (parseInt(existing.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Setup already completed' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    )

    res.json({ 
      message: 'Admin user created successfully', 
      user: { id: result.rows[0].id, username: result.rows[0].username }
    })
  } catch (error) {
    console.error('Setup error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update username
router.put('/username', async (req, res) => {
  try {
    const { oldUsername, newUsername } = req.body

    if (!oldUsername || !newUsername) {
      return res.status(400).json({ error: 'Old and new username required' })
    }

    // Check if new username already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [newUsername]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' })
    }

    // Update username
    await pool.query(
      'UPDATE users SET username = $1 WHERE username = $2',
      [newUsername, oldUsername]
    )

    res.json({ message: 'Username updated successfully', newUsername })
  } catch (error) {
    console.error('Update username error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
