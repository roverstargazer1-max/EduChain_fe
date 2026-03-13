import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { clearAuthSession, getAccessToken, redirectToLogin } from '@/utils/auth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const successCode = 20000
const defaultTimeout = 15000

export interface ApiResponseBase {
	code: number
	msg: string
}

export interface RequestConfig<TData = unknown> extends AxiosRequestConfig<TData> {
	showError?: boolean
	successCode?: number
}

export class RequestError<TResponse = unknown> extends Error {
	code?: number
	status?: number
	response?: TResponse

	constructor(
		message: string,
		options: {
			code?: number
			status?: number
			response?: TResponse
		} = {},
	) {
		super(message)
		this.name = 'RequestError'
		this.code = options.code
		this.status = options.status
		this.response = options.response
	}
}

const service: AxiosInstance = axios.create({
	baseURL: apiBaseUrl,
	timeout: defaultTimeout,
	headers: {
		'Content-Type': 'application/json',
	},
})

service.interceptors.request.use((config) => {
	const token = getAccessToken()
	if (!token) {
		return config
	}

	config.headers = config.headers ?? {}
	;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
	return config
})

function isApiResponse(value: unknown): value is ApiResponseBase {
	return typeof value === 'object' && value !== null && 'code' in value && 'msg' in value
}

function normalizeHttpError(error: AxiosError<ApiResponseBase>): string {
	const serverMessage = error.response?.data?.msg
	if (serverMessage) {
		return serverMessage
	}

	if (error.code === 'ECONNABORTED') {
		return '请求超时，请稍后重试'
	}

	if (error.message === 'Network Error') {
		return '网络异常，可能是服务不可达或跨域配置缺失'
	}

	switch (error.response?.status) {
		case 401:
			return '登录状态已失效'
		case 403:
			return '没有权限执行该操作'
		case 404:
			return '请求的接口不存在'
		case 500:
			return '服务器内部错误'
		default:
			return error.message || '请求失败'
	}
}

function reportError(message: string, showError: boolean): void {
	if (!showError) {
		return
	}

	console.error(`[request] ${message}`)
}

async function request<TResponse = unknown, TData = unknown>(
	config: RequestConfig<TData>,
): Promise<TResponse> {
	const {
		showError = true,
		successCode: expectedSuccessCode = successCode,
		...axiosConfig
	} = config

	try {
		const response = await service.request<TResponse, AxiosResponse<TResponse>, TData>(axiosConfig)
		const result = response.data

		if (isApiResponse(result) && result.code !== expectedSuccessCode) {
			const businessError = new RequestError(result.msg || '请求失败', {
				code: result.code,
				status: response.status,
				response: result,
			})
			reportError(businessError.message, showError)
			throw businessError
		}

		return result
	} catch (error) {
		if (error instanceof RequestError) {
			throw error
		}

		const axiosError = error as AxiosError<ApiResponseBase>
		if (axiosError.response?.status === 401) {
			clearAuthSession()
			redirectToLogin()
		}

		const message = normalizeHttpError(axiosError)
		reportError(message, showError)

		throw new RequestError(message, {
			code: axiosError.response?.data?.code,
			status: axiosError.response?.status,
			response: axiosError.response?.data,
		})
	}
}

request.get = function get<TResponse = unknown, TParams = unknown>(
	url: string,
	config?: Omit<RequestConfig<never>, 'url' | 'method'> & { params?: TParams },
): Promise<TResponse> {
	return request<TResponse>({
		url,
		method: 'get',
		...config,
	})
}

request.delete = function deleteRequest<TResponse = unknown, TParams = unknown>(
	url: string,
	config?: Omit<RequestConfig<never>, 'url' | 'method'> & { params?: TParams },
): Promise<TResponse> {
	return request<TResponse>({
		url,
		method: 'delete',
		...config,
	})
}

request.post = function post<TResponse = unknown, TData = unknown>(
	url: string,
	data?: TData,
	config?: Omit<RequestConfig<TData>, 'url' | 'method' | 'data'>,
): Promise<TResponse> {
	return request<TResponse, TData>({
		url,
		method: 'post',
		data,
		...config,
	})
}

request.put = function put<TResponse = unknown, TData = unknown>(
	url: string,
	data?: TData,
	config?: Omit<RequestConfig<TData>, 'url' | 'method' | 'data'>,
): Promise<TResponse> {
	return request<TResponse, TData>({
		url,
		method: 'put',
		data,
		...config,
	})
}

request.patch = function patch<TResponse = unknown, TData = unknown>(
	url: string,
	data?: TData,
	config?: Omit<RequestConfig<TData>, 'url' | 'method' | 'data'>,
): Promise<TResponse> {
	return request<TResponse, TData>({
		url,
		method: 'patch',
		data,
		...config,
	})
}

export { service as axiosInstance }
export default request
