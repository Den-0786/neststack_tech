import { useRef, useState } from 'react'
import { Upload, Loader2, CheckCircle2, AlertCircle, Image } from 'lucide-react'
import { uploadToS3 } from '../../lib/s3Upload'

/**
 * Compact S3 image uploader.
 * Two small boxes side by side:
 *   Left  = picture preview box
 *   Right = upload button with text
 *
 * Props:
 *  - folder      S3 subfolder (default 'uploads')
 *  - accept      file types (default 'image/*')
 *  - onUploaded  callback(url)
 *  - preview     current image URL
 *  - light       boolean theme
 *  - label       button text (default 'Upload picture')
 */
export default function S3ImageUpload({
  folder = 'uploads',
  accept = 'image/*',
  onUploaded,
  preview,
  light = false,
  label = 'Upload picture',
}) {
  const ref = useRef(null)
  const [status, setStatus] = useState('idle') // idle | uploading | done | error
  const [errMsg, setErrMsg] = useState('')
  const [localPrev, setLocalPrev] = useState(null)

  const borderIdle = light ? 'border-gray-200' : 'border-site-border'
  const bgBox      = light ? 'bg-gray-50' : 'bg-site-bg'
  const textColor  = light ? 'text-gray-600' : 'text-site-muted'

  async function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') && accept === 'image/*') {
      setErrMsg('Only image files are allowed.')
      setStatus('error')
      return
    }

    setLocalPrev(URL.createObjectURL(file))
    setStatus('uploading')
    setErrMsg('')

    try {
      const url = await uploadToS3(file, folder)
      setStatus('done')
      onUploaded?.(url)
    } catch (err) {
      console.error('S3 upload error:', err)
      setErrMsg(err?.message || 'Upload failed. Check AWS credentials.')
      setStatus('error')
    }

    e.target.value = ''
  }

  const thumb = localPrev || preview
  const isError = status === 'error'
  const isDone = status === 'done'
  const isUploading = status === 'uploading'

  return (
    <div className="space-y-2">
      <input ref={ref} type="file" accept={accept} onChange={handleChange} className="hidden" />

      <div className="flex gap-2">
        {/* Left: picture preview box */}
        <div className={`relative w-20 h-20 shrink-0 border flex items-center justify-center overflow-hidden ${
          isError ? 'border-red-400/50' : isDone ? 'border-neon/50' : borderIdle
        } ${bgBox}`}>
          {thumb ? (
            <img
              src={thumb}
              alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <Image size={20} className={textColor} />
          )}
        </div>

        {/* Right: upload button box */}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={isUploading}
          className={`w-20 h-20 shrink-0 border flex flex-col items-center justify-center gap-1.5 px-2 transition-colors ${
            isError ? 'border-red-400/50 bg-red-400/5' : isDone ? 'border-neon/50 bg-neon/5' : `${borderIdle} hover:border-neon/50 ${bgBox}`
          }`}
        >
          {isUploading ? (
            <Loader2 size={16} className="text-yellow-400 animate-spin" />
          ) : isDone ? (
            <CheckCircle2 size={16} className="text-neon" />
          ) : isError ? (
            <AlertCircle size={16} className="text-red-400" />
          ) : (
            <Upload size={16} className={textColor} />
          )}
          <span className={`font-mono text-[10px] uppercase tracking-widest text-center leading-tight ${
            isError ? 'text-red-400' : isDone ? 'text-neon' : textColor
          }`}>
            {isUploading ? 'Uploading…' : isDone ? 'Done' : isError ? 'Try again' : label}
          </span>
        </button>
      </div>

      {isError && (
        <p className="font-mono text-[10px] text-red-400 flex items-start gap-1">
          <AlertCircle size={10} className="shrink-0 mt-0.5" />
          {errMsg}
        </p>
      )}
    </div>
  )
}
