---
outline: [2,3]
title: 獵人 Hunter (IRH)：爆發的實戰家
description: 「你是天生的戰略家，還是衝動的賭徒？深入解析熵腦 (Entropy Brain)『獵人 Hunter (IRH)』的大腦原廠設定。專為創業家與交易員設計：破解『過度自信』盲區，掌握『冷靜緩衝區』策略，將你的狩獵本能轉化為現代金融市場的絕對優勢。」
---
# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 職業與生態位
<OriginCard></OriginCard>

## 三軸動力爐
<EngineCard></EngineCard>

## 演化人類學
<AnthropologyCard></AnthropologyCard>

## 認知盲區
<TrapCard></TrapCard>

## 實戰演練
理論看完了，現在來測試你的 **獵人本能** 是否能被控制。
<InteractionCard/>

## 生存攻略
如果你剛才忍不住按下了按鈕，這張卡片能救你的命。
<StrategyCard></StrategyCard>

<script setup>
import OriginCard from '../components/entropyRoles/hunter/originCard.vue'
import EngineCard from '../components/entropyRoles/hunter/engineCard.vue'
import InteractionCard from '../components/entropyRoles/hunter/interactionCard.vue'
import AnthropologyCard from '../components/entropyRoles/hunter/anthropologyCard.vue'
import TrapCard from '../components/entropyRoles/hunter/trapCard.vue'
import StrategyCard from '../components/entropyRoles/hunter/strategyCard.vue'
</script>