<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <h1 class="welcome-title">欢迎回来！</h1>
      <p class="welcome-subtitle">准备好继续你的临床推理训练了吗？</p>
    </section>

    <!-- Stats Row -->
    <section class="stats-row">
      <StatsCard label="已完成病例" value="12" badge="本周新增 2 例" badge-type="info" />
      <StatsCard label="平均准确率" value="87%" badge="提升 1.5%" badge-type="success" />
      <StatsCard label="导师反馈" value="5 条新反馈" badge="待查看" badge-type="warning" />
    </section>

    <!-- Recommended Cases -->
    <section class="cases-section">
      <h2 class="section-title">推荐病例</h2>
      <div class="cases-row">
        <CaseCard v-for="item in recommendedCases" :key="item.title" :level="item.level" :category="item.category"
          :title="item.title" :description="item.description" @start="handleStartSimulation(item)" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import StatsCard from './StatsCard.vue'
import CaseCard from './CaseCard.vue'

interface CaseItem {
  level: string
  category: string
  title: string
  description: string
}

const recommendedCases: CaseItem[] = [
  {
    level: 'Intermediate',
    category: '心血管内科',
    title: '急性胸痛',
    description: '56 岁男性，突发胸骨后压榨样疼痛就诊。',
  },
  {
    level: 'Beginner',
    category: '呼吸内科',
    title: '持续性咳嗽',
    description: '34 岁女性，干咳伴低热已持续 3 周。',
  },
  {
    level: 'Advanced',
    category: '消化内科',
    title: '腹痛',
    description: '45 岁男性，右下腹剧烈疼痛并伴有恶心。',
  },
]

function handleStartSimulation(item: CaseItem) {
  console.log('开始模拟:', item.title)
}
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

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.cases-row {
  display: flex;
  gap: 20px;
}

@media (max-width: 900px) {

  .stats-row,
  .cases-row {
    flex-direction: column;
  }
}
</style>
