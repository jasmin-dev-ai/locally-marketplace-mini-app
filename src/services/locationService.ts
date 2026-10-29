const STORAGE_LOCATION_KEY = 'locally_user_location'

export const POPULAR_DISTRICTS = [
  'Mirobod tumani',
  'Yunusobod tumani',
  'Chilonzor tumani',
  'Mirzo Ulug‘bek tumani',
  'Yakkasaroy tumani',
  'Shayxontohur tumani',
  'Olmazor tumani',
  'Samarqand shahri',
  'Buxoro shahri',
]

/**
 * Returns saved user location or null if not set yet.
 */
export function getUserLocation(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_LOCATION_KEY)
    if (saved && saved.trim()) {
      return saved.trim()
    }
  } catch {
    // Ignore storage errors
  }
  return null
}

/**
 * Saves user selected location to localStorage.
 */
export function saveUserLocation(location: string): void {
  try {
    localStorage.setItem(STORAGE_LOCATION_KEY, location.trim())
    // Dispatch custom event so all active components update immediately
    window.dispatchEvent(new Event('locally_location_changed'))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Detects current GPS coordinates using browser or Telegram WebApp Location API.
 */
export async function detectGPSLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Try Telegram WebApp LocationManager if available
    const tg = window.Telegram?.WebApp
    if (tg?.LocationManager?.getLocation) {
      try {
        tg.LocationManager.getLocation((data: any) => {
          if (data && data.latitude && data.longitude) {
            resolve(`Toshkent (${data.latitude.toFixed(3)}, ${data.longitude.toFixed(3)})`)
            return
          }
          fallbackToNavigator()
        })
        return
      } catch {
        fallbackToNavigator()
        return
      }
    }

    fallbackToNavigator()

    function fallbackToNavigator() {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          resolve(`Toshkent (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`)
        },
        (error) => {
          reject(error)
        },
        { timeout: 8000, enableHighAccuracy: true }
      )
    }
  })
}
