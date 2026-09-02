import { db } from '@/lib/db'
import { empleada, cuentaSemanal } from '@/lib/db/schema'
import { generarLiquidacion } from './actions'
import { eq, isNull, desc } from 'drizzle-orm'
import { FileDown } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CuentasPage() {
  const empleadasList = await db.select().from(empleada).where(isNull(empleada.deletedAt))
  
  // List accounts
  const cuentasList = await db
    .select({
      id: cuentaSemanal.id,
      fechaInicio: cuentaSemanal.fechaInicio,
      fechaFin: cuentaSemanal.fechaFin,
      total: cuentaSemanal.total,
      empleadaNombre: empleada.nombre,
      createdAt: cuentaSemanal.createdAt
    })
    .from(cuentaSemanal)
    .innerJoin(empleada, eq(cuentaSemanal.empleadaId, empleada.id))
    .orderBy(desc(cuentaSemanal.createdAt))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Liquidaciones Semanales</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Generar Liquidación (Corte Semanal)</h2>
        <p className="text-sm text-gray-600 mb-4">Esta acción tomará todos los trabajos sin liquidar de la empleada y cerrará su cuenta calculando el total a pagar.</p>
        <form action={generarLiquidacion} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Fecha de inicio (Semana)</label>
            <input 
              type="date" 
              name="fecha_inicio" 
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Fecha de fin (Semana)</label>
            <input 
              type="date" 
              name="fecha_fin" 
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>
          
          <div className="flex flex-col justify-end">
            <button 
              type="submit" 
              className="bg-[#B8860B] hover:bg-[#D4AF37] text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Cerrar Cuenta
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creada en</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pagado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Recibo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cuentasList.map((cuenta) => (
              <tr key={cuenta.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(cuenta.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cuenta.empleadaNombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cuenta.fechaInicio} al {cuenta.fechaFin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">
                  ${(cuenta.total / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/api/pdf/${cuenta.id}`} target="_blank" className="text-yellow-600 hover:text-yellow-800 flex items-center justify-end gap-1">
                    <FileDown size={18} />
                    PDF
                  </Link>
                </td>
              </tr>
            ))}
            {cuentasList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No hay liquidaciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
