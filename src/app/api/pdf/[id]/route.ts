import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cuentaSemanal, trabajoRealizado, empleada, conceptoPago } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { renderToStream } from '@react-pdf/renderer'
import { ReceiptDocument } from '@/lib/pdf/receipt'
import React from 'react'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Fetch account info
    const [cuenta] = await db
      .select({
        fechaInicio: cuentaSemanal.fechaInicio,
        fechaFin: cuentaSemanal.fechaFin,
        total: cuentaSemanal.total,
        empleadaNombre: empleada.nombre,
      })
      .from(cuentaSemanal)
      .innerJoin(empleada, eq(cuentaSemanal.empleadaId, empleada.id))
      .where(eq(cuentaSemanal.id, id))

    if (!cuenta) {
      return new NextResponse('Cuenta no encontrada', { status: 404 })
    }

    // Fetch jobs linked to this account
    const trabajos = await db
      .select({
        fecha: trabajoRealizado.fecha,
        cantidad: trabajoRealizado.cantidad,
        precioHistorico: trabajoRealizado.precioHistorico,
        conceptoNombre: conceptoPago.nombre,
      })
      .from(trabajoRealizado)
      .leftJoin(conceptoPago, eq(trabajoRealizado.conceptoId, conceptoPago.id))
      .where(eq(trabajoRealizado.cuentaSemanalId, id))

    // Render PDF
    const stream = await renderToStream(
      React.createElement(ReceiptDocument, {
        empleadaNombre: cuenta.empleadaNombre,
        fechaInicio: cuenta.fechaInicio,
        fechaFin: cuenta.fechaFin,
        totalCents: cuenta.total,
        trabajos: trabajos as any,
      }) as any
    )

    // @ts-ignore
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="liquidacion-${cuenta.empleadaNombre.replace(/\s+/g, '-')}-${cuenta.fechaInicio}.pdf"`
      }
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Error generating PDF', { status: 500 })
  }
}
