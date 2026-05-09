import { Link } from 'react-router-dom'
import { Code2, BookOpen, CheckCircle, Users, Zap, Database } from 'lucide-react'

const features = [
  { icon: Code2,      title: 'Редактор кода',     desc: 'Monaco Editor (как VS Code) прямо в браузере' },
  { icon: Zap,        title: 'Мгновенная проверка', desc: 'Запусти Java-код и получи результат за секунды' },
  { icon: BookOpen,   title: '25+ лекций',          desc: 'Базовый синтаксис, ООП, коллекции, Spring Boot, SQL' },
  { icon: CheckCircle, title: 'Задания',             desc: 'Практические упражнения с автоматической проверкой' },
  { icon: Users,      title: 'Роли',                desc: 'Студент и преподаватель с дашбордом' },
  { icon: Database,   title: 'Базы данных',         desc: 'Урок по SQL, PostgreSQL и JPA' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900">
      {/* Navbar */}
      <nav className="border-b border-surface-700 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span className="text-xl font-bold text-white">JavaLearn</span>
        </div>
        <div className="flex gap-3">
          <Link to="/auth" className="btn-secondary">Войти</Link>
          <Link to="/auth?signup=1" className="btn-primary">Начать бесплатно</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-1 rounded-full text-sm mb-6">
          <Zap size={14} /> Платформа для изучения Java
        </div>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Учись Java как{' '}
          <span className="text-brand-500">профессиональный</span>
          {' '}разработчик
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Пиши Java-код прямо в браузере, решай задания и получай мгновенную проверку.
          От Hello World до Spring Boot и баз данных.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/auth?signup=1" className="btn-primary text-base px-6 py-3">
            Начать бесплатно →
          </Link>
          <Link to="/learn" className="btn-secondary text-base px-6 py-3">
            Посмотреть курс
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Что внутри</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-surface-800 border border-surface-600 rounded-xl p-6">
              <Icon size={28} className="text-brand-500 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Программа курса</h2>
        <div className="space-y-3">
          {[
            ['☕', 'Базовый синтаксис', '8 уроков', 'Hello World, переменные, условия, циклы, массивы, строки, математика'],
            ['🏗️', 'ООП', '3 урока', 'Классы, наследование, полиморфизм, интерфейсы, паттерн Builder'],
            ['📦', 'Коллекции и Алгоритмы', '2 урока', 'List, Set, Map, Queue, структуры данных своими руками'],
            ['⚡', 'Функциональная Java', '2 урока', 'Stream API, lambda, Optional, generics'],
            ['🎨', 'Паттерны и Concurrency', '3 урока', 'Singleton, Factory, Observer, потоки, CompletableFuture'],
            ['🌱', 'Spring Boot', '4 урока', 'DI, REST API, Spring Data JPA, Spring Security'],
            ['🗄️', 'Базы данных', '3 урока', 'SQL, PostgreSQL, JDBC, Hibernate/JPA'],
          ].map(([emoji, title, count, desc]) => (
            <div key={title} className="flex items-start gap-4 bg-surface-800 rounded-xl p-5 border border-surface-600">
              <span className="text-3xl">{emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold">{title}</h3>
                  <span className="text-xs text-slate-500 bg-surface-700 px-2 py-0.5 rounded">{count}</span>
                </div>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-brand-500/20 to-purple-600/20 border border-brand-500/30 rounded-2xl p-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Готов начать?</h2>
          <p className="text-slate-400 mb-8">Регистрация бесплатна. Начни прямо сейчас.</p>
          <Link to="/auth?signup=1" className="btn-primary text-base px-8 py-3">
            Создать аккаунт бесплатно
          </Link>
        </div>
      </section>

      <footer className="border-t border-surface-700 py-6 text-center text-slate-500 text-sm">
        JavaLearn — платформа для изучения Java
      </footer>
    </div>
  )
}
