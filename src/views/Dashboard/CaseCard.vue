<template>
  <div class="case-card">
    <div class="case-header">
      <span class="case-level" :class="levelClass">{{ level }}</span>
      <span class="case-category">{{ category }}</span>
    </div>
    <h3 class="case-title">{{ title }}</h3>
    <p class="case-description">{{ description }}</p>
    <a href="#" class="case-link" @click.prevent="$emit('start')">
      Start Simulation →
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  level: string
  category: string
  title: string
  description: string
}>()

defineEmits<{
  start: []
}>()

const levelClass = computed(() => {
  const l = props.level.toLowerCase()
  if (l === 'beginner') return 'level-beginner'
  if (l === 'intermediate') return 'level-intermediate'
  if (l === 'advanced') return 'level-advanced'
  return ''
})
</script>

<style scoped>
.case-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.case-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.case-level {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 4px;
}

.level-beginner {
  color: #16a34a;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.level-intermediate {
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.level-advanced {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.case-category {
  font-size: 13px;
  color: #9ca3af;
}

.case-title {
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
}

.case-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
  flex: 1;
}

.case-link {
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  display: inline-block;
}

.case-link:hover {
  text-decoration: underline;
}
</style>
