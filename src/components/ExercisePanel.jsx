import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Play, Send, RotateCcw, CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import CodeEditor from './CodeEditor'
import { runJava, checkOutput } from '../lib/piston'
import { supabase, isConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ExercisePanel({ exercise, onComplete }) {
  const { user } = useAuth()
  const [code, setCode]           = useState(exercise.starterCode)
  const [output, setOutput]       = useState('')
  const [error, setError]         = useState('')
  const [running, setRunning]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]       = useState(null) // 'pass' | 'fail'
  const [showHint, setShowHint]   = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)

  const reset = useCallback(() => {
    setCode(exercise.starterCode)
    setOutput(''); setError(''); setResult(null)
  }, [exercise.starterCode])

  async function handleRun() {
    setRunning(true); setOutput(''); setError(''); setResult(null)
    try {
      const res = await runJava(code)
      setOutput(res.stdout)
      if (res.stderr) setError(res.stderr)
    } catch (e) {
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  async function handleSubmit() {
    setSubmitting(true); setOutput(''); setError(''); setResult(null)
    try {
      const res = await runJava(code)
      if (res.stderr) { setError(res.stderr); setResult('fail'); return }

      const passed = checkOutput(res.stdout, exercise.expectedOutput)
      setOutput(res.stdout)
      setResult(passed ? 'pass' : 'fail')

      if (passed) {
        toast.success('Правильно! 🎉')
        onComplete?.(exercise.id)

        if (isConfigured && user) {
          await supabase.from('submissions').insert({
            user_id: user.id,
            exercise_id: exercise.id,
            code,
            status: 'passed',
            output: res.stdout
          })
        } else {
          // Save to localStorage
          const saved = JSON.parse(localStorage.getItem('completed_exercises') || '[]')
          if (!saved.includes(exercise.id)) {
            localStorage.setItem('completed_exercises', JSON.stringify([...saved, exercise.id]))
          }
        }
      } else {
        toast.error('Неправильно. Проверь вывод.')
        if (isConfigured && user) {
          await supabase.from('submissions').insert({
            user_id: user.id,
            exercise_id: exercise.id,
            code,
            status: 'failed',
            output: res.stdout
          })
        }
      }
    } catch (e) {
      setError(e.message); setResult('fail')
    } finally {
      setSubmitting(false)
    }
  }

  const diffLabel = exercise.difficulty === 'Easy' ? 'Легко' : exercise.difficulty === 'Medium' ? 'Средне' : 'Сложно'
  const diffClass = exercise.difficulty === 'Easy' ? 'badge-easy' : exercise.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: problem description */}
      <div className="w-96 min-w-[22rem] border-r border-surface-600 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-surface-600 flex items-center gap-2 flex-shrink-0">
          <h2 className="text-white font-semibold flex-1 truncate">{exercise.title}</h2>
          <span className={diffClass}>{diffLabel}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="prose-custom">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {exercise.description}
            </ReactMarkdown>
          </div>

          {exercise.hint && (
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-yellow-400 text-sm hover:text-yellow-300 transition-colors"
              >
                <Lightbulb size={14} />
                {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
              </button>
              {showHint && (
                <div className="mt-2 text-slate-400 text-sm bg-surface-700 rounded-lg p-3 border border-surface-500">
                  {exercise.hint}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-3 bg-surface-700 rounded-lg border border-surface-500">
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Ожидаемый вывод</p>
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">{exercise.expectedOutput}</pre>
          </div>
        </div>
      </div>

      {/* Right: editor + output */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor value={code} onChange={v => setCode(v ?? '')} />
        </div>

        {/* Output panel */}
        <div className="border-t border-surface-600 flex-shrink-0" style={{ minHeight: panelOpen ? 180 : 42 }}>
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-surface-600 cursor-pointer hover:bg-surface-700 transition-colors"
            onClick={() => setPanelOpen(!panelOpen)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Вывод</span>
              {result === 'pass' && <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle2 size={13} /> Правильно</span>}
              {result === 'fail' && <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle size={13} /> Неправильно</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); reset() }} className="text-slate-500 hover:text-slate-300 transition-colors p-1" title="Сброс">
                <RotateCcw size={14} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); handleRun() }}
                disabled={running || submitting}
                className="btn-secondary flex items-center gap-1.5 py-1 px-3"
              >
                <Play size={13} /> {running ? 'Запуск...' : 'Run'}
              </button>
              <button
                onClick={e => { e.stopPropagation(); handleSubmit() }}
                disabled={running || submitting}
                className="btn-primary flex items-center gap-1.5 py-1 px-3"
              >
                <Send size={13} /> {submitting ? 'Проверка...' : 'Submit'}
              </button>
              {panelOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronUp size={14} className="text-slate-500" />}
            </div>
          </div>

          {panelOpen && (
            <div className="overflow-auto" style={{ height: 138 }}>
              {error ? (
                <pre className="p-3 text-red-400 font-mono text-xs whitespace-pre-wrap">{error}</pre>
              ) : output ? (
                <pre className={`p-3 font-mono text-xs whitespace-pre-wrap ${result === 'pass' ? 'text-green-400' : result === 'fail' ? 'text-yellow-300' : 'text-slate-200'}`}>
                  {output}
                </pre>
              ) : (
                <p className="p-3 text-slate-600 text-xs">Нажми Run для запуска или Submit для проверки...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
