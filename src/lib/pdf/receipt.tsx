import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  section: { margin: 10, padding: 10 },
  row: { flexDirection: 'row', borderBottom: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  colHeader: { fontSize: 12, fontWeight: 'bold', width: '25%' },
  col: { fontSize: 12, width: '25%' },
  totalRow: { flexDirection: 'row', marginTop: 20, paddingTop: 10, borderTop: 2 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', width: '75%', textAlign: 'right', paddingRight: 10 },
  totalValue: { fontSize: 14, fontWeight: 'bold', width: '25%' },
})

type ReceiptProps = {
  empleadaNombre: string
  fechaInicio: string
  fechaFin: string
  totalCents: number
  trabajos: {
    fecha: string
    conceptoNombre: string
    cantidad: number
    precioHistorico: number
  }[]
}

export function ReceiptDocument({ empleadaNombre, fechaInicio, fechaFin, totalCents, trabajos }: ReceiptProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Bugatto Mode</Text>
          <Text style={styles.subtitle}>Liquidación Semanal - Pago a Destajo</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>Empleada: {empleadaNombre}</Text>
          <Text style={{ fontSize: 12, color: '#444' }}>Periodo: {fechaInicio} al {fechaFin}</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.row}>
            <Text style={styles.colHeader}>Fecha</Text>
            <Text style={styles.colHeader}>Trabajo</Text>
            <Text style={styles.colHeader}>Cant. x Precio</Text>
            <Text style={styles.colHeader}>Total</Text>
          </View>
          
          {trabajos.map((t, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.col}>{t.fecha}</Text>
              <Text style={styles.col}>{t.conceptoNombre || 'N/A'}</Text>
              <Text style={styles.col}>{t.cantidad} x ${(t.precioHistorico / 100).toFixed(2)}</Text>
              <Text style={styles.col}>${((t.precioHistorico * t.cantidad) / 100).toFixed(2)}</Text>
            </View>
          ))}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
            <Text style={styles.totalValue}>${(totalCents / 100).toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={{ marginTop: 60, alignItems: 'center' }}>
          <View style={{ borderTop: 1, width: 200, paddingTop: 5, alignItems: 'center' }}>
            <Text style={{ fontSize: 10 }}>Firma de recibido</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
