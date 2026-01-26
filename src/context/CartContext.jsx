/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('favorites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const addToCart = (book) => {
    const newCart = [...cart]
    const existingIndex = newCart.findIndex(item => item.id === book.id)
    
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1
    } else {
      newCart.push({ ...book, quantity: 1 })
    }
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (bookId) => {
    const newCart = cart.filter(item => item.id !== bookId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateCartQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }
    
    const newCart = cart.map(item => 
      item.id === bookId ? { ...item, quantity } : item
    )
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const addToFavorites = (book) => {
    const isFavorite = favorites.some(item => item.id === book.id)
    
    if (isFavorite) {
      removeFromFavorites(book.id)
    } else {
      const newFavorites = [...favorites, book]
      setFavorites(newFavorites)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }
  }

  const removeFromFavorites = (bookId) => {
    const newFavorites = favorites.filter(item => item.id !== bookId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const isFavorite = (bookId) => {
    return favorites.some(item => item.id === bookId)
  }

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        favorites, 
        addToCart, 
        removeFromCart, 
        updateCartQuantity, 
        clearCart,
        addToFavorites,
        removeFromFavorites,
        isFavorite
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
