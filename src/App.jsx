import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import {
  AuthProvider,
  useAuth,
  ThemeProvider,
  NotificationProvider,
  SystemProvider,
  SkeletonProvider,
  CartProvider
} from './context'
import { MainLayout, DashboardLayout } from './layouts'
import { publicRoutes, staffRoutes } from './routes'
import ProtectedRoute from './components/Guards/ProtectedRoute'
import NotificationContainer from './components/Notifications/NotificationContainer/NotificationContainer'
import SessionManager from './components/Guards/SessionManager'
import MaintenanceGuard from './components/Guards/MaintenanceGuard'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { LoadingScreen } from './components'
import Login from './pages/Login/Login'
import AuthSync from './pages/AuthSync'
import useLBS from './hooks/useLBS'

function AppContent() {
  const { user, loading, loggingOut } = useAuth()
  const [minDone, setMinDone] = useState(false)
  const startedRef = useRef(false)

  useLBS()

  useEffect(() => {
    if (loading || loggingOut) {
      startedRef.current = true
      setMinDone(false)
    } else if (startedRef.current) {
      const t = setTimeout(() => setMinDone(true), 2000)
      return () => clearTimeout(t)
    } else {
      setMinDone(true)
    }
  }, [loading, loggingOut])

  if (loggingOut) return <LoadingScreen label="CERRANDO SESIÓN" status="GUARDANDO DATOS DE SESIÓN..." />;
  if (loading || !minDone) return <LoadingScreen />;

  return (
    <div className='App'>
      <ErrorBoundary>
        <SessionManager />
        <ScrollToTop />
        <MaintenanceGuard>
          <SkeletonProvider minDuration={0}>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Autenticación y Redirección Principal */}
                <Route path='/login' element={<Login />} />
                <Route path='/auth-sync' element={<AuthSync />} />
                <Route path='/' element={
                  user && (user.role === 'operador' || user.role === 'admin') 
                  ? <Navigate to="/staff/dashboard" replace /> 
                  : <Navigate to="/login" replace />
                } />

                {/* Rutas del Staff (Operador) */}
                <Route element={<DashboardLayout />}>
                  {staffRoutes.map((route, index) => {
                    const Component = route.element
                    return (
                      <Route
                        key={`staff-${index}`}
                        path={route.path}
                        element={
                          <ProtectedRoute allowedRoles={route.allowedRoles}>
                            <Component />
                          </ProtectedRoute>
                        }
                      />
                    )
                  })}
                </Route>

                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </Suspense>
          </SkeletonProvider>
        </MaintenanceGuard>
      </ErrorBoundary>

      <NotificationContainer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <SystemProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </SystemProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
