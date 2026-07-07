import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const REGION      = import.meta.env.VITE_AWS_REGION
const BUCKET      = import.meta.env.VITE_AWS_BUCKET_NAME
const BUCKET_URL  = import.meta.env.VITE_AWS_BUCKET_URL

const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId:     import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
})

/**
 * Uploads a File to S3 and returns its public URL.
 * @param {File} file
 * @param {string} folder  e.g. 'avatars', 'projects', 'certificates'
 * @returns {Promise<string>} public URL
 */
export async function uploadToS3(file, folder = 'uploads') {
  const ext  = file.name.split('.').pop()
  const key  = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const cmd = new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        file,
    ContentType: file.type,
    ACL:         'public-read',
  })

  await client.send(cmd)
  return `${BUCKET_URL}/${key}`
}
