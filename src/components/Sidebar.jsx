import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react'
import { CATEGORIES } from '../data/curriculum'
import { EXERCISES } from '../data/exercises'

function getLessonExercises(lessonId) {
  return EXERCISES.filter(e => e.lessonId === lessonId)
}

export default function Sidebar({ onSelectLesson, onSelectExercise, completedIds = new Set() }) {
  const { lessonId: activeLessonId } = useParams()
  const navigate = useNavigate()
  const [open, setOpen] = useState(() => {
    const defaults = {}
    CATEGORIES.forEach(c => { defaults[c.id] = true })
    return defaults
  })

  function toggleCategory(id) {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="w-64 min-w-[16rem] bg-surface-800 border-r border-surface-600 h-full overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-surface-600">
        <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Курс Java</span>
      </div>

      {CATEGORIES.map(cat => (
        <div key={cat.id}>
          <button
            onClick={() => toggleCategory(cat.id)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-surface-700 transition-colors"
          >
            <span>{cat.title}</span>
            {open[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {open[cat.id] && cat.lessons.map(lesson => {
            const exercises = getLessonExercises(lesson.id)
            const doneCount = exercises.filter(e => completedIds.has(e.id)).length
            const isActive = activeLessonId === lesson.id

            return (
              <div key={lesson.id}>
                <button
                  onClick={() => { onSelectLesson(lesson.id); navigate(`/learn/${lesson.id}`) }}
                  className={`w-full text-left px-6 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-500 border-r-2 border-brand-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
                  }`}
                >
                  <div className="font-medium truncate">{lesson.title}</div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{lesson.subtitle}</div>
                  {exercises.length > 0 && (
                    <div className="text-xs text-slate-600 mt-1">
                      {doneCount}/{exercises.length} задач
                    </div>
                  )}
                </button>

                {isActive && exercises.length > 0 && (
                  <div className="bg-surface-900/50">
                    {exercises.map(ex => {
                      const done = completedIds.has(ex.id)
                      return (
                        <button
                          key={ex.id}
                          onClick={() => onSelectExercise(ex.id)}
                          className="w-full flex items-center gap-2 px-8 py-1.5 text-xs text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-colors"
                        >
                          {done
                            ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                            : <Circle size={12} className="flex-shrink-0" />}
                          <span className="truncate">{ex.title}</span>
                          <span className={`ml-auto flex-shrink-0 ${
                            ex.difficulty === 'Easy' ? 'badge-easy' :
                            ex.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                          }`}>{ex.difficulty === 'Easy' ? 'Легко' : ex.difficulty === 'Medium' ? 'Средне' : 'Сложно'}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
