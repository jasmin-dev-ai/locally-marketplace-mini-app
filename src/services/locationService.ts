const STORAGE_LOCATION_KEY = 'locally_user_location'

export interface SearchableLocation {
  city: string
  district: string
  formatted: string
}

export const CITIES_LIST = ['Toşkent', 'Samarqand', 'Buxoro', 'Xiva']

export const KNOWN_LOCATIONS: SearchableLocation[] = [
  { city: 'Toşkent', district: 'Mirobod tumani', formatted: 'Toşkent, Mirobod tumani' },
  { city: 'Toşkent', district: 'Çilonzor tumani', formatted: 'Toşkent, Çilonzor tumani' },
  { city: 'Toşkent', district: 'Yunusobod tumani', formatted: 'Toşkent, Yunusobod tumani' },
  { city: 'Toşkent', district: 'Mirzo Uluğbek tumani', formatted: 'Toşkent, Mirzo Uluğbek tumani' },
  { city: 'Toşkent', district: 'Yakkasaroy tumani', formatted: 'Toşkent, Yakkasaroy tumani' },
  { city: 'Toşkent', district: 'Şayxontohur tumani', formatted: 'Toşkent, Şayxontohur tumani' },
  { city: 'Toşkent', district: 'Olmazor tumani', formatted: 'Toşkent, Olmazor tumani' },
  { city: 'Toşkent', district: 'Uçtepa tumani', formatted: 'Toşkent, Uçtepa tumani' },
  { city: 'Toşkent', district: 'Sergeli tumani', formatted: 'Toşkent, Sergeli tumani' },
  { city: 'Toşkent', district: 'Yaşnobod tumani', formatted: 'Toşkent, Yaşnobod tumani' },
  { city: 'Samarqand', district: 'Registon hududi', formatted: 'Samarqand, Registon' },
  { city: 'Samarqand', district: 'Siyob bozori', formatted: 'Samarqand, Siyob bozori' },
  { city: 'Samarqand', district: 'Boğişamol', formatted: 'Samarqand, Boğişamol' },
  { city: 'Buxoro', district: 'Eski şahar', formatted: 'Buxoro, Eski şahar' },
  { city: 'Buxoro', district: 'Labi Hovuz', formatted: 'Buxoro, Labi Hovuz' },
  { city: 'Xiva', district: 'Içan-Qalʼa', formatted: 'Xiva, Içan-Qalʼa' },
  { city: 'Xiva', district: 'Dişan-Qalʼa', formatted: 'Xiva, Dişan-Qalʼa' },
]

export function getDistrictsByCity(city: string): SearchableLocation[] {
  return KNOWN_LOCATIONS.filter((l) => l.city.toLowerCase() === city.toLowerCase())
}

/**
 * Cleanly formats city and district, completely stripping raw IP leakage or static dots.
 */
export function formatCleanCityDistrict(rawLoc?: string | null): string {
  if (!rawLoc || typeof rawLoc !== 'string') return 'Toşkent, Mirobod tumani'
  const trimmed = rawLoc.trim()
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}/.test(trimmed) || /^\.+$/.test(trimmed) || trimmed === '...' || trimmed === '') {
    return 'Toşkent, Mirobod tumani'
  }
  return trimmed
}

/**
 * Returns saved user location or null if not set yet.
 */
export function getUserLocation(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_LOCATION_KEY)
    if (saved && saved.trim()) {
      return formatCleanCityDistrict(saved)
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
    return 'Toşkent, Yunusobod tumani'
  } else if (lat < 41.28) {
    if (lon < 69.22) {
      return 'Toşkent, Çilonzor tumani'
    }
    return 'Toşkent, Mirobod tumani'
  } else if (lon > 69.30) {
    return 'Toşkent, Mirzo Uluğbek tumani'
  } else if (lon < 69.24) {
    return 'Toşkent, Şayxontohur tumani'
  }
  return 'Toşkent, Yakkasaroy tumani'
}

/**
 * Detects current GPS and returns refined City, Region, and District ONLY.
 */
export async function detectGPSLocation(): Promise<string> {
  return new Promise((resolve) => {
    const fallbackLocation = 'Toşkent, Mirobod tumani'

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
  if (!clean) return KNOWN_LOCATIONS
  return KNOWN_LOCATIONS.filter(
    (loc) =>
      loc.formatted.toLowerCase().includes(clean) ||
      loc.city.toLowerCase().includes(clean) ||
      loc.district.toLowerCase().includes(clean)
  )
}
