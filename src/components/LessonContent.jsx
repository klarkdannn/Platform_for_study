import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { LESSONS, CATEGORIES } from '../data/curriculum'
import { BookOpen } from 'lucide-react'

export default function LessonContent({ lessonId }) {
  const lesson = LESSONS[lessonId]

  // Find lesson metadata for subtitle
  let subtitle = ''
  for (const cat of CATEGORIES) {
    const found = cat.lessons.find(l => l.id === lessonId)
    if (found) { subtitle = found.subtitle; break }
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
        <BookOpen size={48} className="text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-400 mb-2">Урок в разработке</h2>
        <p className="text-slate-500 text-sm max-w-md">
          Лекция для этого урока скоро появится. Пока можешь попробовать задания!
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {subtitle && (
          <p className="text-brand-500 text-sm font-medium mb-2 uppercase tracking-wider">{subtitle}</p>
        )}
        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
