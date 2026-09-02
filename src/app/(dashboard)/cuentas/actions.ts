'use server'

import { db } from '@/lib/db'
import { cuentaSemanal, trabajoRealizado } from '@/lib/db/schema'
import { eq, isNull, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function generarLiquidacion(formData: FormData) {
  const empleadaId = formData.get('empleada_id') as string
  const fechaInicio = formData.get('fecha_inicio') as string
  const fechaFin = formData.get('fecha_fin') as string

  if (!empleadaId || !fechaInicio || !fechaFin) return

  try {
    await db.transaction(async (tx) => {
      // Find pending jobs
      const pendientes = await tx
        .select()
        .from(trabajoRealizado)
        .where(
          and(
            eq(trabajoRealizado.empleadaId, empleadaId),
            isNull(trabajoRealizado.cuentaSemanalId)
          )
        )

      if (pendientes.length === 0) {
        throw new Error('No hay trabajos pendientes para esta empleada.')
      }

      // Calculate total (precioHistorico is in cents)
      const totalCents = pendientes.reduce((acc, job) => acc + (job.precioHistorico * job.cantidad), 0)

      // Create cuenta_semanal
      const [nuevaCuenta] = await tx
        .insert(cuentaSemanal)
        .values({
          empleadaId,
          fechaInicio,
          fechaFin,
          total: totalCents
        })
        .returning({ id: cuentaSemanal.id })

      // Associate pending jobs to this cuenta
      await tx
        .update(trabajoRealizado)
        .set({ cuentaSemanalId: nuevaCuenta.id })
        .where(
          and(
            eq(trabajoRealizado.empleadaId, empleadaId),
            isNull(trabajoRealizado.cuentaSemanalId)
          )
        )
    })
  } catch (error) {
    console.error(error)
    return
  }

  revalidatePath('/cuentas')
  revalidatePath('/trabajos') // Update pending list
}
