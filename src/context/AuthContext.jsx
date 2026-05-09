import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

// Demo accounts when Supabase is not configured
const DEMO_USERS = {
  'teacher@demo.com': { id: 'demo-teacher', email: 'teacher@demo.com', role: 'teacher', full_name: 'Преподаватель', password: 'demo123' },
  'student@demo.com': { id: 'demo-student', email: 'student@demo.com', role: 'student', full_name: 'Студент', password: 'demo123' },
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else setLoading(false)
      })
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else { setProfile(null); setLoading(false) }
      })
      return () => subscription.unsubscribe()
    } else {
      // Demo mode: check localStorage
      const saved = localStorage.getItem('demo_user')
      if (saved) {
        const u = JSON.parse(saved)
        setUser(u); setProfile(u)
      }
      setLoading(false)
    }
  }, [])

  async function fetchProfile(uid) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile(data)
    setLoading(false)
  }

  async function signUp(email, password, fullName) {
    if (!isConfigured) {
      const u = { id: Date.now().toString(), email, role: 'student', full_name: fullName }
      localStorage.setItem('demo_user', JSON.stringify(u))
      setUser(u); setProfile(u)
      return { error: null }
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error && data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName, role: 'student' })
    }
    return { error }
  }

  async function signIn(email, password) {
    if (!isConfigured) {
      const demo = DEMO_USERS[email]
      if (demo && demo.password === password) {
        localStorage.setItem('demo_user', JSON.stringify(demo))
        setUser(demo); setProfile(demo)
        return { error: null }
      }
      // Allow any email/password for demo
      const u = { id: Date.now().toString(), email, role: 'student', full_name: email.split('@')[0] }
      localStorage.setItem('demo_user', JSON.stringify(u))
      setUser(u); setProfile(u)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    if (!isConfigured) {
      localStorage.removeItem('demo_user')
      setUser(null); setProfile(null)
      return
    }
    await supabase.auth.signOut()
  }

  const isTeacher = profile?.role === 'teacher'

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, isTeacher }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
