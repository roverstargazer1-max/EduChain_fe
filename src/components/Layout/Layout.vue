<template>
  <div class="main-layout">
    <SideBar :is-collapsed="isCollapsed" @toggle-collapse="isCollapsed = !isCollapsed" />
    <main class="main-content" :class="{ expanded: isCollapsed }">
      <RouterView />
    </main>
    <!-- Help button -->
    <button class="help-btn">?</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SideBar from '@/components/Layout/SideBar.vue'

const isCollapsed = ref(false)
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
}

.main-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background: #ffffff;
}

.help-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.help-btn:hover {
  background: #e5e7eb;
  color: #374151;
}
</style>
