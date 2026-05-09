import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Users, CheckCircle, XCircle, Clock, BarChart3, Code2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { supabase, isConfigured } from '../lib/supabase'
import { EXERCISES } from '../data/exercises'

export default function TeacherDashboard() {
  const { user, profile, isTeacher, loading } = useAuth()
  const [stats, setStats]   = useState({ total: 0, passed: 0, failed: 0, students: 0 })
  const [submissions, setSubmissions] = useState([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!isConfigured || !isTeacher) { setFetching(false); return }
    fetchData()
  }, [isTeacher])

  async function fetchData() {
    setFetching(true)
    const { data: subs } = await supabase
      .from('submissions')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (subs) {
      setSubmissions(subs)
      const students = new Set(subs.map(s => s.user_id)).size
      setStats({
        total: subs.length,
        passed: subs.filter(s => s.status === 'passed').length,
        failed: subs.filter(s => s.status === 'failed').length,
        students
      })
    }
    setFetching(false)
  }

  if (loading) return <div className="min-h-screen bg-surface-900 flex items-center justify-center text-slate-400">Загрузка...</div>
  if (!user) return <Navigate to="/auth" />

  if (!isTeacher) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <XCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl text-white font-semibold mb-2">Доступ запрещён</h2>
          <p className="text-slate-400 text-sm">Этот раздел только для преподавателей.</p>
          {!isConfigured && (
            <p className="text-slate-500 text-xs mt-3">
              В демо-режиме войди как <code className="text-yellow-400">teacher@demo.com / demo123</code>
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      <Navbar />
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <BarChart3 size={24} className="text-brand-500" />
          Дашборд преподавателя
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Студентов', value: stats.students, icon: Users, color: 'text-blue-400' },
            { label: 'Всего попыток', value: stats.total, icon: Code2, color: 'text-slate-400' },
            { label: 'Решено верно', value: stats.passed, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Неверных', value: stats.failed, icon: XCircle, color: 'text-red-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-surface-800 border border-surface-600 rounded-xl p-5">
              <Icon size={20} className={`${color} mb-3`} />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {!isConfigured ? (
          <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-6 text-center">
            <p className="text-yellow-300 font-medium mb-1">Демо-режим</p>
            <p className="text-yellow-400/60 text-sm">
              Для полного функционала дашборда настрой Supabase (см. README).
              <br />Реальные данные студентов появятся здесь после подключения БД.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-white mb-4">Последние попытки</h2>
            {fetching ? (
              <div className="text-slate-400 text-sm">Загрузка...</div>
            ) : submissions.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-12">Ещё нет попыток решения</div>
            ) : (
              <div className="bg-surface-800 border border-surface-600 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-600">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Студент</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Задание</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Статус</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Время</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(sub => {
                      const ex = EXERCISES.find(e => e.id === sub.exercise_id)
                      return (
                        <tr key={sub.id} className="border-b border-surface-700 hover:bg-surface-700 transition-colors">
                          <td className="px-4 py-3 text-slate-200">
                            {sub.profiles?.full_name || sub.profiles?.email || sub.user_id.slice(0, 8)}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {ex?.title || sub.exercise_id}
                          </td>
                          <td className="px-4 py-3">
                            {sub.status === 'passed'
                              ? <span className="flex items-center gap-1 text-green-400"><CheckCircle size={13} /> Верно</span>
                              : <span className="flex items-center gap-1 text-red-400"><XCircle size={13} /> Неверно</span>}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs">
                            {new Date(sub.created_at).toLocaleString('ru-RU')}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
