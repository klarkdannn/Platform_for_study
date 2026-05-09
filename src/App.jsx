import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import LearnPage from './pages/LearnPage'
import TeacherDashboard from './pages/TeacherDashboard'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#252525', color: '#e2e8f0', border: '1px solid #3a3a3a' }
          }}
        />
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/auth"      element={<AuthPage />} />
          <Route path="/learn"     element={<LearnPage />} />
          <Route path="/learn/:lessonId" element={<LearnPage />} />
          <Route path="/exercise/:exerciseId" element={<LearnPage />} />
          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
