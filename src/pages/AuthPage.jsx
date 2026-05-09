import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { isConfigured } from '../lib/supabase'

export default function AuthPage() {
  const [search] = useSearchParams()
  const [isSignup, setIsSignup] = useState(search.get('signup') === '1')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading]   = useState(false)
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/learn') }, [user])

  async function handle(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = isSignup
        ? await signUp(email, password, fullName)
        : await signIn(email, password)
      if (error) { toast.error(error.message); return }
      toast.success(isSignup ? 'Аккаунт создан!' : 'Добро пожаловать!')
      navigate('/learn')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl">☕</Link>
          <h1 className="text-2xl font-bold text-white mt-2">JavaLearn</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isSignup ? 'Создай аккаунт' : 'Войди в аккаунт'}
          </p>
        </div>

        {!isConfigured && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-300 text-sm rounded-lg p-3 mb-4">
            <strong>Демо-режим</strong> (Supabase не настроен).<br />
            Попробуй: <code>teacher@demo.com / demo123</code>
          </div>
        )}

        <form onSubmit={handle} className="bg-surface-800 border border-surface-600 rounded-2xl p-8 space-y-4">
          {isSignup && (
            <div>
              <label className="text-sm text-slate-400 block mb-1">Имя</label>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Иван Иванов" required
                className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-slate-400 block mb-1">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required
              className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Пароль</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required minLength={6}
              className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Загрузка...' : isSignup ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-4">
          {isSignup ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
          <button
            className="text-brand-500 hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>

        <p className="text-center mt-4">
          <Link to="/learn" className="text-slate-500 text-sm hover:text-slate-300">
            Продолжить без аккаунта →
          </Link>
        </p>
      </div>
    </div>
  )
}
