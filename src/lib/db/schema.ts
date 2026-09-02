import { pgTable, uuid, text, integer, date, timestamp, index } from 'drizzle-orm/pg-core';

export const empleada = pgTable('empleada', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});

export const conceptoPago = pgTable('concepto_pago', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  precioUnitario: integer('precio_unitario').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const cuentaSemanal = pgTable('cuenta_semanal', {
  id: uuid('id').primaryKey().defaultRandom(),
  empleadaId: uuid('empleada_id').notNull().references(() => empleada.id),
  fechaInicio: date('fecha_inicio').notNull(),
  fechaFin: date('fecha_fin').notNull(),
  total: integer('total').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const trabajoRealizado = pgTable('trabajo_realizado', {
  id: uuid('id').primaryKey().defaultRandom(),
  empleadaId: uuid('empleada_id').notNull().references(() => empleada.id, { onDelete: 'cascade' }),
  conceptoId: uuid('concepto_id').references(() => conceptoPago.id, { onDelete: 'set null' }),
  precioHistorico: integer('precio_historico').notNull(),
  cantidad: integer('cantidad').notNull(),
  fecha: date('fecha').notNull(),
  cuentaSemanalId: uuid('cuenta_semanal_id').references(() => cuentaSemanal.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (t) => [
  index('idx_trabajo_cuenta').on(t.cuentaSemanalId)
]);
