export type UserRole = 'buyer' | 'seller'

const STORAGE_ROLE_KEY = 'locally_user_role'

/**
 * Returns currently saved user role, or null if first time.
 */
export function getUserRole(): UserRole | null {
  try {
    const role = localStorage.getItem(STORAGE_ROLE_KEY)
    if (role === 'buyer' || role === 'seller') {
      return role
    }
  } catch {
    // Ignore storage errors
  }
  return null
}

/**
 * Saves user role to localStorage and triggers event.
 */
export function saveUserRole(role: UserRole): void {
  try {
    localStorage.setItem(STORAGE_ROLE_KEY, role)
    window.dispatchEvent(new CustomEvent('locally_role_changed', { detail: role }))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Checks whether user has completed first-time role onboarding.
 */
export function hasCompletedOnboarding(): boolean {
  return getUserRole() !== null
}
