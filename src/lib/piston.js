// Относительный URL — работает и с Maven-сервером, и с Docker/Nginx
const EXECUTE_URL = '/api/execute'

export async function runJava(code) {
  let res
  try {
    res = await fetch(EXECUTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'java',
        version:  '15.0.2',
        files: [{ name: 'Main.java', content: code }]
      })
    })
  } catch (e) {
    throw new Error('Сервер недоступен. Убедись что сервер запущен: mvn package exec:exec')
  }

  if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)

  const data = await res.json()
  const stdout  = data.run?.stdout     ?? ''
  const runErr  = data.run?.stderr     ?? ''
  const compErr = data.compile?.stderr ?? ''
  const stderr  = (compErr + runErr).trimEnd()

  return { stdout: stdout.trimEnd(), stderr, code: data.run?.code ?? 0 }
}

export function checkOutput(actual, expected) {
  const norm = s => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  return norm(actual) === norm(expected)
}
