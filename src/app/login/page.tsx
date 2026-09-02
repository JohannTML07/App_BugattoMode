'use client'

import { useState } from 'react'
import { login } from './actions'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#f8f9fa] selection:bg-yellow-200">
      <div className="w-full max-w-md p-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100">
        
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <LogIn size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-gray-900 text-center tracking-tight">Bienvenido a Bugatto</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Ingresa a tu cuenta administrativa</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              required
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
              placeholder="tu@correo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              required
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 mt-2 shadow-sm hover:shadow-md"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-400 font-medium">
        Herramienta Interna &middot; Bugatto Mode &copy; {new Date().getFullYear()}
      </p>
    </div>
  )
}
