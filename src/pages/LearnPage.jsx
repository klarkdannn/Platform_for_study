import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, Code2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import LessonContent from '../components/LessonContent'
import ExercisePanel from '../components/ExercisePanel'
import { CATEGORIES } from '../data/curriculum'
import { EXERCISES } from '../data/exercises'
import { supabase, isConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function getFirstLesson() {
  return CATEGORIES[0]?.lessons[0]?.id || 'l01'
}

function loadCompletedFromStorage() {
  try {
    return new Set(JSON.parse(localStorage.getItem('completed_exercises') || '[]'))
  } catch { return new Set() }
}

export default function LearnPage() {
  const { lessonId: paramLesson } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [selectedLesson, setSelectedLesson]   = useState(paramLesson || getFirstLesson())
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [tab, setTab]                         = useState('lecture') // 'lecture' | 'homework'
  const [completed, setCompleted]             = useState(loadCompletedFromStorage)

  // Sync from Supabase if logged in
  useEffect(() => {
    if (!isConfigured || !user) return
    supabase.from('submissions').select('exercise_id').eq('user_id', user.id).eq('status', 'passed').then(({ data }) => {
      if (data) setCompleted(new Set(data.map(r => r.exercise_id)))
    })
  }, [user])

  // When URL changes
  useEffect(() => {
    if (paramLesson) setSelectedLesson(paramLesson)
  }, [paramLesson])

  const lessonExercises = EXERCISES.filter(e => e.lessonId === selectedLesson)

  function handleSelectLesson(id) {
    setSelectedLesson(id)
    setSelectedExercise(null)
    setTab('lecture')
  }

  function handleSelectExercise(id) {
    const ex = EXERCISES.find(e => e.id === id)
    setSelectedExercise(ex)
    setTab('homework')
  }

  function handleTabChange(t) {
    setTab(t)
    if (t === 'homework' && !selectedExercise && lessonExercises.length > 0) {
      setSelectedExercise(lessonExercises[0])
    }
  }

  const handleComplete = useCallback((exerciseId) => {
    setCompleted(prev => new Set([...prev, exerciseId]))
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-900">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectLesson={handleSelectLesson}
          onSelectExercise={handleSelectExercise}
          completedIds={completed}
        />

        {/* Main area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 h-11 border-b border-surface-600 bg-surface-800 flex-shrink-0">
            <button
              onClick={() => handleTabChange('lecture')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                tab === 'lecture'
                  ? 'text-white border-b-2 border-brand-500 bg-surface-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} /> Лекция
            </button>
            <button
              onClick={() => handleTabChange('homework')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                tab === 'homework'
                  ? 'text-white border-b-2 border-brand-500 bg-surface-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 size={14} /> Задания
              {lessonExercises.length > 0 && (
                <span className="ml-1 text-xs bg-surface-600 text-slate-400 px-1.5 py-0.5 rounded-full">
                  {lessonExercises.length}
                </span>
              )}
            </button>

            {/* Exercise tabs if in homework mode */}
            {tab === 'homework' && lessonExercises.length > 0 && (
              <div className="flex gap-1 ml-4 border-l border-surface-600 pl-4">
                {lessonExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors ${
                      selectedExercise?.id === ex.id
                        ? 'bg-surface-600 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {completed.has(ex.id) && <span className="text-green-500">✓</span>}
                    {ex.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {tab === 'lecture' ? (
              <LessonContent lessonId={selectedLesson} />
            ) : selectedExercise ? (
              <ExercisePanel
                key={selectedExercise.id}
                exercise={selectedExercise}
                onComplete={handleComplete}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Code2 size={48} className="text-slate-600 mb-4" />
                <h3 className="text-slate-400 text-lg font-medium mb-2">Задания</h3>
                {lessonExercises.length === 0 ? (
                  <p className="text-slate-500 text-sm">Задания для этого урока скоро появятся</p>
                ) : (
                  <p className="text-slate-500 text-sm">Выбери задание в боковом меню</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
