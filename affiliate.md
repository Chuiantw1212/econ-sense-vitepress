---
description: 那些讓EN變得更好的人與社群。
outline: deep
---

# 友站連結

那些讓EN變得更好的人與社群。

## Job Pair

<a href="https://job-pair.com" target="_blank">
    <img src="/affiliate/Top1.webp" alt=job-pair>
</a>

多元職涯時代，你擁有多種可能性，不論是正職、兼職或接案，這裡都能滿足所需。
現在，只要三分鐘就能設計適合自己的工作，讓工作主動上門！

### 團隊成員

<VPTeamMembers size="small" :members="jobPairMembers" />

## 學校學不到的事

<a href="https://reurl.cc/V4qLjn" target="_blank">
    <img src="/affiliate/373705383_7289266461088207_4973358589488189134_n.jpg" alt=notSchool>
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

const lineSvg = `<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 296.528 296.528" xml:space="preserve">
<g>
 <path d="M295.838,115.347l0.003-0.001l-0.092-0.76c-0.001-0.013-0.002-0.023-0.004-0.036c-0.001-0.011-0.002-0.021-0.004-0.032
  l-0.344-2.858c-0.069-0.574-0.148-1.228-0.238-1.974l-0.072-0.594l-0.147,0.018c-3.617-20.571-13.553-40.093-28.942-56.762
  c-15.317-16.589-35.217-29.687-57.548-37.878c-19.133-7.018-39.434-10.577-60.337-10.577c-28.22,0-55.627,6.637-79.257,19.193
  C23.289,47.297-3.585,91.799,0.387,136.461c2.056,23.111,11.11,45.11,26.184,63.621c14.188,17.423,33.381,31.483,55.503,40.66
  c13.602,5.642,27.051,8.301,41.291,11.116l1.667,0.33c3.921,0.776,4.975,1.842,5.247,2.264c0.503,0.784,0.24,2.329,0.038,3.18
  c-0.186,0.785-0.378,1.568-0.57,2.352c-1.529,6.235-3.11,12.683-1.868,19.792c1.428,8.172,6.531,12.859,14.001,12.86
  c0.001,0,0.001,0,0.002,0c8.035,0,17.18-5.39,23.231-8.956l0.808-0.475c14.436-8.478,28.036-18.041,38.271-25.425
  c22.397-16.159,47.783-34.475,66.815-58.17C290.172,175.745,299.2,145.078,295.838,115.347z M92.343,160.561H66.761
  c-3.866,0-7-3.134-7-7V99.865c0-3.866,3.134-7,7-7c3.866,0,7,3.134,7,7v46.696h18.581c3.866,0,7,3.134,7,7
  C99.343,157.427,96.209,160.561,92.343,160.561z M119.03,153.371c0,3.866-3.134,7-7,7c-3.866,0-7-3.134-7-7V99.675
  c0-3.866,3.134-7,7-7c3.866,0,7,3.134,7,7V153.371z M182.304,153.371c0,3.033-1.953,5.721-4.838,6.658
  c-0.712,0.231-1.441,0.343-2.161,0.343c-2.199,0-4.323-1.039-5.666-2.888l-25.207-34.717v30.605c0,3.866-3.134,7-7,7
  c-3.866,0-7-3.134-7-7v-52.16c0-3.033,1.953-5.721,4.838-6.658c2.886-0.936,6.045,0.09,7.827,2.545l25.207,34.717V99.675
  c0-3.866,3.134-7,7-7c3.866,0,7,3.134,7,7V153.371z M233.311,159.269h-34.645c-3.866,0-7-3.134-7-7v-26.847V98.573
  c0-3.866,3.134-7,7-7h33.57c3.866,0,7,3.134,7,7s-3.134,7-7,7h-26.57v12.849h21.562c3.866,0,7,3.134,7,7c0,3.866-3.134,7-7,7
  h-21.562v12.847h27.645c3.866,0,7,3.134,7,7S237.177,159.269,233.311,159.269z"/>
</g>
</svg>`

const patreonMembers = [
  {
    avatar: `/affiliate/logo.png`,
    name: '名稱',
    title: '職稱',
    desc: '個人化描述',
    org: '組織與組織連結',
    orgLink: 'https://patreon.com/user?u=113925482&utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link',
    links: [
      { icon: { svg: lineSvg }, link: 'https://line.me/ti/g2/w2xjp79QxMO76vVw_aQuEqeH2ahdcn7uY7lQAg'},
      { icon: 'instagram', link: 'https://www.instagram.com/econ.sense/' },
      { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100069740545113' },
      { icon: 'github', link: 'https://github.com/Chuiantw1212' },
    ]
  },
]

const jobPairMembers = [
  {
    avatar: `/affiliate/sandy.jpg`,
    name: 'Sandy',
    title: 'CEO',
    desc: 'Live like you mean it！',
    links: [
      { icon: 'facebook', link: 'https://www.facebook.com/sandyylchiu/' },
    ]
  },
  {
    avatar: `/affiliate/1700901417115.jpg`,
    name: '朱奕安',
    title: '全端工程師',
    desc: '我禿了，也變強了',
    links: [
      { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100069740545113' },
      { icon: 'github', link: 'https://github.com/Chuiantw1212' },
    ]
  },
  {
    avatar: `/affiliate/jun.png`,
    name: '陸盈君',
    desc: '如果沒有夢想，那跟叉燒有什麼區別',
    title: 'UIUX Designer',
  },
]

const socialSchoolMembers = [
  {
    avatar: `/affiliate/point38.jpeg`,
    name: '.38陳宇凱',
    title: '創辦人、房地產講師',
    org: '學校學不到的事',
    orgLink: 'https://reurl.cc/V4qLjn',
    links: [
      {
        icon: { svg: lineSvg }, link: "https://reurl.cc/V4qLjn",
      },
      { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100000116381657' },
    ]
  },
  {
    avatar: `/affiliate/minYoung.jpg`,
    name: '茗羕教練',
    title: '健身教練.講師',
    desc:'用聽的懂健康,用大腦練肌肉!',
    links: [
      { icon: { svg: lineSvg }, link: 'https://reurl.cc/L6kyVx'},
      { icon: 'facebook', link: 'https://www.facebook.com/SC.SportConsultant' },
    ]
  },
   {
    avatar: `/affiliate/1700901417115.jpg`,
    name: '朱奕安',
    title: '不專業講師',
    desc: '我禿了，也變強了',
    links: [
      { icon: 'facebook', link: 'https://www.facebook.com/profile.php?id=100069740545113' },
      { icon: 'github', link: 'https://github.com/Chuiantw1212' },
    ]
  },
]

// You've been invited to join "常識經濟學". Visit the link below to join the OpenChat. https://line.me/ti/g2/w2xjp79QxMO76vVw_aQuEqeH2ahdcn7uY7lQAg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default
</script>
