import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { triggerHaptic } from '../utils/telegram'

export const FAVORITES_STORAGE_KEY = 'locally_marketplace_favs_v1'

interface FavoritesContextType {
  favorites: string[]
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => void
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3']
    } catch {
      return ['prod-1', 'prod-3']
    }
  })

  // Sync state when localStorage changes externally or across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const persistFavorites = useCallback((newFavs: string[]) => {
    setFavorites(newFavs)
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavs))
      window.dispatchEvent(new CustomEvent('locally_favorites_updated', { detail: newFavs }))
    } catch {
      // ignore storage error
    }
  }, [])

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  )

  const toggleFavorite = useCallback(
    (productId: string) => {
      triggerHaptic('light')
      setFavorites((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next))
          window.dispatchEvent(new CustomEvent('locally_favorites_updated', { detail: next }))
        } catch {
          // ignore
        }
        return next
      })
    },
    []
  )

  const addFavorite = useCallback(
    (productId: string) => {
      if (!favorites.includes(productId)) {
        persistFavorites([...favorites, productId])
      }
    },
    [favorites, persistFavorites]
  )

  const removeFavorite = useCallback(
    (productId: string) => {
      persistFavorites(favorites.filter((id) => id !== productId))
    },
    [favorites, persistFavorites]
  )

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export default FavoritesContext
