---
outline: deep
---

# 打造知識飛輪

探索如何打造知識飛輪，深入設定目標、學習、輸出、優化的主題。這份分享特別適合想建立自己知識體系的人，包括學生和專家，同時也歡迎那些渴望有效學習各方面知識、對講師內容創作充滿好奇心的人。透過深入了解知識飛輪的四個關鍵步驟，我們將帶您探索如何高效學習、組織知識並持續產出有價值的內容。讓我們一同啟動知識飛輪，打造屬於您自己的學習與創造循環。

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTwofNVqf7C2KJJizV6MZumAq8whf2t2AFlRv31d5LmrW0m-1o9U8AANfas45L0sWxZMhKMMIajgiRT/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRAMDpIOyh9dkYnqfsxI8sIlgDRH7fDNRqloJkAlD9sF9CDMcP7ajRBVXAZmru8KaBf8Vs8fCFDSHFw/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

<!-- ## 目標管理模板

<iframe src="https://docs.google.com/document/d/e/2PACX-1vRmK0OWte4elKv_YbtZ9Fxe6l7BaO4iLdUVk13PHULaJjFAX3b8pR8mNLCVbkblvmwuTP5qHXftVmwB/pub?embedded=true" width="100%" height="420"></iframe> -->

## 延伸閱讀

<Books :modelValue="bookGroup"></Books>

<script setup>

import Books from '../components/books.vue'
const bookGroup = [
    {
        id: '11100955350',
        name: '費曼學習法：不管學什麼都能成功的技巧與心法',
        desc: `<p><ol>
<li>從被動接受到主動學習</li>
<li>從快速理解到深刻記憶</li>
<li>從知識輸入到思考輸出</li></ol>
費曼學習法的核心精神，就是透過「教學」與「分享」加速「深度理解」的過程。這個方法重新定義了學習的本質，讓學習不再是枯燥的書寫和記憶，而是和講故事一樣簡單！
能把高深知識用淺顯易懂的話講給別人聽，才算學得透徹。
能夠流暢地將學到的內容自己再重述一次，才算學得完整。
</p>
`,
    },
    {
        id: '11101002715',
        name: '打造第二大腦：多一個數位大腦，資訊超載時代的高效能知識管理術',
        desc: `<p>矽谷強推的知識管理課終於成書！
教你最夯的「第二大腦」建構法
資訊超載時代，每天訊息收不完，大腦不夠用？</p>

<p>「第二大腦」幫你秒速思考、輕鬆歸納、高效輸出！
 ★他曾因大病腦傷，卻自創更強「第二大腦」——
數位知識管理一哥的高生產力秘訣大公開！
</p>
`,
    },
    {
        id: '11100864103',
        name: '學生為什麼不喜歡上學？認知心理學家解開大腦學習的運作結構，原來大腦喜歡這樣學',
        desc: `<p>大部分教師都會感到困惑，學生為什麼對課堂上的知識學習興趣缺缺，卻熱中於打電玩、滑手機，對偶像劇的劇情記得一清二楚？本書作者是美國知名認知心理學家，專攻學習和記憶，為了解開這些迷題，他透過認知心理學的研究和實驗，試著揭開人類大腦是如何習得知識和儲存記憶，以及對什麼知識有學習的偏好。</p>
`,
    },
]
</script>
