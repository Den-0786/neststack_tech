import pool from './config/database.js'
import bcrypt from 'bcryptjs'

async function seed() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 1. Create admin user
    const hashedPassword = await bcrypt.hash('NestStack26', 10)
    await client.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', hashedPassword]
    )
    console.log('✓ Admin user created')

    // 2. Insert bio
    await client.query(
      `INSERT INTO bio (name, location, about, avatar, cv_url, github_url, roles)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [
        'Dennis Opoku Amponsah',
        'Kumasi, Ghana',
        'I combine innovation, security, and creativity to deliver exceptional digital experiences. As a frontend developer striving to become a full-stack developer, cybersecurity enthusiast, and graphic designer, I build secure, scalable, and visually engaging web solutions.',
        '/portimages/abouttemp.jpeg',
        '#',
        'https://github.com/',
        JSON.stringify(['Frontend Developer', 'Cybersecurity Enthusiast', 'Graphic Designer']),
      ]
    )
    console.log('✓ Bio inserted')

    // 3. Insert contact
    await client.query(
      `INSERT INTO contact (phone1, email, linkedin, twitter, instagram, facebook)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [
        '+233 245 660 786',
        'dennisopokamponsah86@gmail.com',
        'https://www.linkedin.com/in/dennis-opoku-amponsah-3911aa31b',
        'https://x.com/DennisOpok35210',
        'https://www.instagram.com/opoku2102/',
        'https://www.facebook.com/profile.php?id=100085692115198',
      ]
    )
    console.log('✓ Contact inserted')

    // 4. Insert skills
    const skills = [
      { category: 'CORE ARCHITECTURE', items: ['React', 'Node.js', 'Express', 'Django', 'PostgreSQL', 'MySQL'] },
      { category: 'UI ENTRANCE CRAFT', items: ['Tailwind CSS', 'HTML / CSS', 'Bootstrap', 'Figma', 'Adobe Photoshop'] },
      { category: 'SYSTEM SECURITY', items: ['Penetration Testing', 'Secure Coding', 'OWASP Top 10', 'Network Security', 'Cryptography'] },
    ]
    for (const skill of skills) {
      await client.query(
        `INSERT INTO skills (category, items)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [skill.category, JSON.stringify(skill.items)]
      )
    }
    console.log('✓ Skills inserted')

    // 5. Insert projects
    const projects = [
      {
        title: 'Local Service Finder',
        description: 'Full-stack booking platform connecting users to local service providers with reviews and payments.',
        image: '/portimages/agency.png',
        tags: JSON.stringify(['React', 'Node.js', 'PostgreSQL']),
        github_url: '#',
        live_url: '#',
      },
      {
        title: 'E-Commerce Boutique',
        description: 'Online fashion store with product listings, cart, checkout, and an admin dashboard.',
        image: '/portimages/bite.png',
        tags: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        github_url: '#',
        live_url: '#',
      },
      {
        title: 'Hotel Reservation App',
        description: 'Room and table booking system with real-time availability tracking.',
        image: '/portimages/hotel.png',
        tags: JSON.stringify(['React', 'Express', 'MySQL']),
        github_url: '#',
        live_url: '#',
      },
      {
        title: 'TinDog',
        description: 'A fun dog-matching web application inspired by Tinder, built with Bootstrap.',
        image: '/portimages/tindog.png',
        tags: JSON.stringify(['Bootstrap', 'JavaScript']),
        github_url: '#',
        live_url: '#',
      },
    ]
    for (const project of projects) {
      await client.query(
        `INSERT INTO projects (title, description, image, tags, github_url, live_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [project.title, project.description, project.image, project.tags, project.github_url, project.live_url]
      )
    }
    console.log('✓ Projects inserted')

    // 6. Insert certificates
    const certificates = [
      { title: 'Cloud Architecture', issuer: 'Amazon Web Services', date: '12 OCT 2023', image: '' },
      { title: 'Zero Trust Security Expert', issuer: 'Global InfoSec Council', date: '04 JAN 2024', image: '' },
      { title: 'Advanced Cryptography', issuer: 'Stanford Center for Prof.', date: '22 JUN 2023', image: '' },
      { title: 'HIPAA Compliance Audit', issuer: 'Internal Audit Division', date: '15 MAR 2023', image: '' },
    ]
    for (const cert of certificates) {
      await client.query(
        `INSERT INTO certificates (title, issuer, date, image)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [cert.title, cert.issuer, cert.date, cert.image]
      )
    }
    console.log('✓ Certificates inserted')

    await client.query('COMMIT')
    console.log('\n✅ Database seeded successfully!')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Seed failed:', err)
    throw err
  } finally {
    client.release()
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1))
