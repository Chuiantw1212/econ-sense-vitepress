---
layout: false
title: 理財規劃書封面
---

<script setup>
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const reportData = ref({
  title: '高氏家族 全方位理財規劃書',
  clientName: '高大志 先生 / 王美美 女士',
  advisors: ['楊先立', '張沐月'],
  date: new Date().toLocaleDateString('zh-TW'),
  disclaimer: '本報告書包含機密財務資訊，僅供客戶本人參考，嚴禁外流。'
})

const startPlanning = () => {
  window.location.href = '/docs/table-of-contents' 
}
</script>

<div class="financial-cover">
  <el-container class="financial-cover__container">
    <el-main class="financial-cover__main">
      <el-card class="financial-cover__card" shadow="hover">
        <template #header>
          <div class="financial-cover__header">
            <el-tag class="financial-cover__tag" effect="dark" round>2023 年度規劃</el-tag>
            <h1 class="financial-cover__title">{{ reportData.title }}</h1>
            <div class="financial-cover__subtitle">KAO FAMILY FINANCIAL PLANNING</div>
          </div>
        </template>
        <div class="financial-cover__info">
          <el-descriptions :column="1" border class="financial-cover__descriptions">
            <el-descriptions-item label-class-name="financial-cover__label" label="委託客戶">
              <span class="financial-cover__highlight">{{ reportData.clientName }}</span>
            </el-descriptions-item>
            <el-descriptions-item label-class-name="financial-cover__label" label="規劃顧問">
              <el-space wrap>
                <el-tag v-for="advisor in reportData.advisors" :key="advisor" class="financial-cover__advisor-tag" effect="plain">{{ advisor }}</el-tag>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label-class-name="financial-cover__label" label="報告日期">{{ reportData.date }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="financial-cover__actions">
          <button class="financial-cover__btn" @click="startPlanning">進入規劃書<el-icon class="financial-cover__btn-icon"><ArrowRight /></el-icon></button>
        </div>
        <el-divider content-position="center" class="financial-cover__divider">聲明</el-divider>
        <p class="financial-cover__disclaimer">{{ reportData.disclaimer }}</p>
      </el-card>
    </el-main>
    <el-footer class="financial-cover__footer">Powered by VitePress & Element Plus | 線上理財規劃系統</el-footer>
  </el-container>
</div>

<style lang="scss">
.financial-cover {
  background-color: var(--vp-c-bg);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--vp-font-family-base);
  background: linear-gradient(180deg, var(--vp-c-brand-soft), var(--vp-c-bg) 60%, var(--vp-c-bg) 100%);

  &__container {
    width: 100%;
    max-width: 800px;
    padding: 20px;
  }

  &__main {
    padding: 0;
    overflow: visible;
  }

  &__card {
    --el-card-border-radius: 12px;
    --el-card-bg-color: var(--vp-c-bg-alt); 
    --el-card-border-color: var(--vp-c-divider);
    border: 1px solid var(--vp-c-divider);
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    
    .el-card__body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &:hover {
      transform: translateY(-5px);
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    }
  }

  &__header {
    text-align: center;
    padding: 10px 0;
  }

  &__tag {
    --el-tag-bg-color: var(--vp-c-brand-1);
    --el-tag-border-color: var(--vp-c-brand-1);
    --el-tag-text-color: #ffffff;
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__title {
    font-size: 2.2rem;
    color: var(--vp-c-text-1);
    margin: 20px 0 10px;
    font-weight: 700;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }

  &__subtitle {
    font-size: 0.9rem;
    color: var(--vp-c-brand-3);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
  }

  &__info {
    width: 100%;
    margin: 20px 0;
  }

  &__descriptions {
    --el-text-color-regular: var(--vp-c-text-2);
    --el-text-color-primary: var(--vp-c-text-1);
    --el-border-color-lighter: var(--vp-c-divider);
    
    :deep(.el-descriptions__label) {
      background-color: var(--vp-c-bg-soft) !important;
      font-weight: 600;
      color: var(--vp-c-text-2);
      width: 120px;
      text-align: center;
    }
    
    :deep(.el-descriptions__content) {
      background-color: var(--vp-c-bg-alt);
    }
  }

  &__highlight {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--vp-c-brand-1);
  }

  &__advisor-tag {
    --el-tag-text-color: var(--vp-c-brand-2);
    --el-tag-border-color: var(--vp-c-brand-soft);
    --el-tag-bg-color: transparent;
  }

  &__actions {
    margin-top: 30px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 32px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    background-color: var(--vp-c-brand-3);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: var(--vp-c-brand-1);
      transform: scale(1.05);
    }

    &:active {
      background-color: var(--vp-c-brand-4);
      transform: scale(0.98);
    }
  }

  &__btn-icon {
    margin-left: 8px;
  }

  &__divider {
    --el-border-color: var(--vp-c-divider);
    
    :deep(.el-divider__text) {
      background-color: var(--vp-c-bg-alt);
      color: var(--vp-c-text-3);
    }
  }

  &__disclaimer {
    font-size: 0.85rem;
    color: var(--vp-c-text-3);
    text-align: center;
    margin-top: 10px;
    line-height: 1.5;
  }

  &__footer {
    text-align: center;
    color: var(--vp-c-text-3);
    font-size: 0.8rem;
    padding: 20px;
    margin-top: 20px;
    opacity: 0.8;
  }
}

.dark .financial-cover {
  background: linear-gradient(180deg, var(--vp-c-bg), #1f1f1f 100%);
}
</style>