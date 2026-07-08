const express = require('express')
const pool = require('../config/database')

const router = express.Router()

// Get all messages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add message (from contact form)
router.post('/', async (req, res) => {
  try {
    const { from_name, email, subject, message, type, attachments } = req.body
    
    const result = await pool.query(
      `INSERT INTO messages (from_name, email, subject, message, type, attachments, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'unread')
       RETURNING *`,
      [from_name, email, subject, message, type || 'general', attachments || []]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Add message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update message status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body
    const result = await pool.query(
      'UPDATE messages SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error('Update message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete message
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id])
    res.json({ message: 'Message deleted' })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Mark all as read
router.patch('/read/all', async (req, res) => {
  try {
    await pool.query("UPDATE messages SET status = 'read' WHERE status = 'unread'")
    res.json({ message: 'All messages marked as read' })
  } catch (error) {
    console.error('Mark all read error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
