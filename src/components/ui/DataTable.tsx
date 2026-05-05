import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export interface DataTableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends Record<string, unknown>> {
  rows: T[]
  columns: DataTableColumn<T>[]
  rowKey: (row: T) => string | number
  searchPlaceholder?: string
  showSearch?: boolean
  onRowClick?: (row: T) => void
  isLoading?: boolean
  pageSize?: number
}

function compareValues(a: unknown, b: unknown): number {
  const na = Number(a)
  const nb = Number(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return String(a ?? '').localeCompare(String(b ?? ''))
}

const DataTable = <T extends Record<string, unknown>>({
  rows,
  columns,
  rowKey,
  searchPlaceholder = 'Search...',
  showSearch = true,
  onRowClick,
  isLoading,
  pageSize = 50,
}: DataTableProps<T>) => {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  // reset to page 1 whenever search, sort, or source data changes
  useEffect(() => { setPage(1) }, [query, sortKey, sortDir, rows])

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = q
      ? rows.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)))
      : rows

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const cmp = compareValues(a[sortKey as keyof T], b[sortKey as keyof T])
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return result
  }, [rows, query, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
  const from = sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, sorted.length)

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function SortIcon({ col }: { col: DataTableColumn<T> }) {
    if (!col.sortable) return null
    if (sortKey !== String(col.key)) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
    return sortDir === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 text-[#0066FF]" />
      : <ArrowDown className="h-3.5 w-3.5 text-[#0066FF]" />
  }

  return (
    <div className="space-y-4 bg-white">
      {showSearch ? (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-none border-0 border-b-2 border-[#D1D5DB] pl-9 focus-visible:ring-0"
            placeholder={searchPlaceholder}
          />
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className="border-b border-[#F3F4F6] px-3 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400"
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-[#0A0A0A]"
                      onClick={() => handleSort(String(col.key))}
                    >
                      {col.label}
                      <SortIcon col={col} />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="border-b border-[#F3F4F6] px-3 py-3" colSpan={columns.length}>
                    <Skeleton className="h-7 w-full rounded-none bg-gray-100" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              pageRows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer border-b border-[#F3F4F6] hover:bg-[#F8F9FA]' : 'border-b border-[#F3F4F6] hover:bg-[#F8F9FA]'}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="px-3 py-3 align-top text-sm text-[#0A0A0A]">
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && sorted.length === 0 && (
        <div className="border border-dashed border-gray-200 p-10 text-center">
          <div className="mx-auto mb-3 h-14 w-14 bg-gray-100" />
          <p className="font-semibold text-gray-700">No results found</p>
          <p className="text-sm text-gray-500">Try changing filters or search keywords.</p>
        </div>
      )}

      {!isLoading && sorted.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-3">
          <span className="font-mono text-[11px] text-gray-400">
            {from}–{to} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-7 w-7 items-center justify-center border border-[#E5E7EB] text-gray-500 disabled:opacity-30 hover:border-[#0066FF] hover:text-[#0066FF]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | '…')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="px-1 font-mono text-[11px] text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`h-7 min-w-[28px] border px-1.5 font-mono text-[11px] ${
                      safePage === p
                        ? 'border-[#0066FF] bg-[#0066FF] text-white'
                        : 'border-[#E5E7EB] text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF]'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-7 w-7 items-center justify-center border border-[#E5E7EB] text-gray-500 disabled:opacity-30 hover:border-[#0066FF] hover:text-[#0066FF]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
