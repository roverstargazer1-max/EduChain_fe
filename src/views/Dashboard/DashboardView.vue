<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <h1 class="welcome-title">Welcome back, Dr. Student</h1>
      <p class="welcome-subtitle">Ready to continue your clinical reasoning training?</p>
    </section>

    <!-- Stats Row -->
    <section class="stats-row">
      <StatsCard label="Cases Completed" value="12" badge="+2 this week" badge-type="info" />
      <StatsCard label="Avg. Accuracy" value="87%" badge="+1.5%" badge-type="success" />
      <StatsCard label="Mentor Feedback" value="5 New" badge="Review pending" badge-type="warning" />
    </section>

    <!-- Recommended Cases -->
    <section class="cases-section">
      <h2 class="section-title">Recommended Cases</h2>
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
    category: 'Cardiology',
    title: 'Acute Chest Pain',
    description: '56M presenting with sudden onset substernal chest pressure.',
  },
  {
    level: 'Beginner',
    category: 'Pulmonology',
    title: 'Persistent Cough',
    description: '34F with 3-week history of dry cough and low-grade fever.',
  },
  {
    level: 'Advanced',
    category: 'Gastroenterology',
    title: 'Abdominal Pain',
    description: '45M with severe RLQ pain and nausea.',
  },
]

function handleStartSimulation(item: CaseItem) {
  console.log('Starting simulation:', item.title)
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
