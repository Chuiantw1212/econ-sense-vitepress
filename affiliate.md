---
outline: deep
---
# 友站連結

## Job Pair

<a href="https://job-pair.com" target="_blank">
    <img src="/affiliate/Top1.webp">
</a>

多元職涯時代，你擁有多種可能性，不論是正職、兼職或接案，這裡都能滿足所需。
現在，只要三分鐘就能設計適合自己的工作，讓工作主動上門！

### 團隊成員

<VPTeamMembers size="small" :members="jobPairMembers" />

## 學校學不到的事

<a href="https://www.facebook.com/groups/304681766894402" target="_blank">
    <img src="/affiliate/373705383_7289266461088207_4973358589488189134_n.jpg">
</a>

此社團為知識分享平台，讓更多人能夠學習接觸不同的知識，有機會找到適合自己的人生方向。

### 講師名單

<VPTeamMembers size="small" :members="socialSchoolMembers" />

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const jobPairMembers = [
  {
    avatar: `/about/sandy.jpg`,
    name: 'Sandy',
    title: 'CEO',
    desc:'Live like you mean it！',
    links: [
      { icon: 'facebook', link: 'https://www.facebook.com/sandyylchiu/' },
    ]
  },
  {
    avatar: `/about/chu.png`,
    name: '朱奕安',
    title: '全端工程師',
    desc: '我禿了，也變強了',
    links: [
      { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100069740545113' },
        { icon: 'github', link: 'https://github.com/Chuiantw1212' },
    ]
  },
  {
    avatar: `/about/jun.png`,
    name: '陸盈君',
    desc: '如果沒有夢想，那跟叉燒有什麼區別',
    title: 'UIUX Designer',
  },
]

const socialSchoolMembers = [
  {
    avatar: `/about/point38.jpeg`,
    name: '.38陳宇凱',
    title: '創辦人、房地產講師',
    links: [
      { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100000116381657' },
    ]
  },
   {
    avatar: `/about/chu.png`,
    name: '朱奕安',
    title: '理財講師',
    links: [
      { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100069740545113' },
        { icon: 'github', link: 'https://github.com/Chuiantw1212' },
    ]
  },
//   {
//     avatar: `/about/lineDong.jpeg`,
//     name: '賴董',
//     desc:'對Line有點懂',
//     links: [
//       { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100000116381657' },
//     ]
//   },
]
</script>
