import { db } from '@/lib/db'
import { conceptoPago } from '@/lib/db/schema'
import { createConcepto, deleteConcepto } from './actions'
import { Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ConceptosPage() {
  const conceptosList = await db.select().from(conceptoPago)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Conceptos de Pago</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Añadir nuevo concepto (ej. Costura de mangas)</h2>
        <form action={createConcepto} className="flex gap-4">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre del trabajo" 
            className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            required
          />
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input 
              type="number" 
              name="precio_unitario" 
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-32 border rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {conceptosList.map((concepto) => (
              <tr key={concepto.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{concepto.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  ${(concepto.precioUnitario / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form action={async () => {
                    'use server'
                    await deleteConcepto(concepto.id)
                  }}>
                    <button type="submit" className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {conceptosList.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                  No hay conceptos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
