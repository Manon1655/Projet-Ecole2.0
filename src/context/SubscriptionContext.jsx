/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const SubscriptionContext = createContext()

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(() => {
    try {
      const stored = localStorage.getItem('subscription')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const subscribe = (plan) => {
    setSubscription(plan)
    localStorage.setItem('subscription', JSON.stringify(plan))
  }

  const unsubscribe = () => {
    setSubscription(null)
    localStorage.removeItem('subscription')
  }

  return (
    <SubscriptionContext.Provider value={{ subscription, subscribe, unsubscribe }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}