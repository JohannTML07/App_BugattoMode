import { db } from '@/lib/db'
import { empleada, conceptoPago, trabajoRealizado } from '@/lib/db/schema'
import { createTrabajo, deleteTrabajo } from './actions'
import { eq, isNull, desc } from 'drizzle-orm'
import { Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TrabajosPage() {
  const empleadasList = await db.select().from(empleada).where(isNull(empleada.deletedAt))
  const conceptosList = await db.select().from(conceptoPago)
  
  // Get all pending works (unpaid)
  const pendingWorks = await db
    .select({
      id: trabajoRealizado.id,
      fecha: trabajoRealizado.fecha,
      cantidad: trabajoRealizado.cantidad,
      precioHistorico: trabajoRealizado.precioHistorico,
      empleadaNombre: empleada.nombre,
      conceptoNombre: conceptoPago.nombre,
    })
    .from(trabajoRealizado)
    .leftJoin(empleada, eq(trabajoRealizado.empleadaId, empleada.id))
    .leftJoin(conceptoPago, eq(trabajoRealizado.conceptoId, conceptoPago.id))
    .where(isNull(trabajoRealizado.cuentaSemanalId))
    .orderBy(desc(trabajoRealizado.fecha))

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Registro de Trabajo Diario</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Ingresar nuevo trabajo</h2>
        <form action={createTrabajo} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select 
            name="empleada_id" 
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white"
            required
          >
            <option value="">Selecciona Empleada</option>
            {empleadasList.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
          
          <select 
            name="concepto_id" 
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white"
            required
          >
            <option value="">Selecciona Trabajo</option>
            {conceptosList.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} (${(c.precioUnitario / 100).toFixed(2)})</option>
            ))}
          </select>
          
          <input 
            type="number" 
            name="cantidad" 
            placeholder="Cant. de piezas" 
            min="1"
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            required
          />
          
          <input 
            type="date" 
            name="fecha" 
            defaultValue={today}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            required
          />
          
          <button 
            type="submit" 
            className="bg-[#B8860B] hover:bg-[#D4AF37] text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Registrar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-md font-semibold text-gray-700">Trabajos sin liquidar (Pendientes)</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cant.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingWorks.map((work) => (
              <tr key={work.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{work.empleadaNombre || 'Desconocida'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{work.conceptoNombre || 'Eliminado'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{work.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${(work.precioHistorico / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">
                  ${((work.precioHistorico * work.cantidad) / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form action={async () => {
                    'use server'
                    await deleteTrabajo(work.id)
                  }}>
                    <button type="submit" className="text-red-500 hover:text-red-700" title="Eliminar registro">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {pendingWorks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  No hay trabajos pendientes de liquidar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
