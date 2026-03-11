import request, { type ApiResponseBase } from '@/utils/request'

//Gatekeeper 输入审查 + 意图分类
export interface GatekeeperRequest {
  user_input: string
  session_id?: string | null
}

export interface MatchedExam {
  case_index: string
  exam_name: string
  confidence?: number
}

export interface GatekeeperResponse extends ApiResponseBase {
  data: {
    label?: string
    confidence?: number
    reason?: string
    intent?: string
    matched_exams?: MatchedExam[]
    unmatched_exams?: string[]
  }
}

// 对用户输入进行相关性判断和意图分类
export function GateCheck(requestData: GatekeeperRequest) {
  return request.post<GatekeeperResponse>('/api/internal/gatekeeper', {
    user_input: requestData.user_input,
    session_id: requestData.session_id,
  })
}
