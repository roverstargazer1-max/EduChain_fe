<template>
  <div class="placeholder-page">
    <h1>设置</h1>
    <el-button type="primary" @click="checkHealthState">检查服务状态</el-button>
  </div>
</template>

<script setup lang="ts">
import { checkHealth } from '@/api/health/healthApi'
import { ElMessage } from 'element-plus'
const checkHealthState = async () => {
  try {
    const result = await checkHealth()
    if (!result.data.llm_enabled) {
      ElMessage.error('LLM密钥未配置!')
    } else if (!result.data.ok) {
      ElMessage.error('服务异常!')
    } else {
      ElMessage.success('llm服务检查成功: 服务正常且LLM密钥已配置')
    }
  } catch (error) {
    ElMessage.error(`llm服务检查失败: ${error}`)
  }
}

</script>

<style scoped>
.placeholder-page {
  padding: 32px 40px;
}

h1 {
  color: #111827;
  margin: 0 0 8px;
}

p {
  color: #6b7280;
}
</style>
