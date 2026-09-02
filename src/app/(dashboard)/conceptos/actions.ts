'use server'

import { db } from '@/lib/db'
import { conceptoPago } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createConcepto(formData: FormData) {
  const nombre = formData.get('nombre') as string
  const precioRaw = formData.get('precio_unitario') as string
  
  if (!nombre || !precioRaw) return
  
  // Convert $X.YY to cents
  const precioUnitario = Math.round(parseFloat(precioRaw) * 100)
  
  await db.insert(conceptoPago).values({ nombre, precioUnitario })
  revalidatePath('/conceptos')
}

export async function deleteConcepto(id: string) {
  // Real delete for conceptos
  await db.delete(conceptoPago).where(eq(conceptoPago.id, id))
  revalidatePath('/conceptos')
}
