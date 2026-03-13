<template>
  <div class="dashboard">
    <section class="welcome-section">
      <h1 class="welcome-title">欢迎回来！</h1>
      <p class="welcome-subtitle">准备好继续你的临床推理训练了吗？</p>
    </section>

    <section class="cases-section">
      <div class="section-heading">
        <h2 class="section-title">所有病例</h2>
        <span class="section-count">共 {{ patientCases.length }} 个</span>
      </div>

      <div v-if="isLoading" class="status-panel">
        <h3 class="status-title">病例加载中</h3>
        <p class="status-text">正在从后端同步病例列表，请稍候。</p>
      </div>

      <div v-else-if="loadError" class="status-panel status-panel--error">
        <h3 class="status-title">病例加载失败</h3>
        <p class="status-text">{{ loadError }}</p>
        <button class="retry-button" type="button" @click="reloadCases">重新加载</button>
      </div>

      <div v-else-if="patientCases.length === 0" class="status-panel">
        <h3 class="status-title">暂无病例</h3>
        <p class="status-text">当前没有可展示的病例数据。</p>
      </div>

      <div v-else class="cases-row">
        <CaseCard v-for="item in patientCases" :key="item.case_id" :case-id="item.case_id" :level="item.difficulty"
          :category="item.department" :title="item.title" :description="item.summary" :tags="item.tags"
          @start="handleStartSimulation(item)" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CaseCard from './CaseCard.vue'
import type { PatientCaseSummary } from '@/api/ patient/patientApi'
import { getPatientCases } from '@/api/ patient/patientApi'

const router = useRouter()
const patientCases = ref<PatientCaseSummary[]>([])
const isLoading = ref(false)
const loadError = ref('')
const dashboardCasePageSize = 50

async function fetchAllCaseSummaries(): Promise<PatientCaseSummary[]> {
  const firstPageResponse = await getPatientCases({
    page: 1,
    page_size: dashboardCasePageSize,
  })
  const { cases, total_pages: totalPages, page_size: pageSize } = firstPageResponse.data

  if (totalPages <= 1) {
    return cases
  }

  const remainingResponses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getPatientCases({ page: index + 2, page_size: pageSize }),
    ),
  )

  return cases.concat(...remainingResponses.map((response) => response.data.cases))
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return '加载病例列表时发生未知错误'
}

async function loadCases() {
  isLoading.value = true
  loadError.value = ''

  try {
    patientCases.value = await fetchAllCaseSummaries()
  } catch (error) {
    patientCases.value = []
    loadError.value = normalizeErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

function reloadCases() {
  void loadCases()
}

function handleStartSimulation(item: PatientCaseSummary) {
  console.log('开始模拟:', item.title)
  void router.push({
    name: 'ClinicalCases',
    query: { caseId: item.case_id },
  })
}

onMounted(() => {
  void loadCases()
})
</script>

<style scoped>
.dashboard {
  padding: 32px 40px;
  height: 100%;
  width: 100%;
}

.welcome-section {
  margin-bottom: 28px;
}

.welcome-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.welcome-subtitle {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
}

.stats-row {
  display: flex;
  gap: 20px;
  margin-bottom: 36px;
}

.cases-section {
  margin-bottom: 32px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.section-count {
  font-size: 13px;
  color: #6b7280;
}

.cases-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.status-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.status-panel--error {
  border-color: #fecaca;
  background: #fef2f2;
}

.status-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.status-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

.retry-button {
  margin-top: 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.retry-button:hover {
  background: #1d4ed8;
}

@media (max-width: 900px) {
  .dashboard {
    padding: 24px 20px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
