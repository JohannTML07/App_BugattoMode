'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Users, Scissors, Briefcase, FileText, LayoutDashboard, Menu, X } from 'lucide-react'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Inicio', icon: LayoutDashboard },
    { href: '/empleadas', label: 'Emplead@s', icon: Users },
    { href: '/conceptos', label: 'Precios y Trabajos', icon: Scissors },
    { href: '/trabajos', label: 'Registro Diario', icon: Briefcase },
    { href: '/cuentas', label: 'Liquidaciones', icon: FileText },
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-yellow-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
            B
          </div>
          <span className="font-bold text-gray-900">Bugatto Mode</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 md:w-64 bg-white border-r border-gray-100 
        flex flex-col h-[100dvh]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
              B
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Bugatto Mode</h1>
              <p className="text-xs text-gray-500 font-medium">Control de Nómina</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3 mt-4 md:mt-0">
            Menú Principal
          </div>
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
                  ${isActive 
                    ? 'bg-yellow-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <link.icon size={18} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                {link.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all text-sm font-medium">
              <LogOut size={18} className="text-red-500" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
