import { Link, useNavigate } from 'react-router-dom'
import { LogOut, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, signOut, isTeacher } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    toast.success('До свидания!')
    navigate('/')
  }

  return (
    <header className="h-12 border-b border-surface-600 bg-surface-800 flex items-center px-4 gap-4 flex-shrink-0 z-10">
      <Link to="/" className="flex items-center gap-2 text-white font-bold mr-4">
        <span>☕</span>
        <span className="text-sm hidden sm:block">JavaLearn</span>
      </Link>

      <Link to="/learn" className="text-sm text-slate-400 hover:text-white transition-colors">Курс</Link>
      {isTeacher && (
        <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
          <LayoutDashboard size={14} /> Дашборд
        </Link>
      )}

      <div className="flex-1" />

      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User size={14} />
            <span className="hidden sm:block">{profile?.full_name || user.email}</span>
            {isTeacher && <span className="text-xs bg-brand-500/20 text-brand-500 px-2 py-0.5 rounded-full">Преподаватель</span>}
          </div>
          <button onClick={handleSignOut} className="text-slate-500 hover:text-slate-300 transition-colors" title="Выйти">
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <Link to="/auth" className="btn-primary py-1 text-xs">Войти</Link>
      )}
    </header>
  )
}
