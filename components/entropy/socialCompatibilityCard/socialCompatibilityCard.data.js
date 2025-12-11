const compatibilityData = {
    // 1. Hunter (獵人 IRH)
    Hunter: {
        ally: { name: '助人者 (Helper)', reason: '你需要後勤補給，他是你最堅實的盾牌。' },
        soulmate: { name: '先驅 (Pioneer)', reason: '都想贏、都想衝。你們是能一起打天下的戰友。' },
        nemesis: { name: '薩滿 (Shaman)', reason: '你講數據結果，他講靈性氛圍。你覺得他神棍，他覺得你俗氣。' },
        // Alien: Hunter (商場) vs Elder (公園/書房)
        alien: { name: '長老 (Elder)', reason: '你在商場衝刺業績，他在公園打太極或書房讀歷史。生活步調差了三倍，基本上碰不到面。' }
    },
    // 2. Pioneer (先驅 IVH) -- 【修正此處】
    Pioneer: {
        ally: { name: '工匠 (Toolmaker)', reason: '你有瘋狂點子，他有精湛手藝。沒有他，你的夢想只是空談。' },
        soulmate: { name: '薩滿 (Shaman)', reason: '都活在未來。你們的對話充滿了只有彼此聽得懂的電波。' },
        nemesis: { name: '哨兵 (Sentry)', reason: '你想打破規則，他想守護規則。你們是天生的冤家。' },
        // Alien: Pioneer (數位遊牧) vs Helper (定點打卡)
        alien: { name: '助人者 (Helper)', reason: '你在不同城市的共享空間遊牧，他在固定的辦公室朝九晚五。你的座標每週在變，他的座標十年如一日。' }
    },
    // 3. Gatherer (採集者 ORH)
    Gatherer: {
        ally: { name: '獵人 (Hunter)', reason: '你匯聚人脈，他攻城掠地。商業上的黃金搭檔。' },
        soulmate: { name: '助人者 (Helper)', reason: '在一起就是溫暖的同溫層，永遠有聊不完的八卦與關心。' },
        nemesis: { name: '工匠 (Toolmaker)', reason: '你講人情世故，他只看邏輯數據。你的熱臉會貼到他的冷屁股。' },
        // Alien: Gatherer (派對) vs Sentry (獨處)
        alien: { name: '哨兵 (Sentry)', reason: '你喜歡熱鬧的聚會，他喜歡安靜的獨處。當你走進房間時，他通常剛好離開。' }
    },
    // 4. Shaman (薩滿 OVH)
    Shaman: {
        ally: { name: '長老 (Elder)', reason: '你接收天訊，他查閱史書。合在一起就是完整的智慧。' },
        soulmate: { name: '先驅 (Pioneer)', reason: '靈魂共振！你們都能看見別人看不見的空氣。' },
        nemesis: { name: '哨兵 (Sentry)', reason: '你的情緒流動被他的高牆擋住，會讓你覺得窒息。' },
        // Alien: Shaman (靈界) vs Toolmaker (工廠)
        alien: { name: '工匠 (Toolmaker)', reason: '你混身心靈圈，他混工程師圈。討論的話題從未重疊，連吃飯都不會選同一家餐廳。' }
    },
    // 5. Toolmaker (工匠 IRC)
    Toolmaker: {
        ally: { name: '先驅 (Pioneer)', reason: '他給你方向，你給他路徑。互相利用（稱讚意味）。' },
        soulmate: { name: '哨兵 (Sentry)', reason: '都愛秩序與安靜。你們可以坐在一起三小時不講話，覺得很舒服。' },
        nemesis: { name: '採集者 (Gatherer)', reason: '他太情緒化且沒邏輯，對你來說是最大的雜訊來源。' },
        // Alien: Toolmaker (解Bug) vs Shaman (解夢)
        alien: { name: '薩滿 (Shaman)', reason: '你在實驗室解 Bug，他在冥想室解夢。各自安好，互不打擾是最好的距離。' }
    },
    // 6. Sentry (哨兵 IVC)
    Sentry: {
        ally: { name: '獵人 (Hunter)', reason: '前線與後防的完美搭配。他在外面衝，你在家裡守。' },
        soulmate: { name: '工匠 (Toolmaker)', reason: '精準、克制、SOP。你們是彼此的舒適圈。' },
        nemesis: { name: '先驅 (Pioneer)', reason: '他是你最大的壓力源。你剛補好洞，他又戳出三個新的。' },
        // Alien: Sentry (鎖門) vs Gatherer (敲門)
        alien: { name: '採集者 (Gatherer)', reason: '他喜歡揪團，你喜歡隱形。為了避免被他拉去社交，你會物理性地避開他出現的路徑。' }
    },
    // 7. Helper (助人者 ORC)
    Helper: {
        ally: { name: '獵人 (Hunter)', reason: '傳統的互補。他給你保護，你給他溫暖。' },
        soulmate: { name: '採集者 (Gatherer)', reason: '群體中最受歡迎的組合，總是能照顧到所有人的需求。' },
        nemesis: { name: '薩滿 (Shaman)', reason: '他情緒起伏太大，常讓你這個務實的照顧者感到心累。' },
        // Alien: Helper (穩健) vs Pioneer (冒險)
        alien: { name: '先驅 (Pioneer)', reason: '他的生活充滿了搬家、轉職與冒險，你的生活充滿了穩定與規律。完全是兩條平行線。' }
    },
    // 8. Elder (長老 OVC)
    Elder: {
        ally: { name: '薩滿 (Shaman)', reason: '你關注深層意義，他提供直覺視角。很有深度的組合。' },
        soulmate: { name: '哨兵 (Sentry)', reason: '都喜歡深思熟慮。可以一起喝茶下棋，談論世界局勢。' },
        nemesis: { name: '先驅 (Pioneer)', reason: '你覺得他魯莽冒進，破壞傳統；他覺得你食古不化。' },
        // Alien: Elder (慢活) vs Hunter (快活)
        alien: { name: '獵人 (Hunter)', reason: '他講求效率與變現，你講求底蘊與沈澱。因為時間感不同，自然會過濾掉彼此。' }
    }
};

export default {
    load() {
        return compatibilityData
    }
}