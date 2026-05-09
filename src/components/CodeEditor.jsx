import Editor from '@monaco-editor/react'

export default function CodeEditor({ value, onChange, height = '100%' }) {
  return (
    <Editor
      height={height}
      defaultLanguage="java"
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        tabSize: 4,
        wordWrap: 'on',
        bracketPairColorization: { enabled: true },
        padding: { top: 12, bottom: 12 },
        smoothScrolling: true,
      }}
    />
  )
}
