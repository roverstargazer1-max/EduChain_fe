<template>
  <div class="clinical-page">
    <header class="top-bar">
      <div class="top-bar__case">
        <span class="label">病例号</span>
        <strong>#{{ displayCaseId }}</strong>
        <span class="divider">|</span>
        <span class="case-title">{{ caseDetail?.title ?? '加载中…' }}</span>
      </div>

      <div class="top-bar__status">
        <span class="status-chip status-chip--time">
          <span class="dot"></span>
          剩余时间：12:45
        </span>
        <button class="secondary-btn" type="button">结束模拟</button>
        <button class="primary-btn" type="button">提交诊断</button>
      </div>
    </header>

    <main class="clinical-layout">
      <section class="patient-panel card-panel">
        <div class="patient-panel__header">
          <div class="patient-profile">
            <div class="avatar">{{ patientAvatarChar }}</div>
            <div>
              <h2>{{ patientTitle }}</h2>
              <p>{{ patientSubtitle }}</p>
            </div>
          </div>
          <button class="ghost-btn" type="button" @click="showSummary = true">查看病情概要</button>
        </div>

        <div ref="chatAreaRef" class="chat-area">
          <div class="timeline-tip">今天 09:41</div>

          <div v-if="chatMessages.length === 0" class="chat-empty">
            开始问诊后，病人回复、系统提示与检查确认会显示在这里。
          </div>

          <div v-for="item in chatMessages" :key="item.id" :class="['chat-row', getMessageRowClass(item)]">
            <div v-if="item.kind === 'doctor' || item.kind === 'chat'" class="chat-bubble"
              :class="item.kind === 'doctor' ? 'chat-bubble--doctor' : 'chat-bubble--patient'">
              <p>{{ item.content }}</p>
              <small>{{ item.time }}</small>
            </div>

            <div v-else-if="item.kind === 'confirm_exam'" class="action-card action-card--confirm">
              <div class="action-card__head">
                <strong>待确认检查</strong>
                <span>{{ item.time }}</span>
              </div>
              <p class="action-card__text">{{ item.content }}</p>
              <ul v-if="item.examList.length" class="exam-list">
                <li v-for="exam in item.examList" :key="`${item.id}-${exam}`">{{ exam }}</li>
              </ul>
              <p v-if="item.unmatchedExams.length" class="exam-unmatched">
                未匹配检查：{{ item.unmatchedExams.join('、') }}
              </p>

              <div v-if="!item.resolved" class="confirm-actions">
                <button class="confirm-btn" type="button" :disabled="item.loading"
                  @click="submitExamDecision(item.id, true)">
                  {{ item.loading ? '处理中...' : '确认执行' }}
                </button>
                <button class="cancel-btn" type="button" :disabled="item.loading"
                  @click="submitExamDecision(item.id, false)">
                  暂不执行
                </button>
              </div>

              <p v-else class="confirm-state">
                {{ item.resolved === 'confirmed' ? '已确认执行该检查。' : '已取消该检查。' }}
              </p>
            </div>

            <div v-else-if="item.kind === 'notice'" class="action-card action-card--notice"
              :class="`action-card--notice-${item.level}`">
              <div class="action-card__head">
                <strong>系统提示</strong>
                <span>{{ item.time }}</span>
              </div>
              <p class="action-card__text">{{ item.content }}</p>
            </div>

            <div v-else-if="item.kind === 'error'" class="action-card action-card--error">
              <div class="action-card__head">
                <strong>业务异常</strong>
                <span>{{ item.time }}</span>
              </div>
              <p class="action-card__text">{{ item.content }}</p>
            </div>

            <div v-else class="action-card action-card--result">
              <div class="action-card__head">
                <strong>检查结果</strong>
                <span>{{ item.time }}</span>
              </div>
              <p v-if="item.content" class="action-card__text">{{ item.content }}</p>
              <div v-if="item.results.length" class="result-list">
                <article v-for="result in item.results" :key="`${item.id}-${result.exam_name}`" class="result-item">
                  <h5>{{ result.exam_name }}</h5>
                  <p>{{ result.result }}</p>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input v-model="questionInput" type="text" placeholder="向患者提问，例如：疼痛持续多久？" :disabled="isSending"
            @keydown.enter.prevent="sendQuestion" />
          <button class="send-btn" type="button" :disabled="isSending" @click="sendQuestion">
            {{ isSending ? '发送中...' : '发送' }}
          </button>
        </div>
      </section>

      <section class="record-panel card-panel">
        <nav class="record-tabs">
          <button v-for="tab in tabs" :key="tab.value" type="button" class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === tab.value }" @click="activeTab = tab.value">
            {{ tab.label }}
          </button>
        </nav>

        <div v-if="activeTab === 'emr'" class="record-content">
          <div class="warning-banner">
            <strong>现病史信息不完整</strong>
            <p>你尚未询问胸痛的持续时间与诱发因素，这些信息对鉴别诊断很关键。</p>
          </div>

          <h4>案例背景</h4>
          <div v-if="caseDetail?.patient_background" class="background-box">
            {{ caseDetail.patient_background }}
          </div>
          <div v-else class="background-box background-box--loading">
            {{ caseLoadError ? caseLoadError : '案例背景加载中…' }}
          </div>

          <h4>现病史（HPI）</h4>
          <div class="form-grid">
            <label>
              主诉
              <input v-model="form.complaint" type="text" />
            </label>
            <label>
              起病与时长
              <input v-model="form.onset" type="text" placeholder="如：2 小时前突发" />
            </label>
            <label>
              疼痛程度（1-10）
              <select v-model="form.severity">
                <option value="">请选择</option>
                <option v-for="level in 10" :key="level" :value="String(level)">{{ level }}</option>
              </select>
            </label>
            <label>
              疼痛性质
              <input v-model="form.quality" type="text" placeholder="如：压榨样/刺痛" />
            </label>
            <label class="full-row">
              伴随症状
              <textarea v-model="form.associated" rows="3" placeholder="可记录恶心、出汗、气促、濒死感等"></textarea>
            </label>
          </div>
        </div>

        <div v-else-if="activeTab === 'mentor'" class="placeholder-tab">
          <h4>导师点评</h4>
          <p>当前阶段建议：优先排除急性冠脉综合征，补问危险因素与放射痛部位。</p>
        </div>

        <div v-else class="placeholder-tab">
          <h4>医嘱与检查</h4>
          <p>推荐检查：12 导联心电图、肌钙蛋白、心肌酶谱、D-二聚体、胸片。</p>
        </div>
      </section>
    </main>

    <!-- 病情概要弹窗 -->
    <el-dialog v-model="showSummary" title="病情概要" width="520px" :close-on-click-modal="true">
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="案例标题">{{ caseDetail?.title ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="所属科室">{{ caseDetail?.department ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="难度级别">{{ caseDetail ? (difficultyLabel[caseDetail.difficulty] ??
          caseDetail.difficulty) : '—' }}</el-descriptions-item>
        <el-descriptions-item v-if="caseDetail?.tags?.length" label="标签">
          <el-tag v-for="tag in caseDetail.tags" :key="tag" size="small" style="margin-right:6px">{{ tag }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="案例摘要">{{ caseDetail?.summary ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="案例背景">{{ caseDetail?.patient_background ?? '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  chatWithPatient,
  confirmPatientExam,
  getPatientCaseDetail,
  type ExamConfirmData,
  type ExamResultData,
  type ExamResultItem,
  type NoticeData,
  type PatientCaseSummary,
  type PatientConversationResponse,
  type PatientReplyData,
} from '@/api/ patient/patientApi'

interface ChatMessageBase {
  id: number
  time: string
  kind: 'doctor' | 'chat' | 'confirm_exam' | 'notice' | 'error' | 'exam_result'
}

interface DoctorMessage extends ChatMessageBase {
  kind: 'doctor'
  content: string
}

interface PatientChatMessage extends ChatMessageBase {
  kind: 'chat'
  content: string
}

interface ConfirmExamMessage extends ChatMessageBase {
  kind: 'confirm_exam'
  content: string
  examList: string[]
  unmatchedExams: string[]
  confirmToken: string
  loading: boolean
  resolved?: 'confirmed' | 'cancelled'
}

interface NoticeMessage extends ChatMessageBase {
  kind: 'notice'
  content: string
  level: 'info' | 'warning' | 'error'
}

interface ErrorMessage extends ChatMessageBase {
  kind: 'error'
  content: string
}

interface ExamResultMessage extends ChatMessageBase {
  kind: 'exam_result'
  content: string
  results: ExamResultItem[]
}

type ChatMessage =
  | DoctorMessage
  | PatientChatMessage
  | ConfirmExamMessage
  | NoticeMessage
  | ErrorMessage
  | ExamResultMessage

function getMessageRowClass(message: ChatMessage): 'chat-row--left' | 'chat-row--right' | 'chat-row--center' {
  if (message.kind === 'doctor') {
    return 'chat-row--right'
  }

  if (message.kind === 'notice' || message.kind === 'error') {
    return 'chat-row--center'
  }

  return 'chat-row--left'
}

const route = useRoute()
const displayCaseId = computed(() => String(route.query.caseId ?? '1042'))

const caseDetail = ref<PatientCaseSummary | null>(null)
const caseLoadError = ref('')
const showSummary = ref(false)
const sessionId = ref<string | null>(null)
const isSending = ref(false)
const chatAreaRef = ref<HTMLElement | null>(null)

let messageSeed = 0

const difficultyLabel: Record<string, string> = {
  beginner: '入门',
  intermediate: '中级',
  advanced: '高级',
}

const patientAvatarChar = computed(() => caseDetail.value?.department?.[0] ?? '患')
const patientTitle = computed(() => caseDetail.value?.title ?? '加载中…')
const patientSubtitle = computed(() => {
  if (!caseDetail.value) return ''
  const dept = caseDetail.value.department
  const diff = difficultyLabel[caseDetail.value.difficulty] ?? caseDetail.value.difficulty
  const tag = caseDetail.value.tags[0] ?? ''
  return [dept, diff, tag].filter(Boolean).join(' · ')
})

async function loadCaseDetail() {
  const id = displayCaseId.value
  try {
    const res = await getPatientCaseDetail(id)
    caseDetail.value = res.data
    caseLoadError.value = ''
    sessionId.value = null
    chatMessages.value = []
    // 重置学生笔记表单
    form.value = { complaint: '', onset: '', severity: '', quality: '', associated: '' }
  } catch {
    caseDetail.value = null
    caseLoadError.value = '案例背景加载失败'
  }
}

onMounted(() => {
  void loadCaseDetail()
})

const tabs = [
  { label: '病历与记录', value: 'emr' },
  { label: '导师', value: 'mentor' },
  { label: '医嘱与检查', value: 'orders' },
] as const

const activeTab = ref<(typeof tabs)[number]['value']>('emr')

const chatMessages = ref<ChatMessage[]>([])

const questionInput = ref('')

const form = ref({
  complaint: '胸痛',
  onset: '',
  severity: '',
  quality: '',
  associated: '',
})

function nowTimeLabel(): string {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function nextMessageId(): number {
  messageSeed += 1
  return messageSeed
}

async function scrollChatToBottom() {
  await nextTick()
  if (!chatAreaRef.value) return
  chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
}

function appendMessage(message: ChatMessage) {
  chatMessages.value.push(message)
  void scrollChatToBottom()
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return '请求失败，请稍后重试。'
}

function saveSessionId(value: unknown) {
  if (typeof value === 'string' && value.trim()) {
    sessionId.value = value
  }
}

function pushDoctorMessage(content: string) {
  appendMessage({
    id: nextMessageId(),
    kind: 'doctor',
    content,
    time: nowTimeLabel(),
  })
}

function pushPatientMessage(data: PatientReplyData) {
  appendMessage({
    id: nextMessageId(),
    kind: 'chat',
    content: data.reply,
    time: nowTimeLabel(),
  })
}

function pushConfirmExamMessage(data: ExamConfirmData) {
  appendMessage({
    id: nextMessageId(),
    kind: 'confirm_exam',
    content: data.message,
    examList: data.exam_list,
    unmatchedExams: data.unmatched_exams,
    confirmToken: data.confirm_token,
    loading: false,
    time: nowTimeLabel(),
  })
}

function pushNoticeMessage(data: NoticeData) {
  appendMessage({
    id: nextMessageId(),
    kind: 'notice',
    content: data.message,
    level: data.level,
    time: nowTimeLabel(),
  })
}

function pushErrorMessage(content: string) {
  appendMessage({
    id: nextMessageId(),
    kind: 'error',
    content,
    time: nowTimeLabel(),
  })
}

function pushExamResultMessage(data: ExamResultData) {
  appendMessage({
    id: nextMessageId(),
    kind: 'exam_result',
    content: data.message,
    results: data.results,
    time: nowTimeLabel(),
  })
}

function handleConversationResponse(response: PatientConversationResponse) {
  switch (response.action) {
    case 'chat': {
      const data = response.data as PatientReplyData
      saveSessionId(data.session_id)
      pushPatientMessage(data)
      break
    }
    case 'confirm_exam': {
      const data = response.data as ExamConfirmData
      saveSessionId(data.session_id)
      pushConfirmExamMessage(data)
      break
    }
    case 'notice': {
      const data = response.data as NoticeData
      saveSessionId(data.session_id)
      pushNoticeMessage(data)
      break
    }
    case 'exam_result': {
      const data = response.data as ExamResultData
      saveSessionId(data.session_id)
      pushExamResultMessage(data)
      break
    }
    case 'error':
    default:
      pushErrorMessage(response.msg || '出现业务异常，请稍后重试。')
      break
  }
}

async function sendQuestion() {
  const value = questionInput.value.trim()
  if (!value || isSending.value) {
    return
  }

  pushDoctorMessage(value)
  questionInput.value = ''

  isSending.value = true
  try {
    const res = await chatWithPatient(displayCaseId.value, {
      user_input: value,
      session_id: sessionId.value,
    })
    handleConversationResponse(res)
  } catch (error) {
    pushErrorMessage(normalizeErrorMessage(error))
  } finally {
    isSending.value = false
  }
}

function isConfirmExamMessage(message: ChatMessage): message is ConfirmExamMessage {
  return message.kind === 'confirm_exam'
}

async function submitExamDecision(messageId: number, confirmed: boolean) {
  const target = chatMessages.value.find(
    (message): message is ConfirmExamMessage =>
      message.id === messageId && isConfirmExamMessage(message),
  )

  if (!target || target.loading || target.resolved) {
    return
  }

  target.loading = true
  try {
    const res = await confirmPatientExam(displayCaseId.value, {
      confirm_token: target.confirmToken,
      confirmed,
    })
    target.resolved = confirmed ? 'confirmed' : 'cancelled'
    handleConversationResponse(res)
  } catch (error) {
    pushErrorMessage(normalizeErrorMessage(error))
  } finally {
    target.loading = false
  }
}
</script>

<style scoped>
.clinical-page {
  --blue-strong: #2563eb;
  --blue-soft: #e8f0ff;
  --line: #e5e7eb;
  --text-main: #111827;
  --text-sub: #6b7280;
  --warn-bg: #fff8e7;
  --warn-line: #f4d38a;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  min-height: 100vh;
  background:
    radial-gradient(circle at 68% 22%, rgba(37, 99, 235, 0.12), transparent 38%),
    radial-gradient(circle at 22% 72%, rgba(16, 185, 129, 0.08), transparent 35%),
    #f8fafc;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
}

.top-bar__case {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  min-width: 0;
}

.top-bar__case .label {
  font-size: 13px;
  color: var(--text-sub);
}

.top-bar__case strong {
  font-size: 15px;
}

.divider {
  color: #cbd5e1;
}

.case-title {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-bar__status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
}

.status-chip .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-chip--stable {
  background: #ecfdf5;
  color: #047857;
}

.status-chip--stable .dot {
  background: #10b981;
}

.status-chip--time {
  background: #fff1f2;
  color: #be123c;
}

.status-chip--time .dot {
  background: #f43f5e;
}

.primary-btn {
  border: none;
  border-radius: 8px;
  background: var(--blue-strong);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 12px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #1d4ed8;
}

.secondary-btn {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 12px;
  cursor: pointer;
}

.secondary-btn:hover {
  border-color: #94a3b8;
  color: #334155;
}

.clinical-layout {
  display: grid;
  grid-template-columns: minmax(450px, 1.08fr) minmax(360px, 0.92fr);
  gap: 12px;
  min-height: calc(100vh - 96px);
}

.card-panel {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.patient-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.patient-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
  gap: 12px;
}

.patient-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(145deg, #bfdbfe, #dbeafe);
  color: #1d4ed8;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.patient-profile h2 {
  margin: 0;
  font-size: 15px;
  color: var(--text-main);
}

.patient-profile p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-sub);
}

.ghost-btn {
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--text-sub);
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  cursor: pointer;
}

.ghost-btn:hover {
  color: #1f2937;
  border-color: #cbd5e1;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.94)),
    radial-gradient(circle at center, rgba(148, 163, 184, 0.18), transparent 58%);
}

.timeline-tip {
  width: fit-content;
  margin: 0 auto;
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 4px 8px;
}

.chat-empty {
  margin: 28px auto;
  font-size: 12px;
  color: #64748b;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 10px 14px;
}

.chat-row {
  width: 100%;
  display: flex;
}

.chat-row--left {
  justify-content: flex-start;
}

.chat-row--right {
  justify-content: flex-end;
}

.chat-row--center {
  justify-content: center;
}

.chat-bubble {
  max-width: 72%;
  border-radius: 12px;
  padding: 10px 12px;
  line-height: 1.45;
}

.chat-bubble p {
  margin: 0;
  font-size: 14px;
}

.chat-bubble small {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.7;
}

.chat-bubble--patient {
  background: #ffffff;
  border: 1px solid #dbe1ea;
  color: #1f2937;
  align-self: flex-start;
}

.chat-bubble--doctor {
  background: #dbeafe;
  color: #1e3a8a;
  align-self: flex-end;
}

.action-card {
  align-self: flex-start;
  width: min(86%, 580px);
  border-radius: 12px;
  border: 1px solid #dbe1ea;
  background: #ffffff;
  padding: 10px 12px;
}

.action-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.action-card__head strong {
  font-size: 13px;
  color: #1f2937;
}

.action-card__head span {
  font-size: 11px;
  color: #64748b;
}

.action-card__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #334155;
  white-space: pre-line;
}

.action-card--confirm {
  border-color: #c7d2fe;
  background: #eef2ff;
}

.exam-list {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #1f2937;
  font-size: 13px;
}

.exam-list li+li {
  margin-top: 5px;
}

.exam-unmatched {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #9a3412;
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 8px;
  padding: 6px 8px;
}

.confirm-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.confirm-btn,
.cancel-btn {
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 12px;
  cursor: pointer;
}

.confirm-btn {
  background: #1d4ed8;
  color: #ffffff;
}

.confirm-btn:hover {
  background: #1e40af;
}

.cancel-btn {
  background: #e2e8f0;
  color: #334155;
}

.cancel-btn:hover {
  background: #cbd5e1;
}

.confirm-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.confirm-state {
  margin: 10px 0 0;
  font-size: 12px;
  color: #334155;
}

.action-card--notice {
  background: #f8fafc;
}

.action-card--notice-info {
  border-color: #93c5fd;
  background: #eff6ff;
}

.action-card--notice-warning {
  border-color: #facc15;
  background: #fefce8;
}

.action-card--notice-error {
  border-color: #fda4af;
  background: #fff1f2;
}

.action-card--error {
  border-color: #fecaca;
  background: #fef2f2;
}

.action-card--result {
  border-color: #bae6fd;
  background: #f0f9ff;
}

.result-list {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.result-item {
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 8px 10px;
}

.result-item h5 {
  margin: 0;
  font-size: 12px;
  color: #1d4ed8;
}

.result-item p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #1f2937;
  white-space: pre-line;
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid var(--line);
  background: #f8fafc;
}

.chat-input input {
  flex: 1;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 13px;
}

.chat-input input:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.35);
}

.send-btn {
  border: none;
  border-radius: 9px;
  background: var(--blue-strong);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  padding: 0 14px;
  cursor: pointer;
}

.send-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.background-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.7;
  color: #334155;
  margin-bottom: 4px;
}

.background-box--loading {
  color: #94a3b8;
  font-style: italic;
}

.record-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.record-tabs {
  display: flex;
  border-bottom: 1px solid var(--line);
  background: #f8fafc;
}

.tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 600;
  padding: 13px 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab-btn--active {
  color: #1d4ed8;
  border-bottom-color: #3b82f6;
  background: #ffffff;
}

.record-content,
.placeholder-tab {
  padding: 14px;
  overflow-y: auto;
}

.warning-banner {
  border: 1px solid var(--warn-line);
  background: var(--warn-bg);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.warning-banner strong {
  color: #b45309;
  font-size: 13px;
}

.warning-banner p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #92400e;
  line-height: 1.45;
}

.record-content h4,
.placeholder-tab h4 {
  margin: 14px 0 10px;
  font-size: 15px;
  color: #111827;
}

.placeholder-tab p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  font-weight: 600;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  border: 1px solid #d5dde8;
  border-radius: 8px;
  padding: 9px 10px;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
}

.form-grid textarea {
  resize: vertical;
  min-height: 84px;
}

.form-grid input:focus,
.form-grid select:focus,
.form-grid textarea:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.25);
  background: #ffffff;
}

.full-row {
  grid-column: 1 / -1;
}

.vitals-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(80px, 1fr));
  gap: 10px;
}

.vital-card {
  background: #f8fafc;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}

.vital-card span {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.vital-card strong {
  display: block;
  margin-top: 5px;
  font-size: 20px;
  color: #0f172a;
}

.vital-card .danger {
  color: #dc2626;
}

@media (max-width: 1200px) {
  .clinical-page {
    padding: 12px;
  }

  .clinical-layout {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .patient-panel {
    min-height: 430px;
  }

  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .top-bar__status {
    width: 100%;
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .patient-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chat-bubble {
    max-width: 92%;
  }

  .action-card {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .vitals-row {
    grid-template-columns: 1fr;
  }
}
</style>
