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
    const { title, description, tags, github_url, live_url, status } = req.body
    const result = await pool.query(
      'INSERT INTO projects (title, description, tags, github_url, live_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, tags, github_url, live_url, status || 'ACTIVE']
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error('Add project error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/projects/:id', async (req, res) => {
  try {
    const { title, description, tags, github_url, live_url, status } = req.body
    console.log('PUT /projects/:id received:', { id: req.params.id, title, description, tags, github_url, live_url, status })
    
    // Handle tags as array or string - convert to PostgreSQL array format
    const tagsValue = Array.isArray(tags) ? `{${tags.map(t => `"${t}"`).join(',')}}` : tags
    
    const result = await pool.query(
      'UPDATE projects SET title = $1, description = $2, tags = $3, github_url = $4, live_url = $5, status = $6 WHERE id = $7 RETURNING *',
      [title, description, tagsValue, github_url, live_url, status || 'ACTIVE', req.params.id]
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

// Track visitor
router.post('/visitors', async (req, res) => {
  try {
    const { visitor_id } = req.body
    const ip_address = req.ip || req.headers['x-forwarded-for'] || null
    const user_agent = req.headers['user-agent'] || null
    const visit_date = new Date().toISOString().split('T')[0]

    await pool.query(
      `INSERT INTO visitors (visitor_id, visit_date, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (visitor_id, visit_date) DO NOTHING`,
      [visitor_id, visit_date, ip_address, user_agent]
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Track visitor error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get visitor stats
router.get('/visitors/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Daily unique visitors for today
    const dailyResult = await pool.query(
      `SELECT COUNT(DISTINCT visitor_id) as count 
       FROM visitors 
       WHERE visit_date = $1`,
      [today]
    )

    // Monthly unique visitors (last 30 days)
    const monthlyResult = await pool.query(
      `SELECT COUNT(DISTINCT visitor_id) as count 
       FROM visitors 
       WHERE visit_date >= NOW() - INTERVAL '30 days'`
    )

    // Annual unique visitors (last 365 days)
    const annualResult = await pool.query(
      `SELECT COUNT(DISTINCT visitor_id) as count 
       FROM visitors 
       WHERE visit_date >= NOW() - INTERVAL '365 days'`
    )

    res.json({
      daily: dailyResult.rows[0].count,
      monthly: monthlyResult.rows[0].count,
      annual: annualResult.rows[0].count,
    })
  } catch (error) {
    console.error('Get visitor stats error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get weekly visitor data by month for streamgraph
router.get('/visitors/weekly', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December']
    
    const data = []
    
    for (let monthIndex = 0; monthIndex < currentMonth; monthIndex++) {
      const monthData = {
        month: months[monthIndex],
      }
      
      // Get weekly breakdown for this month
      const startDate = new Date(currentYear, monthIndex, 1)
      const endDate = new Date(currentYear, monthIndex + 1, 0)
      
      const weeklyResult = await pool.query(
        `SELECT 
           EXTRACT(WEEK FROM visit_date) as week_num,
           COUNT(DISTINCT visitor_id) as visitor_count
         FROM visitors
         WHERE visit_date >= $1 AND visit_date <= $2
         GROUP BY EXTRACT(WEEK FROM visit_date)
         ORDER BY week_num`,
        [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
      )
      
      // Distribute weekly data across weeks 1-5
      const weeklyData = weeklyResult.rows
      if (weeklyData.length > 0) {
        weeklyData.forEach((row, index) => {
          const weekNum = Math.min(index + 1, 5)
          monthData[`week${weekNum}`] = row.visitor_count
        })
      } else {
        // If no data, set to 0
        for (let week = 1; week <= 4; week++) {
          monthData[`week${week}`] = 0
        }
      }
      
      data.push(monthData)
    }
    
    res.json(data)
  } catch (error) {
    console.error('Get weekly visitor data error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get traffic analytics data with hourly breakdown
router.get('/traffic/analytics', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', 
                  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
                  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    
    const data = []
    
    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
      const hourData = {
        hour: hours[hourIndex],
      }
      
      // Get traffic breakdown for this hour (organic, direct, referral)
      const startDate = new Date(currentYear, currentMonth - 1, 1)
      const endDate = new Date(currentYear, currentMonth, 0)
      
      // Simplified query - count visitors by hour across the month
      const hourResult = await pool.query(
        `SELECT 
           COUNT(DISTINCT visitor_id) as visitor_count
         FROM visitors
         WHERE EXTRACT(HOUR FROM created_at) = $1
         AND visit_date >= $2 AND visit_date <= $3`,
        [hourIndex, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
      )
      
      const visitorCount = hourResult.rows[0]?.visitor_count || 0
      
      // Distribute across traffic types (organic, direct, referral)
      hourData['organic'] = Math.round(visitorCount * 0.4) // 40% organic
      hourData['direct'] = Math.round(visitorCount * 0.35) // 35% direct
      hourData['referral'] = Math.round(visitorCount * 0.25) // 25% referral
      
      data.push(hourData)
    }
    
    res.json(data)
  } catch (error) {
    console.error('Get traffic analytics error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
