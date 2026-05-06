import { useEffect, useState } from 'react'
import { fetchPresignedUrl } from '@/services/imageService'
import type { AlertRecord } from '@/types'
import Modal from './Modal'

interface AlertDetailModalProps {
  selected: AlertRecord | null
  onClose: () => void
}

const AlertDetailModal = ({ selected, onClose }: AlertDetailModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    if (!selected) {
      setImageUrl(null)
      return
    }

    // Use base64 image directly if available (gate/presence detectors)
    if (selected.image_byte_str) {
      setImageUrl(`data:image/jpeg;base64,${selected.image_byte_str}`)
      setImageLoading(false)
      return
    }

    // Fall back to S3 presigned URL for older alerts
    if (selected.image_id) {
      setImageLoading(true)
      setImageUrl(null)
      fetchPresignedUrl(selected.image_id).then((url) => {
        setImageUrl(url)
        setImageLoading(false)
      })
      return
    }

    setImageUrl(null)
    setImageLoading(false)
  }, [selected])

  return (
    <Modal open={Boolean(selected)} onClose={onClose} title="Alert Detail">
      {selected ? (
        <div className="space-y-4">
          <div className="relative flex h-56 items-center justify-center border border-dashed border-[#E5E7EB] bg-[#F8F9FA] overflow-hidden">
            {imageLoading && (
              <span className="font-mono text-[11px] text-[#6B7280]">Loading image…</span>
            )}
            {!imageLoading && imageUrl && (
              <img
                src={imageUrl}
                alt="Alert snapshot"
                className="h-full w-full object-contain"
              />
            )}
            {!imageLoading && !imageUrl && (
              <span className="font-mono text-[11px] text-[#6B7280]">Image unavailable</span>
            )}
          </div>

          <div className="grid gap-2 font-sans text-sm text-[#0A0A0A]">
            <p><span className="font-semibold">DateTime:</span> <span className="font-mono">{selected.date_time}</span></p>
            <p><span className="font-semibold">Store:</span> {selected.store_code}</p>
            <p><span className="font-semibold">Camera Port_Channel:</span> <span className="font-mono">{selected.camera}</span></p>
            <p><span className="font-semibold">Type:</span> {selected.alert_type}</p>
            <p><span className="font-semibold">Explanation:</span> {selected.category === 'INTRUSION' ? 'Unauthorized persons identified' : selected.explanation}</p>
          </div>

        </div>
      ) : null}
    </Modal>
  )
}

export default AlertDetailModal
