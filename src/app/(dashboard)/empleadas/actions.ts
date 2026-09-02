'use server'

import { db } from '@/lib/db'
import { empleada } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createEmpleada(formData: FormData) {
  const nombre = formData.get('nombre') as string
  if (!nombre) return
  
  await db.insert(empleada).values({ nombre })
  revalidatePath('/empleadas')
}

export async function deleteEmpleada(id: string) {
  // Using soft delete as per blueprint
  await db.update(empleada)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(empleada.id, id))
  
  revalidatePath('/empleadas')
}
