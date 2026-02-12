/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()
const API_BASE = "http://localhost:3001/projet_ecole_final"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password
        })
      })

      if (!response.ok) {
        // try to read API error message
        try {
          const errJson = await response.json()
          throw new Error(errJson.error || 'Connexion échouée')
        } catch (_) {
          throw new Error('Connexion échouée')
        }
      }

      const data = await response.json()
      const userObj = {
        id: data.userId,
        username: data.username,
        email: data.email
      }
      localStorage.setItem('user', JSON.stringify(userObj))
      setUser(userObj)
      return data
    } catch (err) {
      // network failures (server down / CORS) often surface as TypeError or 'Failed to fetch'
      const isNetwork = err instanceof TypeError || /failed to fetch/i.test(String(err.message))
      const msg = isNetwork
        ? 'Impossible de joindre le serveur API. Vérifiez qu\'il est démarré (http://localhost:3001).' 
        : err.message || 'Erreur lors de la connexion'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        })
      })

      if (!response.ok) {
        // API returns { error: "..." } on failure
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Enregistrement échoué')
        } catch (_) {
          throw new Error('Enregistrement échoué')
        }
      }

      const data = await response.json()
      const userObj = {
        id: data.userId,
        username: data.username,
        email: data.email
      }
      localStorage.setItem('user', JSON.stringify(userObj))
      setUser(userObj)
      return data
    } catch (err) {
      const isNetwork = err instanceof TypeError || /failed to fetch/i.test(String(err.message))
      const msg = isNetwork
        ? 'Impossible de joindre le serveur API. Vérifiez qu\'il est démarré (http://localhost:3301).'
        : err.message || 'Erreur lors de l\'enregistrement'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}