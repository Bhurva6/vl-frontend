import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl border border-[#E5E7EB] bg-white p-5 shadow-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between border-b border-[#F3F4F6] pb-3">
          <h3 className="font-display text-[28px] italic text-[#0A0A0A]">{title}</h3>
          <button onClick={onClose} type="button" className="border border-gray-200 p-1 text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
