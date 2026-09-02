import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Ingreso - Bugatto Mode</h1>
        <p className="mb-4">Contacta a un administrador para obtener acceso.</p>
        {/* SignIn Form will be here */}
      </div>
    </div>
  )
}
