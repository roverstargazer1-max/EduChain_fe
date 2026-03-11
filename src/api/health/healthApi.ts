import request, { type ApiResponseBase } from '@/utils/request'

export interface InternalApiResponse extends ApiResponseBase {
  data: {
    ok: boolean // 服务是否正常
    llm_enabled: boolean // LLM密钥是否配置
  }
}

export function checkHealth() {
  return request.get<InternalApiResponse>('/health')
}
