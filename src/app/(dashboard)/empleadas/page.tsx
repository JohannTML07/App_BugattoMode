import { db } from '@/lib/db'
import { empleada } from '@/lib/db/schema'
import { createEmpleada, deleteEmpleada } from './actions'
import { isNull } from 'drizzle-orm'
import { Trash2, UserPlus, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EmpleadasPage() {
  const empleadasList = await db.select().from(empleada).where(isNull(empleada.deletedAt))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Emplead@s</h1>
          <p className="text-gray-500 mt-1">Administra el padrón de emplead@s del taller.</p>
        </div>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Añadir nueva emplead@</h2>
        </div>
        <form action={createEmpleada} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre completo de la emplead@" 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm text-gray-900"
            required
          />
          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm shrink-0"
          >
            Guardar Emplead@
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Users className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Directorio de Emplead@s</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fecha Registro</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {empleadasList.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{emp.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={async () => {
                      'use server'
                      await deleteEmpleada(emp.id)
                    }}>
                      <button type="submit" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {empleadasList.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={32} className="text-gray-300" />
                      <p>No hay emplead@s registradas.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
