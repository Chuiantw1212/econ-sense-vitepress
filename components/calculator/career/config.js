export const laborInsuranceLevels = [
    27470, 27600, 28800,
    30300, 31800, 33300, 34800, 36300, 38200,
    40100, 42000, 43900, 45800
]
export const onlyLaborInsurance = [
    1500, 3000, 4500, 6000, 7500, 8700, 9900, 11100, 12540, 13500, 15840, 16500, 17280, 17880, 19047,
    20008, 21009, 22000, 23100, 24000, 25250, 26400,
]
export const laborAndHealthInsurance = [
    27470, 27600, 28800,
    30300, 31800, 33300, 34800, 36300, 38200,
    40100, 42000, 43900, 45800, 48200,
    50600, 53000, 55400, 57800,
    60800, 63800, 66800, 69800,
    72800, 76500,
    80200, 83900, 87600,
    92100, 96600,
    10110, 105600, 110100, 115500,
    120900, 126300, 131700, 137100, 142500, 147900, 150000,
]
export const onlyHealthInsurance = [
    156400, 162800, 169200,
    175600, 182000, 189500,
    197000, 204500, 212000,
    219500,
]
// 企業主投保級距規範
export const entrepreneurHealthInsuranceLevel = {
    0: 6, // 33300
    1: 6, // 33300
    2: 6, // 33300
    3: 6, // 33300
    4: 8, // 36300
    5: 13, // 45800
}
/**
 * https://www.dgpa.gov.tw/uploads/dgpa/files/202201/9e2c483a-65dd-4669-9a91-251e114dec33.pdf
 */
export const pointOfPayOptions = []
for (let i = 160; i <= 370; i += 10) {
    pointOfPayOptions.push({
        label: i,
        value: i
    })
}
for (let i = 385; i <= 550; i += 15) {
    pointOfPayOptions.push({
        label: i,
        value: i
    })
}
for (let i = 590; i <= 750; i += 20) {
    pointOfPayOptions.push({
        label: i,
        value: i
    })
}
pointOfPayOptions.push(
    {
        label: 780,
        value: 780,
    },
    {
        label: 790,
        value: 790,
    },
    {
        label: 800,
        value: 800,
    }
)
pointOfPayOptions.reverse()
/**
 * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0040001&flno=7
 * 甲等︰晉本俸一級，並給與一個月俸給總額之一次獎金；
 * 已達所敘職等本俸最高俸級或已敘年功俸級者，晉年功俸一級，並給與一個月俸給總額之一次獎金；
 * 已敘年功俸最高俸級者，給與二個月俸給總額之一次獎金。
 * https://www.dgpa.gov.tw/informationlist?uid=15&cid=53
 * 各等級俸點折算俸額之數額係分段累計：
 * 按其應得俸點在160點以下之部分每俸點按81.1元折算；
 * 161點至220點之部分每俸點按52.5元折算；
 * 221點至790點之部分每俸點按74.3元折算；
 * 791點以上之部分每俸點按318.1元折算。 如有不足10元之畸零數均以10元計。
 */
export const payOptions = pointOfPayOptions.map(payPointOption => {
    let payPoint = payPointOption.value
    // 除以10計算零點用
    const below160pay = 81.1 / 10
    const from160to220pay = 52.5 / 10
    const from220to790pay = 74.3 / 10
    const above790pay = 318.1 / 10
    let pay = 0
    if (payPoint <= 160) {
        pay += payPoint * below160pay
        return {
            label: payPointOption.value,
            value: Math.ceil(pay) * 10
        }
    }
    if (payPoint <= 220) {
        pay += 160 * below160pay
        payPoint -= 160
        pay += payPoint * from160to220pay
        return {
            label: payPointOption.value,
            value: Math.ceil(pay) * 10
        }
    }
    if (payPoint <= 790) {
        pay += 160 * below160pay
        payPoint -= 160
        pay += (220 - 160) * from160to220pay
        payPoint -= (220 - 160)
        pay += payPoint * from220to790pay
        return {
            label: payPointOption.value,
            value: Math.ceil(pay) * 10
        }
    }
    if (payPoint > 790) {
        pay += 160 * below160pay
        payPoint -= 160
        pay += (220 - 160) * from160to220pay
        payPoint -= (220 - 160)
        pay += (790 - 220) * from220to790pay
        payPoint -= (790 - 220)
        pay += payPoint * above790pay
        return {
            label: payPointOption.value,
            value: Math.ceil(pay) * 10
        }
    }
})