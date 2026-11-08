import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/layout/Navbar'
import LoadingScreen from './components/ui/LoadingScreen'

const HomePage = lazy(() => import('./pages/HomePage'))
const ChemistryLab = lazy(() => import('./pages/ChemistryLab'))
const PhysicsLab = lazy(() => import('./pages/PhysicsLab'))
const BiologyLab = lazy(() => import('./pages/BiologyLab'))

function App() {
  return (
    <div className="min-h-screen bg-dark-950 text-dark-50">
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kimya/*" element={<ChemistryLab />} />
          <Route path="/fizik/*" element={<PhysicsLab />} />
          <Route path="/biyoloji/*" element={<BiologyLab />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
