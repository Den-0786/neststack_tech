const express = require('express')
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

const router = express.Router()

// Configure AWS SES
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

// Send contact form email
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields required' })
    }

    const params = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [process.env.SES_TO_EMAIL],
      },
      Message: {
        Subject: {
          Data: `[Portfolio Contact] ${subject}`,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            Charset: 'UTF-8',
          },
        },
      },
    }

    const command = new SendEmailCommand(params)
    await sesClient.send(command)

    res.json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

module.exports = router
