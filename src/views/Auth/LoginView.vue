<template>
  <div class="login-page">
    <div class="noise-layer"></div>

    <div class="login-shell">
      <section class="brand-panel">
        <div class="brand-top">
          <div class="logo-block">∿</div>
          <div class="brand-name">MedEdu Chain</div>
        </div>

        <p class="brand-pill">Medical Training Platform</p>

        <h1>
          临床诊断思维
          <br />
          <span>模拟训练</span>
        </h1>

        <p class="brand-desc">
          通过临床案例模拟演练，辅助医学生与临床医生提升
          诊断推理与诊疗能力。
        </p>

        <ul class="feature-list">
          <li>
            <span class="feature-icon">⛨</span>
            <span>临床推理模拟</span>
          </li>
          <li>
            <span class="feature-icon">⚕</span>
            <span>临床指南库</span>
          </li>
          <li>
            <span class="feature-icon">◎</span>
            <span>标准化病历库</span>
          </li>
        </ul>

        <p class="brand-footer">Medical Training System. 2026.</p>
      </section>

      <section class="form-panel">
        <form class="login-form" @submit.prevent="submitLogin">
          <header class="form-head">
            <h2>登录</h2>
            <p>请使用账号访问系统</p>
          </header>

          <label class="field-wrap" for="username">
            <input id="username" v-model.trim="form.username" type="text" autocomplete="username" placeholder="账号"
              :disabled="isSubmitting" />
          </label>

          <label class="field-wrap" for="password">
            <input id="password" v-model="form.password" type="password" autocomplete="current-password"
              placeholder="密码" :disabled="isSubmitting" />
          </label>

          <div class="helper-row">
            <button class="link-btn" type="button" disabled>忘记密码?</button>
          </div>

          <button class="submit-btn" type="submit" :disabled="isSubmitting">
            <span>{{ isSubmitting ? '登录中...' : '登录' }}</span>
            <span class="arrow">›</span>
          </button>

          <div class="contact-tip">
            <p>还没有账号？</p>
            <strong>请联系管理员开通</strong>
          </div>

          <footer class="agreement">隐私协议 与 使用条款</footer>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { login } from '@/api/auth/authApi'
import { setAuthSession } from '@/utils/auth'

interface LoginFormState {
  username: string
  password: string
}

const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)

const form = reactive<LoginFormState>({
  username: '',
  password: '',
})

function normalizeRedirect(rawValue: unknown): string {
  if (typeof rawValue !== 'string') {
    return '/'
  }

  const value = rawValue.trim()
  if (!value) {
    return '/'
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return value
  }

  try {
    const decoded = decodeURIComponent(value)
    if (decoded.startsWith('/') && !decoded.startsWith('//')) {
      return decoded
    }
  } catch {
    // ignore malformed redirect value
  }

  return '/'
}

async function submitLogin() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入账号与密码')
    return
  }

  isSubmitting.value = true

  try {
    const response = await login({
      username: form.username,
      password: form.password,
    })

    setAuthSession(response.data.access_token, response.data.user)

    ElMessage.success('登录成功')
    await router.replace(normalizeRedirect(route.query.redirect))
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败，请稍后再试'
    ElMessage.error(message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  padding: clamp(14px, 3vw, 34px);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 16% 12%, rgba(57, 102, 238, 0.14), transparent 34%),
    radial-gradient(circle at 82% 84%, rgba(15, 118, 110, 0.12), transparent 32%),
    #ecedf2;
  overflow: hidden;
}

.noise-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.24;
  background-image: radial-gradient(rgba(22, 32, 64, 0.16) 0.5px, transparent 0.5px);
  background-size: 4px 4px;
}

.login-shell {
  position: relative;
  z-index: 1;
  width: min(1220px, 100%);
  min-height: min(780px, calc(100vh - 28px));
  border-radius: 36px;
  overflow: hidden;
  box-shadow: 0 22px 46px rgba(15, 23, 42, 0.12);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: #f8f9fc;
}

