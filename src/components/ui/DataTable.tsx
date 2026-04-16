import { ArrowUpDown, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
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
  onRowClick?: (row: T) => void
  isLoading?: boolean
}

const DataTable = <T extends Record<string, unknown>>({
  rows,
  columns,
  rowKey,
  searchPlaceholder = 'Search...',
  onRowClick,
  isLoading,
}: DataTableProps<T>) => {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = rows

    if (q) {
      result = rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(q)))
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = String(a[sortKey as keyof T] ?? '')
        const bv = String(b[sortKey as keyof T] ?? '')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }

    return result
  }, [rows, query, sortKey, sortDir])

  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-gray-400" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder={searchPlaceholder} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>
                  <button
                    className="inline-flex items-center gap-1"
                    type="button"
                    onClick={() => {
                      if (!column.sortable) return
                      if (sortKey === String(column.key)) {
                        setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
                      } else {
                        setSortKey(String(column.key))
                        setSortDir('asc')
                      }
                    }}
                  >
                    {column.label}
                    {column.sortable && <ArrowUpDown className="h-3.5 w-3.5" />}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={columns.length}>
                    <Skeleton className="h-7 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              filtered.map((row) => (
                <TableRow key={rowKey(row)} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer' : ''}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-gray-100" />
          <p className="font-semibold text-gray-700">No results found</p>
          <p className="text-sm text-gray-500">Try changing filters or search keywords.</p>
        </div>
      )}
    </div>
  )
}

export default DataTable
