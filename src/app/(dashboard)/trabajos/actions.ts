'use server'

import { db } from '@/lib/db'
import { trabajoRealizado, conceptoPago } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createTrabajo(formData: FormData) {
  const empleadaId = formData.get('empleada_id') as string
  const conceptoId = formData.get('concepto_id') as string
  const cantidadStr = formData.get('cantidad') as string
  const fecha = formData.get('fecha') as string

  if (!empleadaId || !conceptoId || !cantidadStr || !fecha) return

  const cantidad = parseInt(cantidadStr, 10)
  if (isNaN(cantidad) || cantidad <= 0) return

  // Lookup the exact current unit price for the concept
  const [concepto] = await db
    .select({ precioUnitario: conceptoPago.precioUnitario })
    .from(conceptoPago)
    .where(eq(conceptoPago.id, conceptoId))

  if (!concepto) return

  await db.insert(trabajoRealizado).values({
    empleadaId,
    conceptoId,
    precioHistorico: concepto.precioUnitario,
    cantidad,
    fecha
  })

  revalidatePath('/trabajos')
}

export async function deleteTrabajo(id: string) {
  await db.delete(trabajoRealizado).where(eq(trabajoRealizado.id, id))
  revalidatePath('/trabajos')
}
