import type { ReactNode } from 'react'

const ChartContainer = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => {
  return (
    <section className="space-y-4 border-b border-[#F3F4F6] pb-8 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="h-5 w-[3px] shrink-0 bg-[#0066FF]" />
          <h3 className="font-display text-[22px] italic text-[#0A0A0A]">{title}</h3>
          <div className="h-px flex-1 bg-[#F3F4F6]" />
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      <div>{children}</div>
    </section>
  )
}

export default ChartContainer
