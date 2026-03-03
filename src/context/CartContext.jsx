/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  // -----------------------------
  // CART STATE
  // -----------------------------
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (!stored) return [];

      const parsed = JSON.parse(stored);

      // Supprime anciennes quantités si existantes
      return parsed.map(({ quantity, ...rest }) => rest);
    } catch {
      return [];
    }
  });

  // Synchronisation auto avec localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  // -----------------------------
  // FAVORITES STATE
  // -----------------------------
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);


  // -----------------------------
  // CART FUNCTIONS
  // -----------------------------
  const addToCart = (book) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.length;

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );


  // -----------------------------
  // FAVORITES FUNCTIONS
  // -----------------------------
  const addToFavorites = (book) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some(
        (item) => item.id === book.id
      );

      if (isAlreadyFavorite) {
        return prev.filter((item) => item.id !== book.id);
      }

      return [...prev, book];
    });
  };

  const removeFromFavorites = (bookId) => {
    setFavorites((prev) =>
      prev.filter((item) => item.id !== bookId)
    );
  };

  const isFavorite = (bookId) => {
    return favorites.some((item) => item.id === bookId);
  };


  // -----------------------------
  // PROVIDER
  // -----------------------------
  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        favorites,
        addToCart,
        removeFromCart,
        clearCart,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}