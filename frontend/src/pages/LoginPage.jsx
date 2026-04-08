import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginApi(form)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Budget Manager</h1>
          <p className="text-slate-500 mt-2">Connecte-toi à ton espace</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                className="input"
                value={form.email}
                onChange={handleChange}
                placeholder="toi@email.com"
                required
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <input
                name="password"
                type="password"
                className="input"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-brand-600 hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}