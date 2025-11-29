---
layout: false
title: 家庭成員與背景
---
<script setup>
import { ref } from 'vue'
import { User, UserFilled, Avatar, Briefcase, HomeFilled, Male, Female, Edit, Check, Plus, Delete, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const familyMembers = ref({
  parents: [
    { name: '高大志', relation: '本人', age: 60, job: '太陽貿易老闆', status: '家中經濟支柱', icon: 'UserFilled' },
    { name: '王美美', relation: '配偶', age: 59, job: '公司股東', status: '重度身心障礙', icon: 'User' }
  ],
  elders: [
    { name: '高父親', relation: '父親', age: 85, job: '退休', status: '需照護', icon: 'Male' },
    { name: '高母親', relation: '母親', age: 83, job: '退休', status: '需照護', icon: 'Female' },
    { name: '高妹妹', relation: '妹妹', age: 55, job: '無', status: '中度身障', icon: 'Female' }
  ],
  children: [
    { name: '高一為', relation: '長子', age: 30, job: '無', status: '服刑中/離異', icon: 'Male' },
    { name: '高一心', relation: '長女', age: 27, job: '設計師', status: '定居美國/未婚', icon: 'Female' },
    { name: '高一凡', relation: '次子', age: 24, job: '業務', status: '家族接班人', icon: 'Male' },
    { name: '小孫女', relation: '孫女', age: 3, job: '幼兒', status: '需教育基金', icon: 'Female' }
  ]
})
const iconMap = { UserFilled, User, Male, Female }
const isEditingFamily = ref(false)
const toggleFamilyEdit = () => {
  if (isEditingFamily.value) ElMessage.success('家庭成員資料已更新')
  isEditingFamily.value = !isEditingFamily.value
}
const addFamilyMember = (group) => {
  familyMembers.value[group].push({ name: '新成員', relation: '關係', age: 0, job: '職業', status: '狀態', icon: 'User' })
}
const removeFamilyMember = (group, index) => {
  familyMembers.value[group].splice(index, 1)
}
const toggleIcon = (member) => {
  if (!isEditingFamily.value) return
  const icons = ['Male', 'Female', 'User', 'UserFilled']
  const currentIdx = icons.indexOf(member.icon)
  member.icon = icons[(currentIdx + 1) % icons.length]
}
const isEditingProfile = ref(false)
const clientProfile = ref([
  { id: 1, label: '投資屬性', value: '保守穩健型', tag: 'Risk Averse' },
  { id: 2, label: '理財動機', value: '資產傳承、退休規劃', tag: 'Legacy' },
  { id: 3, label: '期望退休', value: '70 歲', tag: '10 Yrs Left' },
  { id: 4, label: '資產來源', value: '本業收入、投資分紅', tag: 'Business' }
])
const toggleEdit = () => {
  if (isEditingProfile.value) ElMessage.success('客戶背景資料已更新')
  isEditingProfile.value = !isEditingProfile.value
}
const addProfileItem = () => {
  clientProfile.value.push({ id: Date.now(), label: '', value: '', tag: '' })
}
const removeProfileItem = (index) => {
  clientProfile.value.splice(index, 1)
}
const nextStep = () => {
  window.location.href = './goal-setting'
}
</script>
<el-container style="min-height: 100vh; background-color: var(--el-bg-color-page);">
  <el-main>
    <el-row justify="center" style="margin-bottom: 30px; margin-top: 20px;">
      <el-col :xs="22" :sm="20" :md="18" :lg="16" style="text-align: center;">
        <el-icon :size="48" color="var(--el-color-primary)" style="margin-bottom: 16px;"><Avatar /></el-icon>
        <el-text tag="h1" type="primary" style="font-size: 2rem; margin: 0; display: block;">家庭成員與背景</el-text>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-bottom: 30px;">
      <el-col :xs="22" :sm="20" :md="18" :lg="16">
        <el-card shadow="never" style="border-radius: 12px; border-top: 4px solid var(--el-color-primary);">
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                <el-icon :size="20" color="var(--el-color-primary)" style="margin-right: 8px;"><Briefcase /></el-icon>
                <el-text tag="b" size="large">客戶背景與理財價值觀</el-text>
              </div>
              <el-button :type="isEditingProfile ? 'success' : 'primary'" :icon="isEditingProfile ? Check : Edit" circle plain @click="toggleEdit" />
            </div>
          </template>
          <div style="padding: 0 10px;">
            <transition-group name="el-fade-in">
              <div v-for="(item, index) in clientProfile" :key="item.id" style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--el-border-color-lighter);">
                <div style="width: 120px; flex-shrink: 0;">
                  <el-input v-if="isEditingProfile" v-model="item.label" placeholder="項目名稱" size="default" />
                  <el-text v-else type="info" tag="b">{{ item.label }}</el-text>
                </div>
                <div v-if="!isEditingProfile" style="margin: 0 16px; color: var(--el-color-info-light); opacity: 0.5;">|</div>
                <div style="flex-grow: 1; margin-left: 10px; margin-right: 10px;">
                  <el-input v-if="isEditingProfile" v-model="item.value" placeholder="內容描述" size="default" />
                  <el-text v-else size="default">{{ item.value }}</el-text>
                </div>
                <div style="width: 100px; text-align: right; flex-shrink: 0;">
                  <el-input v-if="isEditingProfile" v-model="item.tag" placeholder="標籤" size="small" />
                  <el-tag v-else-if="item.tag" size="small" type="primary" effect="plain" round>{{ item.tag }}</el-tag>
                </div>
                <div v-if="isEditingProfile" style="width: 40px; text-align: right;">
                  <el-button type="danger" link :icon="Delete" @click="removeProfileItem(index)" />
                </div>
              </div>
            </transition-group>
            <div v-if="isEditingProfile" style="margin-top: 20px;">
              <el-button type="primary" plain style="width: 100%; border-style: dashed;" :icon="Plus" @click="addProfileItem">新增項目</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row justify="center" :gutter="20">
      <el-col :xs="22" :sm="20" :md="18" :lg="16">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 10px;">
          <div style="display: flex; align-items: center;">
            <el-icon :size="20" color="var(--el-color-primary)" style="margin-right: 8px;"><HomeFilled /></el-icon>
            <el-text type="primary" size="large" tag="b">家庭關係結構</el-text>
          </div>
          <el-button :type="isEditingFamily ? 'success' : 'primary'" :icon="isEditingFamily ? Check : Edit" circle plain @click="toggleFamilyEdit" />
        </div>
        <el-divider border-style="dashed" style="margin: 10px 0 30px 0;" />
        <el-row justify="center" :gutter="20" style="margin-bottom: 20px;">
          <el-col :xs="24" :sm="12" v-for="(member, idx) in familyMembers.parents" :key="idx" style="margin-bottom: 10px;">
            <el-card shadow="hover" style="border-radius: 12px; text-align: center; border-top: 3px solid var(--el-color-primary); position: relative;">
              <el-button v-if="isEditingFamily" type="danger" link :icon="Delete" style="position: absolute; top: 5px; right: 5px;" @click="removeFamilyMember('parents', idx)" />
              <el-avatar :size="64" :icon="iconMap[member.icon]" :style="{ cursor: isEditingFamily ? 'pointer' : 'default', backgroundColor: 'var(--el-color-primary)', marginBottom: '10px' }" @click="toggleIcon(member)" />
              <div v-if="!isEditingFamily">
                <el-text tag="b" size="large" style="display: block;">{{ member.name }} <el-tag size="small" round>{{ member.age }}歲</el-tag></el-text>
                <el-text type="primary" size="small" style="margin-top: 4px; display: block;">{{ member.relation }}</el-text>
                <div style="margin-top: 12px;">
                  <el-tag type="info" effect="plain" style="margin-right: 5px;">{{ member.job }}</el-tag>
                  <el-tag type="primary" effect="light">{{ member.status }}</el-tag>
                </div>
              </div>
              <div v-else style="display: flex; flex-direction: column; gap: 8px;">
                <el-input v-model="member.name" placeholder="姓名" size="small"><template #prepend>姓名</template></el-input>
                <el-input v-model="member.relation" placeholder="關係" size="small"><template #prepend>關係</template></el-input>
                <el-input-number v-model="member.age" size="small" style="width: 100%;" :min="0" controls-position="right" placeholder="年齡" />
                <el-input v-model="member.job" placeholder="職業" size="small"><template #prepend>職業</template></el-input>
                <el-input v-model="member.status" placeholder="狀態" size="small"><template #prepend>狀態</template></el-input>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" v-if="isEditingFamily" style="margin-bottom: 10px;">
            <el-button type="primary" plain style="width: 100%; height: 100%; min-height: 200px; border-style: dashed;" :icon="Plus" @click="addFamilyMember('parents')">新增核心成員</el-button>
          </el-col>
        </el-row>
        <el-row justify="center" :gutter="20" style="margin-bottom: 20px;">
          <el-col :xs="24" style="margin-bottom: 10px;">
            <el-text type="info" size="small" style="display: block; text-align: center; margin-bottom: 10px;">扶養與照護責任</el-text>
          </el-col>
          <el-col :xs="12" :sm="8" v-for="(member, idx) in familyMembers.elders" :key="idx" style="margin-bottom: 10px;">
            <el-card shadow="hover" style="border-radius: 12px; text-align: center; opacity: 0.9; position: relative;">
              <el-button v-if="isEditingFamily" type="danger" link :icon="Delete" style="position: absolute; top: 5px; right: 5px;" @click="removeFamilyMember('elders', idx)" />
              <el-avatar :size="48" :icon="iconMap[member.icon]" :style="{ cursor: isEditingFamily ? 'pointer' : 'default', backgroundColor: 'var(--el-color-primary-light-5)', color: 'var(--el-color-primary)', marginBottom: '8px' }" @click="toggleIcon(member)" />
              <div v-if="!isEditingFamily">
                <el-text tag="b">{{ member.name }}</el-text>
                <div style="margin-top: 6px;"><el-tag size="small" type="info">{{ member.age }}歲</el-tag></div>
                <div style="margin-top: 6px;"><el-text type="info" size="small">{{ member.status }}</el-text></div>
              </div>
              <div v-else style="display: flex; flex-direction: column; gap: 5px;">
                <el-input v-model="member.name" placeholder="姓名" size="small" />
                <el-input v-model="member.relation" placeholder="關係" size="small" />
                <el-input-number v-model="member.age" size="small" style="width: 100%;" :min="0" controls-position="right" />
                <el-input v-model="member.status" placeholder="狀態" size="small" />
              </div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="8" v-if="isEditingFamily" style="margin-bottom: 10px;">
            <el-button type="primary" plain style="width: 100%; height: 100%; min-height: 160px; border-style: dashed;" :icon="Plus" @click="addFamilyMember('elders')">新增長輩</el-button>
          </el-col>
        </el-row>
        <el-row justify="center" :gutter="20" style="margin-bottom: 40px;">
          <el-col :xs="24" style="margin-bottom: 10px;">
            <el-text type="info" size="small" style="display: block; text-align: center; margin-bottom: 10px;">子女與傳承對象</el-text>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" v-for="(member, idx) in familyMembers.children" :key="idx" style="margin-bottom: 10px;">
            <el-card shadow="hover" style="border-radius: 12px; text-align: center; height: 100%; position: relative;">
              <el-button v-if="isEditingFamily" type="danger" link :icon="Delete" style="position: absolute; top: 5px; right: 5px;" @click="removeFamilyMember('children', idx)" />
              <el-avatar :size="48" :icon="iconMap[member.icon]" :style="{ cursor: isEditingFamily ? 'pointer' : 'default', backgroundColor: '#fff', border: '2px solid var(--el-color-primary)', color: 'var(--el-color-primary)', marginBottom: '8px' }" @click="toggleIcon(member)" />
              <div v-if="!isEditingFamily">
                <el-text tag="b" style="display: block;">{{ member.name }}</el-text>
                <el-text type="info" size="small" style="display: block; margin-bottom: 8px;">{{ member.relation }} ({{ member.age }}歲)</el-text>
                <el-tag size="small" type="primary" effect="plain" style="white-space: normal; height: auto; padding: 4px;">{{ member.status }}</el-tag>
              </div>
              <div v-else style="display: flex; flex-direction: column; gap: 5px;">
                <el-input v-model="member.name" placeholder="姓名" size="small" />
                <el-input v-model="member.relation" placeholder="關係" size="small" />
                <el-input-number v-model="member.age" size="small" style="width: 100%;" :min="0" controls-position="right" />
                <el-input v-model="member.status" placeholder="狀態" size="small" />
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" v-if="isEditingFamily" style="margin-bottom: 10px;">
            <el-button type="primary" plain style="width: 100%; height: 100%; min-height: 180px; border-style: dashed;" :icon="Plus" @click="addFamilyMember('children')">新增子女</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-bottom: 60px;">
      <el-col :xs="22" :sm="10" :md="8" :lg="6">
        <el-button type="primary" size="large" round style="width: 100%; height: 50px; font-weight: bold; font-size: 1.1rem;" @click="nextStep">下一步：理財目標設定 <el-icon class="el-icon--right"><ArrowRight /></el-icon></el-button>
      </el-col>
    </el-row>
  </el-main>
</el-container>