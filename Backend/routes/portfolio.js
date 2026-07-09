const express = require('express')
const pool = require('../config/database')

const router = express.Router()

// Get all portfolio data
router.get('/', async (req, res) => {
  try {
    const [bioResult, skillsResult, contactResult, projectsResult, certificatesResult] = await Promise.all([
      pool.query('SELECT * FROM bio ORDER BY id DESC LIMIT 1'),
      pool.query('SELECT * FROM skills ORDER BY created_at DESC'),
      pool.query('SELECT * FROM contact ORDER BY id DESC LIMIT 1'),
      pool.query('SELECT * FROM projects ORDER BY created_at DESC'),
      pool.query('SELECT * FROM certificates ORDER BY created_at DESC'),
    ])

    res.json({
      bio: bioResult.rows[0] || {},
      skills: skillsResult.rows,
      contact: contactResult.rows[0] || {},
      projects: projectsResult.rows,
      certificates: certificatesResult.rows,
    })
  } catch (error) {
    console.error('Get portfolio error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update bio
router.put('/bio', async (req, res) => {
  try {
    const { name, location, about, avatar, cvUrl, githubUrl, roles } = req.body
    
    const result = await pool.query(
      `INSERT INTO bio (name, location, about, avatar, cv_url, github_url, roles)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = $1, location = $2, about = $3, avatar = $4, cv_url = $5, github_url = $6, roles = $7
       RETURNING *`,
      [name, location, about, avatar, cvUrl, githubUrl, roles]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Update bio error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update contact
router.put('/contact', async (req, res) => {
  try {
    const { phone1, email, linkedin, twitter, instagram, facebook } = req.body
    
    const result = await pool.query(
      `INSERT INTO contact (phone1, email, linkedin, twitter, instagram, facebook)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         phone1 = $1, email = $2, linkedin = $3, twitter = $4, instagram = $5, facebook = $6
       RETURNING *`,
      [phone1, email, linkedin, twitter, instagram, facebook]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Update contact error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Skills CRUD
router.post('/skills', async (req, res) => {
  try {
    const { category, items } = req.body
    const result = await pool.query(
      'INSERT INTO skills (category, items) VALUES ($1, $2) RETURNING *',
      [category, items]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error('Add skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/skills/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM skills WHERE id = $1', [req.params.id])
    res.json({ message: 'Skill deleted' })
  } catch (error) {
    console.error('Delete skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Projects CRUD
router.post('/projects', async (req, res) => {
  try {
    const { title, description, image, tags, github_url, live_url, status } = req.body
    const result = await pool.query(
      'INSERT INTO projects (title, description, image, tags, github_url, live_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, image, tags, github_url, live_url, status || 'ACTIVE']
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error('Add project error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/projects/:id', async (req, res) => {
  try {
    const { title, description, image, tags, github_url, live_url, status } = req.body
    console.log('PUT /projects/:id received:', { id: req.params.id, title, description, image, tags, github_url, live_url, status })
    
    // Handle tags as array or string
    const tagsValue = Array.isArray(tags) ? JSON.stringify(tags) : tags
    
    const result = await pool.query(
      'UPDATE projects SET title = $1, description = $2, image = $3, tags = $4, github_url = $5, live_url = $6, status = $7 WHERE id = $8 RETURNING *',
      [title, description, image, tagsValue, github_url, live_url, status || 'ACTIVE', req.params.id]
    )
    console.log('Update result:', result.rows[0])
    res.json(result.rows[0])
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Server error', details: error.message })
  }
})

router.delete('/projects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id])
    res.json({ message: 'Project deleted' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Certificates CRUD
router.post('/certificates', async (req, res) => {
  try {
    const { title, issuer, date, image } = req.body
    const result = await pool.query(
      'INSERT INTO certificates (title, issuer, date, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, issuer, date, image]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error('Add certificate error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/certificates/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM certificates WHERE id = $1', [req.params.id])
    res.json({ message: 'Certificate deleted' })
  } catch (error) {
    console.error('Delete certificate error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Reset to defaults
router.post('/reset', async (req, res) => {
  try {
    await Promise.all([
      pool.query('DELETE FROM bio'),
      pool.query('DELETE FROM skills'),
      pool.query('DELETE FROM contact'),
      pool.query('DELETE FROM projects'),
      pool.query('DELETE FROM certificates'),
      pool.query('DELETE FROM messages'),
    ])
    res.json({ message: 'All data reset' })
  } catch (error) {
    console.error('Reset error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
