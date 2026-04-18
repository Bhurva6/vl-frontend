interface KPIUnitProps {
  label: string
  value: string
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
  borderTone?: 'blue' | 'amber' | 'red' | 'green' | 'rose'
}

const borderMap = {
  blue: 'border-[#0066FF]',
  amber: 'border-[#FF6B00]',
  red: 'border-[#E5000A]',
  green: 'border-[#00B341]',
  rose: 'border-rose-700',
}

const deltaMap = {
  up: 'text-[#00B341]',
  down: 'text-[#E5000A]',
  neutral: 'text-[#6B7280]',
}

const KPIUnit = ({ label, value, delta, deltaTone = 'neutral', borderTone = 'blue' }: KPIUnitProps) => {
  return (
    <div className={`flex-1 border-l-4 ${borderMap[borderTone]} px-5 py-6`}>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">{label}</p>
      <p className="mt-3 font-mono text-[36px] font-bold leading-none text-[#0A0A0A]">{value}</p>
      {delta ? <p className={`mt-2 font-mono text-[12px] ${deltaMap[deltaTone]}`}>{delta}</p> : <p className="mt-2 font-mono text-[12px] text-[#6B7280]">-</p>}
    </div>
  )
}

export default KPIUnit
