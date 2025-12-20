// keyDimensionCard.data.js
const data = {
    // Z軸：能量策略
    z: {
        id: 'z',
        name: '能量策略',
        metaphor: '生存底層',
        // H: Hot
        pos: {
            label: 'H 熱動型', // 簡化標籤
            color: '#F56C6C',
            icon: '🔥',
            manual: {
                chemical: '低多巴胺',
                // 改為一句話
                summary: '大腦處於待機模式，需要「混亂與風險」才能喚醒。',
                tags: ['COMT快代謝', '模擬退火', '刺激尋求'],
                dos: [
                    '戰場：變動高、從0到1',
                    '燃料：風險、混亂、死線',
                    '心態：寧可做錯，不可錯過'
                ],
                donts: [
                    '穩定的行政/文書工作',
                    '缺乏變化的例行公事',
                    '過度壓抑衝動'
                ]
            }
        },
        // C: Cold
        neg: {
            label: 'C 冷控型',
            color: '#409EFF',
            icon: '🧊',
            manual: {
                chemical: '高多巴胺',
                summary: '大腦隨時預熱，需要「秩序與穩定」避免過載。',
                tags: ['COMT慢代謝', '梯度下降', '風險趨避'],
                dos: [
                    '戰場：可控高、從1到100',
                    '燃料：規律、SOP、儀式感',
                    '心態：寧可錯過，不可做錯'
                ],
                donts: [
                    '充滿噪音與打斷的環境',
                    '缺乏邏輯的隨機決策',
                    '同時多工處理 (Multitasking)'
                ]
            }
        }
    },

    // Y軸：資訊來源
    y: {
        id: 'y',
        name: '資訊來源',
        metaphor: '作業系統',
        // R: Real
        pos: {
            label: 'R 現證型',
            color: '#67C23A',
            icon: '🌲',
            manual: {
                chemical: '任務網路 TPN',
                summary: '相信眼見為憑，像「判別式AI」一樣精準識別當下。',
                tags: ['數據驅動', '活在當下', '執行力'],
                dos: [
                    '看見具體成果 (程式/訂單)',
                    '實地考察、看數據說話',
                    '解決「現在」的問題'
                ],
                donts: [
                    '純理論的抽象空談',
                    '缺乏指標的模糊任務',
                    '只畫大餅不給落地方案'
                ]
            }
        },
        // V: Virtual
        neg: {
            label: 'V 內觀型',
            color: '#A333FF',
            icon: '🔮',
            manual: {
                chemical: '預設網路 DMN',
                summary: '相信內在邏輯，像「生成式AI」一樣模擬未來。',
                tags: ['模型驅動', '心理模擬', '戰略家'],
                dos: [
                    '販賣願景、策略或故事',
                    '宏觀佈局、預測趨勢',
                    '思考「為什麼」與「未來」'
                ],
                donts: [
                    '瑣碎重複的執行細節',
                    '被禁止思考背後邏輯',
                    '完全照SOP無創新空間'
                ]
            }
        }
    },

    // X軸：決策焦點
    x: {
        id: 'x',
        name: '決策焦點',
        metaphor: '使用者介面',
        // I: Individual
        pos: {
            label: 'I 個體型',
            color: '#E6A23C',
            icon: '🦁',
            manual: {
                chemical: '睪固酮',
                summary: '隧道視野：世界是「個人競爭與掌控」的戰場。',
                tags: ['任務導向', '主體性', '分離策略'],
                dos: [
                    '追求掌控感與個人成就',
                    '透過「贏過別人」確認價值',
                    '獨立解決問題'
                ],
                donts: [
                    '為人情世故犧牲目標',
                    '齊頭式平等的爛好人團隊',
                    '被剝奪獨立決策權'
                ]
            }
        },
        // O: Other
        neg: {
            label: 'O 他人型',
            color: '#F5319D',
            icon: '🤝',
            manual: {
                chemical: '催產素',
                summary: '廣角視野：世界是「人際連結與共生」的網絡。',
                tags: ['關係導向', '連結性', '融合策略'],
                dos: [
                    '維護連結與群體和諧',
                    '透過「融入貢獻」確認價值',
                    '擔任溝通與療癒者'
                ],
                donts: [
                    '為求勝切斷所有關係',
                    '孤立無援的惡性競爭',
                    '把人當作純粹工具'
                ]
            }
        }
    }
};
export default {
    load() {
        return data
    }
}