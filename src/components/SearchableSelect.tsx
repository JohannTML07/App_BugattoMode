'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

type Option = { id: string; label: string }

interface SearchableSelectProps {
  name: string
  options: Option[]
  placeholder?: string
  searchPlaceholder?: string
  required?: boolean
}

export function SearchableSelect({
  name,
  options,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Escribe para buscar...',
  required = true,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Option | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative w-full" ref={ref}>
      <input type="hidden" name={name} value={selected?.id || ''} required={required} />

      <div
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:border-indigo-600 h-[46px] transition-all"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`truncate text-sm ${
            selected ? 'text-gray-900 font-medium' : 'text-gray-500'
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-indigo-600' : ''
          }`}
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              className="w-full text-sm outline-none bg-transparent text-gray-900"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No se encontraron resultados.
              </div>
            ) : (
              filtered.map((opt) => (
                <div
                  key={opt.id}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    selected?.id === opt.id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                  onClick={() => {
                    setSelected(opt)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
