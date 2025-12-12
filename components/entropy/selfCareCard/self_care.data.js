const selfCareData = {
    "Hunter": {
        "type": "IRH (Individual-Real-Hot)",
        "energyType": "熾熱的火焰 (Blazing Fire)",
        "burnoutSign": "【餘燼感的空虛】這不是普通的累，而是一種「火燒完了」的灰燼感。你對世界感到莫名的憤怒與無聊，曾經讓你興奮的挑戰，現在只剩下煩躁。",
        "protocol": "【與身體和解 (Body Flow)】不要強迫自己靜坐，那對你來說是酷刑。去奔跑、去攀岩、去感受肌肉的酸痛與心跳的律動。讓身體的動能，溫柔地代謝掉心靈的焦躁。",
        "affirmation": "暫時收起弓箭，是為了讓靈魂跟上你的腳步。"
    },
    "Pioneer": {
        "type": "IVH (Individual-Virtual-Hot)",
        "energyType": "閃爍的星光 (Starlight)",
        "burnoutSign": "【漂浮的解離感】你的靈魂飛得太高太遠，導致身體像是一個沈重的負擔。你忘記了吃飯、忘記了睡覺，覺得現實世界充滿了粗糙的顆粒感，讓人想逃離。",
        "protocol": "【溫柔的接地 (Gentle Earthing)】請回到地球表面。赤腳踩在草地上，用手掌感受溫熱的馬克杯，聞一聞剛出爐的麵包香。透過這些微小而具體的感官，把飄散的靈魂輕輕拉回來。",
        "affirmation": "你的願景很美，但請記得照顧那個承載夢想的身體。"
    },
    "Gatherer": {
        "type": "ORH (Other-Real-Hot)",
        "energyType": "溫暖的陽光 (Sunshine)",
        "burnoutSign": "【光芒的黯淡】你是大家的開心果，但此刻卻覺得內心枯竭。雖然臉上還掛著微笑，但每一個眼神接觸都讓你感到能量在流失，只想躲進沒有人的洞穴。",
        "protocol": "【回歸自然 (Return to Nature)】去沒有「人」的地方。去看海浪的起伏、聽樹葉的沙沙聲。大自然不會向你索取情緒價值，它只會無條件地接納你、充電你。",
        "affirmation": "你不需要一直照亮別人，偶爾做回被月光擁抱的孩子也很好。"
    },
    "Shaman": {
        "type": "OVH (Other-Virtual-Hot)",
        "energyType": "深邃的海洋 (Deep Ocean)",
        "burnoutSign": "【情緒的洪災】你承載了太多人的眼淚與故事，分不清楚哪些悲傷是自己的，哪些是別人的。感覺胸口悶悶的，像是吸飽了水的海綿，沈重得無法呼吸。",
        "protocol": "【靈魂的沐浴 (Soul Cleansing)】你需要一場儀式來劃清界線。點燃香氛，或是泡一個加了海鹽的熱水澡。隨著水流的排空，想像那些不屬於你的重擔也隨之流逝，只留下乾淨透明的自己。",
        "affirmation": "你的慈悲很珍貴，請先留一份溫柔給自己。"
    },
    "Toolmaker": {
        "type": "IRC (Individual-Real-Cold)",
        "energyType": "精緻的晶體 (Crystal)",
        "burnoutSign": "【緊繃的發條】你對「失控」感到深深的恐懼，連一點小瑕疵都讓你焦慮不已。肩膀聳得高高的，牙關咬得緊緊的，你已經很久沒有真正「鬆」下來了。",
        "protocol": "【手作的溫度 (Handmade Warmth)】暫時離開精確的數據吧。去揉捏陶土、去照顧植物。允許那些不完美的裂痕存在，感受生命有機的律動。告訴自己，不完美也是一種美。",
        "affirmation": "你不需要是一台完美的機器，你是有血有肉、值得被愛的生命。"
    },
    "Sentry": {
        "type": "IVC (Individual-Virtual-Cold)",
        "energyType": "堅固的磐石 (Rock)",
        "burnoutSign": "【無止盡的災難片】你的大腦像是一個關不掉的警報器，不斷播放著未來的災難預演。長期處於這種「預備防禦」的狀態，讓你的神經系統像是拉緊的橡皮筋，隨時可能斷裂。",
        "protocol": "【柔軟的巢穴 (Soft Nest)】停止攝取資訊，世界不會因為你休息一晚就崩塌。打造一個充滿毯子、熱飲與柔和燈光的角落。像安撫受驚的小動物一樣，告訴自己：「此刻，我在這裡很安全。」",
        "affirmation": "卸下盔甲休息一會兒吧，你已經守護得很好了。"
    },
    "Helper": {
        "type": "ORC (Other-Real-Cold)",
        "energyType": "滋養的大地 (Soil)",
        "burnoutSign": "【無聲的委屈】你照顧了所有人，卻發現沒有人來照顧你。這種失衡讓你開始感到隱隱的憤怒與酸楚，覺得自己的付出被視為理所當然，內心充滿了被掏空的感覺。",
        "protocol": "【自我的滋養 (Nourish Yourself)】親愛的，請把那份照顧人的溫柔，轉向你自己。為自己做一頓豐盛的早餐，買一束花給自己。練習對他人的請求說「稍等」，對自己的需求說「現在」。",
        "affirmation": "你是花園裡的土壤，只有你肥沃了，花朵才能盛開。"
    },
    "Elder": {
        "type": "OVC (Other-Virtual-Cold)",
        "energyType": "古老的大樹 (Ancient Tree)",
        "burnoutSign": "【沈默的重擔】你習慣成為他人的支柱，但現在這份責任感壓得你喘不過氣。你感到一種深沈的、說不出口的疲憊，甚至開始懷疑這一切堅持的意義。",
        "protocol": "【智慧的對話 (Dialogue with Wisdom)】不要一個人扛。去閱讀經典，或是走進博物館，與歷史長河對話。你會發現你不是孤獨的守護者，你只是偉大傳承中的一環。允許自己在浩瀚的智慧面前，暫時卸下重擔。",
        "affirmation": "承認疲憊不是軟弱，而是為了能走更長遠的路。"
    }
}

export default {
    load() {
        return selfCareData
    }
}