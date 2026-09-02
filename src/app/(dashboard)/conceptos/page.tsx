import { db } from '@/lib/db'
import { conceptoPago } from '@/lib/db/schema'
import { createConcepto, deleteConcepto } from './actions'
import { Trash2, Scissors, PlusCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ConceptosPage() {
  const conceptosList = await db.select().from(conceptoPago)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Conceptos de Pago</h1>
          <p className="text-gray-500 mt-1">Configura los precios a destajo por tipo de trabajo.</p>
        </div>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Añadir nuevo concepto (ej. Costura de mangas)</h2>
        </div>
        <form action={createConcepto} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre del trabajo" 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
            required
          />
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400 font-medium">$</span>
            <input 
              type="number" 
              name="precio_unitario" 
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full md:w-40 bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm shrink-0"
          >
            Guardar Concepto
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Scissors className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Catálogo de Precios</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {conceptosList.map((concepto) => (
                <tr key={concepto.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{concepto.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                    ${(concepto.precioUnitario / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={async () => {
                      'use server'
                      await deleteConcepto(concepto.id)
                    }}>
                      <button type="submit" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {conceptosList.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Scissors size={32} className="text-gray-300" />
                      <p>No hay conceptos de pago registrados.</p>
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
