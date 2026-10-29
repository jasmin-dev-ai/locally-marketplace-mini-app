const STORAGE_LOCATION_KEY = 'locally_user_location'

export interface SearchableLocation {
  city: string
  district: string
  formatted: string
}

export const KNOWN_LOCATIONS: SearchableLocation[] = [
  { city: 'Toshkent', district: 'Mirobod tumani', formatted: 'Toshkent, Mirobod tumani' },
  { city: 'Toshkent', district: 'Chilonzor tumani', formatted: 'Toshkent, Chilonzor tumani' },
  { city: 'Toshkent', district: 'Yunusobod tumani', formatted: 'Toshkent, Yunusobod tumani' },
  { city: 'Toshkent', district: 'Mirzo Ulug‘bek tumani', formatted: 'Toshkent, Mirzo Ulug‘bek tumani' },
  { city: 'Toshkent', district: 'Yakkasaroy tumani', formatted: 'Toshkent, Yakkasaroy tumani' },
  { city: 'Toshkent', district: 'Shayxontohur tumani', formatted: 'Toshkent, Shayxontohur tumani' },
  { city: 'Toshkent', district: 'Olmazor tumani', formatted: 'Toshkent, Olmazor tumani' },
  { city: 'Toshkent', district: 'Uchtepa tumani', formatted: 'Toshkent, Uchtepa tumani' },
  { city: 'Toshkent', district: 'Sergeli tumani', formatted: 'Toshkent, Sergeli tumani' },
  { city: 'Toshkent', district: 'Yashnobod tumani', formatted: 'Toshkent, Yashnobod tumani' },
  { city: 'Samarqand', district: 'Registon hududi', formatted: 'Samarqand, Registon' },
  { city: 'Buxoro', district: 'Eski shahar', formatted: 'Buxoro, Qadimiy shahar' },
  { city: 'Xiva', district: 'Ichan-Qal‘a', formatted: 'Xiva, Ichan-Qal‘a' },
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
    window.dispatchEvent(new Event('locally_location_changed'))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Cleanly resolves coordinates to a refined city and district name without any technical IPs or raw numbers.
 */
function resolveCoordsToRefinedDistrict(lat: number, lon: number): string {
  // Approximate Tashkent quadrant mapping
  if (lat > 41.33) {
    return 'Toshkent, Yunusobod tumani'
  } else if (lat < 41.28) {
    if (lon < 69.22) {
      return 'Toshkent, Chilonzor tumani'
    }
    return 'Toshkent, Mirobod tumani'
  } else if (lon > 69.30) {
    return 'Toshkent, Mirzo Ulug‘bek tumani'
  } else if (lon < 69.24) {
    return 'Toshkent, Shayxontohur tumani'
  }
  return 'Toshkent, Yakkasaroy tumani'
}

/**
 * Detects current GPS and returns refined City, Region, and District ONLY.
 */
export async function detectGPSLocation(): Promise<string> {
  return new Promise((resolve) => {
    const fallbackLocation = 'Toshkent, Mirobod tumani'

    const tg = window.Telegram?.WebApp
    if (tg?.LocationManager?.getLocation) {
      try {
        tg.LocationManager.getLocation((data: any) => {
          if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            resolve(resolveCoordsToRefinedDistrict(data.latitude, data.longitude))
            return
          }
          tryBrowserGeolocation()
        })
        return
      } catch {
        tryBrowserGeolocation()
        return
      }
    }

    tryBrowserGeolocation()

    function tryBrowserGeolocation() {
      if (!navigator.geolocation) {
        resolve(fallbackLocation)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          resolve(resolveCoordsToRefinedDistrict(latitude, longitude))
        },
        () => {
          // On permission denial or error, provide refined default district cleanly
          resolve(fallbackLocation)
        },
        { timeout: 6000, enableHighAccuracy: true }
      )
    }
  })
}

/**
 * Search locations by query string with auto-completion.
 */
export function searchLocations(query: string): SearchableLocation[] {
  const clean = query.trim().toLowerCase()
  if (!clean) return KNOWN_LOCATIONS.slice(0, 5)
  return KNOWN_LOCATIONS.filter(
    (loc) =>
      loc.formatted.toLowerCase().includes(clean) ||
      loc.city.toLowerCase().includes(clean) ||
      loc.district.toLowerCase().includes(clean)
  )
}
