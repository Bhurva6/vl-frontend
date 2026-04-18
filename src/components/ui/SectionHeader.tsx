interface SectionHeaderProps {
  title: string
  action?: React.ReactNode
}

const SectionHeader = ({ title, action }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="h-5 w-[3px] shrink-0 bg-[#0066FF]" />
        <h2 className="font-display text-[22px] italic text-[#0A0A0A]">{title}</h2>
        <div className="h-px flex-1 bg-[#F3F4F6]" />
      </div>
      {action}
    </div>
  )
}

export default SectionHeader
