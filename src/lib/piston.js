const PISTON_URL = 'https://emkc.org/api/v2/piston/execute'

export async function runJava(code) {
  const res = await fetch(PISTON_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: 'java',
      version: '15.0.2',
      files: [{ name: 'Main.java', content: code }]
    })
  })
  if (!res.ok) throw new Error(`Ошибка сети: ${res.status}`)
  const data = await res.json()
  const stdout = data.run?.stdout || ''
  const stderr = data.run?.stderr || ''
  const compile = data.compile?.stderr || ''
  return { stdout: stdout.trimEnd(), stderr: (compile + stderr).trimEnd(), code: data.run?.code ?? 0 }
}

export function checkOutput(actual, expected) {
  const normalize = s => s.replace(/\r\n/g, '\n').trim()
  return normalize(actual) === normalize(expected)
}
