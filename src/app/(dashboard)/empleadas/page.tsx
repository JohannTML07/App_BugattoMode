import { db } from '@/lib/db'
import { empleada } from '@/lib/db/schema'
import { createEmpleada, deleteEmpleada } from './actions'
import { isNull } from 'drizzle-orm'
import { Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EmpleadasPage() {
  const empleadasList = await db.select().from(empleada).where(isNull(empleada.deletedAt))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Empleadas</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Añadir nueva empleada</h2>
        <form action={createEmpleada} className="flex gap-4">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre de la empleada" 
            className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            required
          />
          <button 
            type="submit" 
            className="bg-[#B8860B] hover:bg-[#D4AF37] text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Guardar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empleadasList.map((emp) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(emp.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form action={async () => {
                    'use server'
                    await deleteEmpleada(emp.id)
                  }}>
                    <button type="submit" className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {empleadasList.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                  No hay empleadas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
