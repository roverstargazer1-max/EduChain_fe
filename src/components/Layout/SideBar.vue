<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon" :class="{ clickable: isCollapsed }" @click="isCollapsed && $emit('toggle-collapse')">
        <img src="@/assets/logo1.webp" alt="EduChain Logo" width="55" height="55" />
      </div>
      <span v-show="!isCollapsed" class="logo-text">EduChain <span class="logo-pro">Pro</span></span>
      <button v-show="!isCollapsed" class="collapse-btn" @click="$emit('toggle-collapse')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-group">
        <span v-show="!isCollapsed" class="nav-group-label">平台</span>
        <router-link v-for="item in platformItems" :key="item.path" :to="item.path" class="nav-item"
          active-class="nav-item--active">
          <span class="nav-icon" v-html="item.icon"></span>
          <span v-show="!isCollapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>

      <div class="nav-group">
        <span v-show="!isCollapsed" class="nav-group-label">资源</span>
        <router-link v-for="item in resourceItems" :key="item.path" :to="item.path" class="nav-item"
          active-class="nav-item--active">
          <span class="nav-icon" v-html="item.icon"></span>
          <span v-show="!isCollapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Bottom -->
    <div class="sidebar-bottom">
      <button class="nav-item logout-btn">
        <span class="nav-icon" v-html="iconLogout"></span>
        <span v-show="!isCollapsed" class="nav-label">退出登录</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
//图标
import {
  iconDashboard,
  iconCases,
  iconPerformance,
  iconLibrary,
  iconSettings,
  iconLogout,
} from '@/assets/icons'

defineProps<{
  isCollapsed: boolean
}>()

defineEmits<{
  'toggle-collapse': []
}>()

const platformItems = [
  { label: '首页', path: '/', icon: iconDashboard },
  { label: '临床病例', path: '/clinical-cases', icon: iconCases },
  { label: '表现', path: '/performance', icon: iconPerformance },
]

const resourceItems = [
  { label: '资料库', path: '/library', icon: iconLibrary },
  { label: '设置', path: '/settings', icon: iconSettings },
]
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
  height: 100vh;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.2s, min-width 0.2s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
  min-width: 64px;
}

/* Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  justify-content: center;
}

.logo-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.logo-icon.clickable {
  cursor: pointer;
  border-radius: 8px;
}

.logo-icon.clickable:hover {
  opacity: 0.8;
}

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

.logo-pro {
  color: #2563eb;
}

.collapse-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.collapse-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 12px;
  overflow-y: auto;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-group-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
  padding: 4px 8px;
  margin-bottom: 4px;
  white-space: nowrap;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.nav-item:hover {
  background: #e5e7eb;
}

.nav-item--active {
  background: #eff6ff;
  color: #2563eb;
}

.nav-item--active .nav-icon :deep(svg) {
  stroke: #2563eb;
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
}

.nav-label {
  white-space: nowrap;
}

/* Bottom */
.sidebar-bottom {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  color: #6b7280;
}

.logout-btn:hover {
  color: #dc2626;
}
</style>
