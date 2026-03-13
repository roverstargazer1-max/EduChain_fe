import request, { type ApiResponseBase } from '@/utils/request'

export interface PaginationParams {
  page?: number
  page_size?: number
}

export interface PatientCaseSummary {
  case_id: string
  title: string
  department: string
  difficulty: string
  summary: string
  tags: string[]
  /** 案例背景（original_case.案例背景），由 GET /cases/{case_id} 返回 */
  patient_background?: string
}

// 分页获取所有案例概要信息的接口返回的数据结构
export interface PatientCaseListData {
  cases: PatientCaseSummary[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PatientCaseListResponse extends ApiResponseBase {
  data: PatientCaseListData
}

// 获取单个案例基本信息
export interface PatientCaseDetailResponse extends ApiResponseBase {
  data: PatientCaseSummary
}

export interface PatientChatRequest {
  user_input: string
  session_id?: string | null
}

export interface ExamConfirmRequest {
  confirm_token: string
  confirmed?: boolean
}

//---------------------以下是病人对话相关的数据结构---------------------

//病人正常回复的结构
export interface PatientReplyData {
  session_id: string
  reply: string
  intent?: string | null
}

//病人待确认检查的结构，包含需要做的检查列表和未匹配上的检查列表，以及一个确认token，供后续确认接口使用
export interface ExamConfirmData {
  session_id: string
  message: string
  exam_list: string[]
  unmatched_exams: string[]
  confirm_token: string
}

export interface ExamResultItem {
  exam_name: string
  result: string
}

// 病人检查结果的结构，用于展示检查结果报告
export interface ExamResultData {
  session_id: string
  results: ExamResultItem[]
  message: string
}

export interface NoticeData {
  session_id: string
  message: string
  level: 'info' | 'warning' | 'error'
  intent?: string | null
}

export type PatientAction = 'chat' | 'confirm_exam' | 'exam_result' | 'notice' | 'error'

export type PatientConversationData =
  | PatientReplyData
  | ExamConfirmData
  | ExamResultData
  | NoticeData
  | Record<string, never>

//病人对话接口返回的数据结构，根据不同的action类型，data字段会有不同的内容
export interface PatientConversationResponse extends ApiResponseBase {
  action: PatientAction
  data: PatientConversationData
}

// 获取病人病例列表
export function getPatientCases(params: PaginationParams = {}): Promise<PatientCaseListResponse> {
  return request.get<PatientCaseListResponse, PaginationParams>('/api/v1/patient/cases', {
    params,
  })
}

// 获取病人病例详情
export function getPatientCaseDetail(caseId: string): Promise<PatientCaseDetailResponse> {
  return request.get<PatientCaseDetailResponse>(`/api/v1/patient/cases/${caseId}`)
}

// 病人对话接口，根据病人输入和会话ID返回AI回复，可能包含不同类型的回复数据
export function chatWithPatient(
  caseId: string,
  payload: PatientChatRequest,
): Promise<PatientConversationResponse> {
  return request.post<PatientConversationResponse, PatientChatRequest>(
    `/api/v1/patient/${caseId}/chat`,
    payload,
  )
}

// 确认检查接口，病人确认需要做的检查项目，返回确认结果
export function confirmPatientExam(
  caseId: string,
  payload: ExamConfirmRequest,
): Promise<PatientConversationResponse> {
  return request.post<PatientConversationResponse, ExamConfirmRequest>(
    `/api/v1/patient/${caseId}/confirm_exam`,
    payload,
  )
}
