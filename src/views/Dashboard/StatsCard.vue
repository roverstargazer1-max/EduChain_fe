<template>
    <div class="stats-card">
        <p class="stats-label">{{ label }}</p>
        <div class="stats-bottom">
            <span class="stats-value">{{ value }}</span>
            <span class="stats-badge" :class="badgeType">{{ badge }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    value: string
    badge: string
    badgeType?: 'info' | 'success' | 'warning'
}>()
</script>

<style scoped>
.stats-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px 24px;
    flex: 1;
    min-width: 0;
}

.stats-label {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 8px 0;
}

.stats-bottom {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

.stats-value {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
}

.stats-badge {
    font-size: 13px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 6px;
}

.stats-badge.info {
    color: #2563eb;
    background: #eff6ff;
}

.stats-badge.success {
    color: #16a34a;
    background: #f0fdf4;
}

.stats-badge.warning {
    color: #dc2626;
    background: #fef2f2;
}
</style>
