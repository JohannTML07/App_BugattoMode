import { db } from '@/lib/db'
import { empleada, conceptoPago, trabajoRealizado } from '@/lib/db/schema'
import { createTrabajo, deleteTrabajo } from './actions'
import { eq, isNull, desc } from 'drizzle-orm'
import { Trash2, Briefcase, PlusCircle } from 'lucide-react'
import { SearchableSelect } from '@/components/SearchableSelect'

export const dynamic = 'force-dynamic'

export default async function TrabajosPage() {
  const empleadasList = await db.select().from(empleada).where(isNull(empleada.deletedAt))
  const conceptosList = await db.select().from(conceptoPago)
  
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Registro de Trabajo Diario</h1>
          <p className="text-gray-500 mt-1">Registra las piezas completadas (los precios se congelan al guardar).</p>
        </div>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Ingresar nuevo trabajo</h2>
        </div>
        <form action={createTrabajo} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Emplead@</label>
            <SearchableSelect
              name="empleada_id"
              placeholder="Emplead@"
              searchPlaceholder="Buscar emplead@..."
              options={empleadasList.map(e => ({
                id: e.id,
                label: e.nombre
              }))}
            />
          </div>
          
          <div className="flex flex-col gap-1.5 sm:col-span-1 lg:col-span-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Concepto / Trabajo</label>
            <SearchableSelect
              name="concepto_id"
              placeholder="Buscar concepto..."
              searchPlaceholder="Escribe para buscar..."
              options={conceptosList.map(c => ({
                id: c.id,
                label: `${c.nombre} ($${(c.precioUnitario / 100).toFixed(2)})`
              }))} 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Piezas</label>
            <input 
              type="number" 
              name="cantidad" 
              placeholder="0" 
              min="1"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm w-full h-[46px]"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Fecha</label>
            <input 
              type="date" 
              name="fecha" 
              defaultValue={today}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm w-full h-[46px]"
              required
            />
          </div>
          
          <div className="sm:col-span-2 lg:col-span-5 flex justify-end mt-2">
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm"
            >
              Registrar Trabajo
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Briefcase className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Trabajos sin liquidar (Pendientes)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Emplead@</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trabajo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cant.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio U.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {pendingWorks.map((work) => (
                <tr key={work.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{work.empleadaNombre || 'Desconocida'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{work.conceptoNombre || 'Eliminado'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{work.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(work.precioHistorico / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    ${((work.precioHistorico * work.cantidad) / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={async () => {
                      'use server'
                      await deleteTrabajo(work.id)
                    }}>
                      <button type="submit" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar registro">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {pendingWorks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Briefcase size={32} className="text-gray-300" />
                      <p>No hay trabajos pendientes de liquidar.</p>
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
