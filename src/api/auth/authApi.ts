import request, { type ApiResponseBase } from '@/utils/request'
import type { AuthUser } from '@/utils/auth'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginData {
  access_token: string
  token_type: string
  user: AuthUser
}

export interface LoginResponse extends ApiResponseBase {
  data: LoginData
}

export interface CurrentUserResponse extends ApiResponseBase {
  data: AuthUser
}

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return request.post<LoginResponse, LoginRequest>('/api/v1/auth/login', payload)
}

export function fetchCurrentUser(): Promise<CurrentUserResponse> {
  return request.get<CurrentUserResponse>('/api/v1/auth/me')
}
