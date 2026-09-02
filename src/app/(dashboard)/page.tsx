import { db } from '@/lib/db'
import { empleada, conceptoPago, trabajoRealizado, cuentaSemanal } from '@/lib/db/schema'
import { isNull, sql } from 'drizzle-orm'
import { Users, Briefcase, DollarSign, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Fetch metrics
  const [{ count: empleadasCount }] = await db.select({ count: sql<number>`count(*)` }).from(empleada).where(isNull(empleada.deletedAt))
  const [{ count: conceptosCount }] = await db.select({ count: sql<number>`count(*)` }).from(conceptoPago)
  const [{ count: trabajosPendientes }] = await db.select({ count: sql<number>`count(*)` }).from(trabajoRealizado).where(isNull(trabajoRealizado.cuentaSemanalId))
  const [{ count: liquidacionesCount }] = await db.select({ count: sql<number>`count(*)` }).from(cuentaSemanal)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Inicio</h1>
          <p className="text-gray-500 mt-1">Resumen general de operaciones de nómina.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Emplead@s Activ@s</p>
            <h3 className="text-2xl font-bold text-gray-900">{empleadasCount}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Precios a Destajo</p>
            <h3 className="text-2xl font-bold text-gray-900">{conceptosCount}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Trabajos Pendientes</p>
            <h3 className="text-2xl font-bold text-gray-900">{trabajosPendientes}</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Cuentas Pagadas</p>
            <h3 className="text-2xl font-bold text-gray-900">{liquidacionesCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Bienvenido al sistema administrativo</h2>
        <p className="text-gray-500 max-w-3xl leading-relaxed">
          Usa el menú lateral para navegar por las distintas secciones. Recuerda que todos los trabajos registrados
          toman el precio al momento de su captura, garantizando la integridad de las cuentas al final de la semana, 
          incluso si los precios a destajo cambian en el futuro.
        </p>
      </div>
    </div>
  );
}
