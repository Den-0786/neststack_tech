const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000'

/**
 * Uploads a File to S3 via backend proxy and returns its public URL.
 * @param {File} file
 * @param {string} folder  e.g. 'avatars', 'projects', 'certificates'
 * @returns {Promise<string>} public URL
 */
export async function uploadToS3(file, folder = 'uploads') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  const data = await response.json()
  return data.url
}
