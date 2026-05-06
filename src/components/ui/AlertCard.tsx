import { useEffect, useState } from 'react'
import { fetchPresignedUrl } from '@/services/imageService'
import type { AlertRecord } from '@/types'

const CAT_COLOR: Record<string, string> = {
  WATCHMAN:  'bg-red-50 text-red-700 border-red-200',
  PHONE:     'bg-orange-50 text-orange-700 border-orange-200',
  INTRUSION: 'bg-purple-50 text-purple-700 border-purple-200',
  GATE:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  PRESENCE:  'bg-blue-50 text-blue-700 border-blue-200',
}

interface AlertCardProps {
  record: AlertRecord
  onClick: () => void
}

const AlertCard = ({ record, onClick }: AlertCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imgLoading, setImgLoading] = useState(true)

  useEffect(() => {
    if (record.image_byte_str) {
      setImageUrl(`data:image/jpeg;base64,${record.image_byte_str}`)
      setImgLoading(false)
      return
    }
    if (record.image_id) {
      fetchPresignedUrl(record.image_id).then(url => {
        setImageUrl(url)
        setImgLoading(false)
      })
      return
    }
    setImgLoading(false)
  }, [record.image_byte_str, record.image_id])

  const badgeClass = CAT_COLOR[record.category] ?? 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden border border-[#E5E7EB] bg-white text-left transition hover:border-[#0066FF] hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-44 w-full shrink-0 bg-[#F3F4F6]">
        {imgLoading && (
          <div className="absolute inset-0 animate-pulse bg-[#E5E7EB]" />
        )}
        {!imgLoading && imageUrl && (
          <img
            src={imageUrl}
            alt="Alert snapshot"
            className="h-full w-full object-cover"
          />
        )}
        {!imgLoading && !imageUrl && (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-[10px] text-[#9CA3AF]">NO IMAGE</span>
          </div>
        )}
        {/* Category badge overlay */}
        <span className={`absolute top-2 left-2 border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${badgeClass}`}>
          {record.category}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="font-mono text-[11px] text-[#6B7280]">{record.date_time}</p>
        <p className="font-sans text-[12px] font-semibold text-[#0A0A0A] leading-snug">
          {record.alert_type}
        </p>
        <p className="font-sans text-[11px] text-[#6B7280] line-clamp-2">
          {record.category === 'INTRUSION' ? 'Unauthorized persons identified' : record.explanation}
        </p>
        <div className="mt-auto pt-2 border-t border-[#F3F4F6] flex flex-col gap-0.5">
          <p className="font-mono text-[10px] text-[#9CA3AF]">
            <span className="text-[#6B7280]">Store: </span>{record.store_code}
          </p>
          <p className="font-mono text-[10px] text-[#9CA3AF]">
            <span className="text-[#6B7280]">Cam: </span>{record.camera}
          </p>
        </div>
      </div>
    </button>
  )
}

export default AlertCard
