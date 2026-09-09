import React, { lazy } from 'react'

// Páginas Públicas
const Home = lazy(() => import('../pages/Home/Home'))
const Login = lazy(() => import('../pages/Login/Login'))

// Módulo de Staff (Operador)
const StaffDashboard = lazy(() => import('../pages/staff/views/StaffTerminalDashboard'))
const StaffTerminal = lazy(() => import('../pages/staff/StaffTerminal'))
const StaffHistory = lazy(() => import('../pages/staff/StaffHistory'))
const StaffIncidents = lazy(() => import('../pages/staff/views/StaffIncidents'))
const AssignedEvents = lazy(() => import('../pages/staff/views/AssignedEvents'))

export const publicRoutes = [
  { path: '/', element: Home, layout: 'main', title: 'Inicio' },
  { path: '/login', element: Login, layout: 'auth', title: 'Iniciar Sesión' }
]

export const staffRoutes = [
  { path: '/staff/dashboard', element: StaffDashboard, layout: 'dashboard', allowedRoles: ['operador', 'admin'], title: 'Panel Control Staff' },
  { path: '/staff', element: StaffTerminal, layout: 'dashboard', allowedRoles: ['operador', 'admin'], title: 'Verificación de Boletos' },
  { path: '/staff/history', element: StaffHistory, layout: 'dashboard', allowedRoles: ['operador', 'admin'], title: 'Historial de Verificaciones' },
  { path: '/staff/incidents', element: StaffIncidents, layout: 'dashboard', allowedRoles: ['operador', 'admin'], title: 'Incidencias' },
  { path: '/staff/events', element: AssignedEvents, layout: 'dashboard', allowedRoles: ['operador', 'admin'], title: 'Eventos Asignados' }
]

export const allRoutes = [...publicRoutes, ...staffRoutes]

export const getRoutesByRole = role => {
  if (!role) return publicRoutes
  return allRoutes.filter(route => !route.allowedRoles || route.allowedRoles.includes(role))
}

export const getDefaultRouteByRole = role => {
  const routeMap = { operador: '/staff/dashboard', admin: '/staff/dashboard', usuario: '/' }
  return routeMap[role] || '/'
}

export default allRoutes
