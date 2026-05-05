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
    setImageLoading(true)
    setImageUrl(null)
    fetchPresignedUrl(selected.image_id).then((url) => {
      setImageUrl(url)
      setImageLoading(false)
    })
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
            <p><span className="font-semibold">Camera:</span> {selected.camera}</p>
            <p><span className="font-semibold">Type:</span> {selected.alert_type}</p>
            <p><span className="font-semibold">Explanation:</span> {selected.explanation}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 border border-[#0066FF] bg-[#0066FF] px-4 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-white"
          >
            Mark as Reviewed
          </button>
        </div>
      ) : null}
    </Modal>
  )
}

export default AlertDetailModal
