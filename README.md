# ☕ JavaLearn — Платформа для изучения Java

LeetCode-like платформа для изучения Java с редактором кода, автопроверкой заданий, ролями студента и преподавателя.

## Стек

- **Frontend**: React 18 + Vite + TailwindCSS
- **Редактор**: Monaco Editor (VS Code в браузере)
- **Выполнение Java**: [Piston API](https://github.com/engineer-man/piston) — бесплатно, без ключа
- **Auth + DB**: Supabase (PostgreSQL) — бесплатный тариф
- **Деплой**: Vercel (бесплатно)

## Быстрый старт (локально)

```bash
npm install
cp .env.example .env       # заполни переменные (или оставь пустым для демо-режима)
npm run dev                 # http://localhost:5173
```

**Демо-аккаунты** (без Supabase):
- `teacher@demo.com / demo123` — роль преподавателя
- Любой email/пароль → студент

## Деплой на Vercel (бесплатно)

1. Залогинься на [vercel.com](https://vercel.com) через GitHub
2. **New Project** → выбери репозиторий `Platform_for_study`
3. Framework: **Vite** (определится автоматически)
4. Добавь Environment Variables (опционально — если настроишь Supabase):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy** → получишь ссылку вида `your-project.vercel.app`

## Настройка Supabase (необязательно)

Без Supabase платформа работает в демо-режиме (localStorage). Для реальных аккаунтов и дашборда преподавателя:

1. Создай проект на [supabase.com](https://supabase.com) (бесплатно)
2. Перейди в **SQL Editor** и выполни `supabase/schema.sql`
3. Скопируй из **Settings → API**: `Project URL` и `anon public key`
4. Добавь в `.env`:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Чтобы сделать пользователя преподавателем:
   ```sql
   update public.profiles set role = 'teacher' where id = '<user-uuid>';
   ```

## Структура курса

| Раздел | Уроков | Заданий |
|--------|--------|---------|
| ☕ Базовый синтаксис | 8 | 16+ |
| 🏗️ ООП | 3 | 6+ |
| 📦 Коллекции и Алгоритмы | 2 | 4+ |
| ⚡ Функциональная Java | 2 | 4+ |
| 🎨 Паттерны и Concurrency | 3 | 6+ |
| 🌱 Spring Boot | 4 | 8+ |
| 🗄️ Базы данных | 3 | 6+ |

## Добавить новое задание

В `src/data/exercises.js` добавь объект:

```js
{
  id: 'l01_e04',          // уникальный ID
  lessonId: 'l01',        // к какому уроку
  title: 'Моё задание',
  difficulty: 'Easy',     // Easy | Medium | Hard
  description: `## Markdown описание задания`,
  starterCode: `public class Main { ... }`,
  expectedOutput: 'Ожидаемый вывод',
  hint: 'Подсказка (опционально)'
}
```

## Разработка

```bash
npm run dev      # дев-сервер
npm run build    # продакшн-сборка
npm run preview  # превью продакшн-сборки
```