.brand-panel {
  padding: clamp(28px, 4vw, 54px);
  display: flex;
  flex-direction: column;
  animation: rise-in 0.7s cubic-bezier(0.18, 0.85, 0.35, 1) both;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-block {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 20px;
  color: #ffffff;
  background: linear-gradient(145deg, #3b82f6, #1d4ed8);
  box-shadow: 0 14px 24px rgba(29, 78, 216, 0.28);
}

.brand-name {
  font-family: 'Sora', 'Poppins', 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #161b2a;
}

.brand-name span {
  color: #8fa1bc;
  font-weight: 500;
}

.brand-pill {
  width: fit-content;
  margin-top: 34px;
  padding: 8px 18px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #dde2ed;
  color: #8ba0c2;
  font-family: 'Sora', 'Poppins', 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

h1 {
  margin: 30px 0 0;
  color: #131823;
  font-family: 'DIN Alternate', 'Bebas Neue', 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: clamp(42px, 5.5vw, 78px);
  letter-spacing: 0.01em;
  line-height: 1.03;
}

h1 span {
  color: #2f62e1;
}

.brand-desc {
  max-width: 560px;
  margin-top: 30px;
  color: #7386a3;
  font-size: 19px;
  line-height: 1.65;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}

.feature-list {
  margin: auto 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 18px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #2f3f5d;
  font-size: 20px;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-weight: 600;
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #e8eefb;
  color: #2f62e1;
  font-size: 24px;
}

.brand-footer {
  margin-top: 24px;
  color: #b2bfd3;
  font-family: 'Sora', 'Poppins', 'Noto Sans SC', 'PingFang SC', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  font-weight: 700;
}

.form-panel {
  background: #ffffff;
  border-left: 1px solid #ebeff6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 3.6vw, 44px);
  animation: slide-in 0.75s cubic-bezier(0.2, 0.82, 0.2, 1) both;
}

.login-form {
  width: min(440px, 100%);
  display: flex;
  flex-direction: column;
}

.form-head h2 {
  margin: 0;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  color: #1a2232;
  font-size: 44px;
  font-weight: 700;
}

.form-head p {
  margin: 10px 0 0;
  color: #a4b3c7;
  font-size: 16px;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}

.field-wrap {
  margin-top: 22px;
}

.field-wrap input {
  width: 100%;
  height: 56px;
  border: 1px solid transparent;
  border-radius: 18px;
  background: #f2f4f8;
  padding: 0 22px;
  color: #182133;
  font-size: 16px;
  font-family: 'Sora', 'Noto Sans SC', 'PingFang SC', sans-serif;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field-wrap input::placeholder {
  color: #c2cddc;
}

.field-wrap input:focus {
  outline: none;
  border-color: #8db0ff;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.helper-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.link-btn {
  border: none;
  background: transparent;
  color: #2f62e1;
  font-size: 15px;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-weight: 600;
  cursor: default;
  padding: 0;
}

.submit-btn {
  margin-top: 24px;
  height: 58px;
  border: none;
  border-radius: 22px;
  background: linear-gradient(128deg, #3568e6, #2b58c9);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(53, 104, 230, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(53, 104, 230, 0.34);
}

.submit-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.arrow {
  transform: translateY(1px);
  font-size: 19px;
}

.contact-tip {
  margin-top: 26px;
  text-align: center;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}

.contact-tip p {
  margin: 0;
  color: #b4bfd0;
  font-size: 16px;
}

.contact-tip strong {
  display: inline-block;
  margin-top: 8px;
  color: #2f62e1;
  font-size: 26px;
  font-weight: 700;
}

.agreement {
  margin-top: 34px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f7;
  text-align: center;
  color: #c2cad8;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 12px;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(22px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1180px) {
  .login-shell {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .brand-panel {
    padding-bottom: 24px;
  }

  .form-panel {
    border-left: none;
    border-top: 1px solid #ebeff6;
  }

  .brand-desc {
    max-width: none;
  }
}

@media (max-width: 720px) {
  .login-page {
    padding: 10px;
  }

  .login-shell {
    border-radius: 20px;
  }

  .brand-panel,
  .form-panel {
    padding: 20px 16px;
  }

  .feature-list {
    margin-top: 26px;
  }
}
</style>
