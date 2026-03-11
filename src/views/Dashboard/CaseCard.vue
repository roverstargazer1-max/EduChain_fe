<template>
  <div class="case-card">
    <div class="case-header">
      <span class="case-level" :class="levelClass">{{ displayLevel }}</span>
      <span class="case-category">{{ category }}</span>
    </div>
    <h3 class="case-title">{{ title }}</h3>
    <p class="case-description">{{ description }}</p>
    <div v-if="tags.length > 0" class="case-tags">
      <span v-for="tag in tags.slice(0, 4)" :key="tag" class="case-tag">{{ tag }}</span>
    </div>
    <div class="case-footer">
      <p v-if="caseId" class="case-id">病例编号：{{ caseId }}</p>
      <button type="button" class="case-action" @click="$emit('start')">开始模拟 →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  caseId?: string
  level: string
  category: string
  title: string
  description: string
  tags?: string[]
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

const displayLevel = computed(() => {
  const l = props.level.toLowerCase()
  if (l === 'beginner') return '初级'
  if (l === 'intermediate') return '中级'
  if (l === 'advanced') return '高级'
  return props.level || '未分级'
})

const tags = computed(() => props.tags ?? [])
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

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.case-tag {
  border-radius: 999px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 12px;
  padding: 4px 10px;
}

.case-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.case-id {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
}

.case-action {
  flex-shrink: 0;
  border: none;
  border-radius: 14px;
  background: #eef2f7;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  padding: 14px 22px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.case-action:hover {
  background: #e2e8f0;
}

.case-action:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}
</style>
