import { db } from '@/lib/db'
import { empleada, cuentaSemanal } from '@/lib/db/schema'
import { generarLiquidacion } from './actions'
import { eq, isNull, desc } from 'drizzle-orm'
import { FileDown, FileText, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CuentasPage() {
  const empleadasList = await db.select().from(empleada).where(isNull(empleada.deletedAt))
  
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Liquidaciones Semanales</h1>
          <p className="text-gray-500 mt-1">Genera el corte semanal de pago y descarga el recibo PDF.</p>
        </div>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Generar Liquidación (Corte)</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 max-w-2xl">
          Al generar la liquidación, se sumarán todos los trabajos sin pagar de la empleada seleccionada y se cerrará su cuenta.
        </p>
        
        <form action={generarLiquidacion} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5 lg:col-span-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Emplead@</label>
            <select 
              name="empleada_id" 
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm w-full h-[46px]"
              required
            >
              <option value="">Seleccionar...</option>
              {empleadasList.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Fecha Inicial (Lunes)</label>
            <input 
              type="date" 
              name="fecha_inicio" 
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm w-full h-[46px]"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Fecha Final (Sábado)</label>
            <input 
              type="date" 
              name="fecha_fin" 
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm w-full h-[46px]"
              required
            />
          </div>
          
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Cerrar Cuenta
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <FileText className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Historial de Liquidaciones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fecha de Corte</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Emplead@</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Periodo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Pagado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Recibo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {cuentasList.map((cuenta) => (
                <tr key={cuenta.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {new Date(cuenta.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{cuenta.empleadaNombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cuenta.fechaInicio} / {cuenta.fechaFin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    ${(cuenta.total / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/api/pdf/${cuenta.id}`} 
                      target="_blank" 
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-600/30 transition-all text-xs font-semibold"
                    >
                      <FileDown size={14} />
                      PDF
                    </Link>
                  </td>
                </tr>
              ))}
              {cuentasList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={32} className="text-gray-300" />
                      <p>No hay liquidaciones registradas.</p>
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
