import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/layout/Navbar'
import LoadingScreen from './components/ui/LoadingScreen'

const HomePage = lazy(() => import('./pages/HomePage'))
const ChemistryLab = lazy(() => import('./pages/ChemistryLab'))
const PhysicsLab = lazy(() => import('./pages/PhysicsLab'))
const BiologyLab = lazy(() => import('./pages/BiologyLab'))

function App() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Turkish & English route aliases */}
            <Route path="/kimya/*" element={<ChemistryLab />} />
            <Route path="/chemistry/*" element={<Navigate to="/kimya" replace />} />
            <Route path="/fizik/*" element={<PhysicsLab />} />
            <Route path="/physics/*" element={<Navigate to="/fizik" replace />} />
            <Route path="/biyoloji/*" element={<BiologyLab />} />
            <Route path="/biology/*" element={<Navigate to="/biyoloji" replace />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
