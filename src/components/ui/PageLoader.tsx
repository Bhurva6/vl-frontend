const PageLoader = () => {
  return (
    <div className="flex min-h-[calc(100vh-240px)] items-center justify-center bg-white">
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <div className="h-3 w-full overflow-hidden border border-[#E5E7EB] bg-white">
          <div className="h-full w-2/3 animate-[pulse_1.2s_ease-in-out_infinite] bg-[#0066FF]" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6B7280]">LOADING FACTORY DATA...</p>
      </div>
    </div>
  )
}

export default PageLoader
