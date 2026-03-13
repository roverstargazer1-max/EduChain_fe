export interface AuthUser {
  id: number
  username: string
  role: string
}

const ACCESS_TOKEN_KEY = 'educhain_access_token'
const USER_INFO_KEY = 'educhain_user_info'

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken())
}

export function setAuthSession(accessToken: string, user: AuthUser): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user))
}

export function getAuthUser(): AuthUser | null {
  if (!canUseStorage()) {
    return null
  }

  const raw = window.localStorage.getItem(USER_INFO_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>
    if (
      typeof parsed.id === 'number' &&
      typeof parsed.username === 'string' &&
      typeof parsed.role === 'string'
    ) {
      return {
        id: parsed.id,
        username: parsed.username,
        role: parsed.role,
      }
    }
  } catch {
    // ignore invalid local cache
  }

  window.localStorage.removeItem(USER_INFO_KEY)
  return null
}

export function clearAuthSession(): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(USER_INFO_KEY)
}

function getCurrentPath(): string {
  if (typeof window === 'undefined') {
    return '/'
  }

  const fullPath = `${window.location.pathname}${window.location.search}`
  return fullPath || '/'
}

export function buildLoginPath(redirectPath?: string): string {
  const targetPath =
    typeof redirectPath === 'string' && redirectPath.startsWith('/') ? redirectPath : getCurrentPath()

  return `/login?redirect=${encodeURIComponent(targetPath)}`
}

export function redirectToLogin(redirectPath?: string): void {
  if (typeof window === 'undefined') {
    return
  }

  const target = buildLoginPath(redirectPath)
  const current = `${window.location.pathname}${window.location.search}`

  if (current === target) {
    return
  }

  window.location.assign(target)
}
