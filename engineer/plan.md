---
outline: deep
---

# 開源理財計算機

1. 台灣唯一開源的財務規劃計算機。一切數字有憑有據，不賣商品賣事實。
2. 工程師可藉由開源的前後端程式碼學習Javascript (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-fastify-typescript" target="_blank">後端開源</a>)。
3. 民眾可以快速建立生涯財務觀念，並提共回饋意見。

<el-dialog v-model="dialogVisible" title="登入" :fullscreen="isFullScreen">
    登入按鈕邀請您進入我們的服務。註冊後，您可以方便地使用我們的平台，因為您的資料將被儲存，包括您的電子郵件地址以及填寫的表單內容。這樣做是為了讓您下次登入時不必重新輸入表單資料，提供更流暢的使用體驗。我們尊重您的隱私，您的資料將受到保護並嚴格保密。
    <div v-if="!user.uid" id="firebaseui-auth-container"></div>
</el-dialog>

## 1. 基本資料

<el-card>
    <template #header>
      <div class="card-header card-header--custom">
        <span>基本資料</span>
        <el-button v-if="!user.uid" @click="openSignInDialog()">登入</el-button>
        <el-button v-else @click="signOut()">登出</el-button>
      </div>
    </template>
    <el-form ref="ruleFormRef" :model="profile" :rules="profileRules" label-width="auto">
        <el-row>
            <el-col v-if="user.photoURL" :span="12">
                <el-form-item :label="user.displayName">
                    <el-avatar :src="user.photoURL"></el-avatar>
                </el-form-item>
            </el-col>
            <el-col v-if="user.email" :span="12">
                <el-form-item label="註冊信箱">
                    <el-text>{{ user.email }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="出生日期" prop="dateOfBirth">
                    <el-date-picker
                        v-model="profile.dateOfBirth"
                        type="date"
                        placeholder="選擇出生日期"
                        @change="handleDateOfBirthChanged()"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="性別" prop="gender">
                    <el-select v-model="profile.gender" placeholder="請選擇" @change="handleGenderChanged()">
                        <el-option v-for="item in genders":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="試算年齡" prop="lifeExpectancy" @change="onAgeChaged()">
                    <el-input-number v-model="profile.age" :min="0" :max="120" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估餘命" prop="lifeExpectancy">
                    <el-input-number v-model="profile.lifeExpectancy" :min="0" :max="120" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <ul>
                    <li>
                        預期餘命：<a href="https://data.gov.tw/dataset/39493" target="_blank">預期壽命推估</a>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>

## 2. 需求試算
<!-- <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
>
    全選
</el-checkbox>
<el-checkbox-group v-model="checkedNeeds" @change="handleCheckedNeedsChange">
    <el-checkbox v-for="need in needs" :key="need" :value="need">
      {{ needLabelMap[need] }}
    </el-checkbox>
</el-checkbox-group> -->
<h3 v-if="checkedNeeds.includes('career')" id="_職業試算" tabindex="-1">職業試算</h3>
<el-card v-if="checkedNeeds.includes('career')">
    <el-form label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="本薪">
                    <el-input-number v-model="career.monthlySalary" :min="0"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="伙食費">
                    <el-input-number v-model="career.foodExpense" :min="0" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="月提繳工資">
                    <el-input-number v-model="career.monthylyContributionWages" :min="0" @change="onWageChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="勞退自提率(%)">
                    <el-input-number v-model="career.employeeContrubutionRate" @change="onRateChanged()" :min="0" :max="6"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="勞退月提繳">
                    <el-input-number v-model="career.monthylyContributionTotal" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="月實領">
                    <el-input-number v-model="career.monthlyEAT" :min="0" @change="onMonthlyEATChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="月支出">
                    <el-input-number v-model="career.monthlyExpense" :min="0" @change="onMonthlyExpenseChanged()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="月實領 - 月支出">
                    <el-input-number v-model="investment.monthlyAveraging" :min="0" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <ul>
                    <li>
                        月提繳查詢：<a href="https://www.bli.gov.tw/0013083.html" target="_blank">勞動部勞工保險局</a>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>
<br v-if="checkedNeeds.includes('retirement')"/>
<h3 v-if="checkedNeeds.includes('retirement')" id="_退休試算" tabindex="-1">退休試算</h3>
<el-card v-if="checkedNeeds.includes('retirement')">
    <el-form label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="預估退休年齡" prop="lifeExpectancy">
                    <el-input-number v-model="retirement.age" :min="60" :max="70" @change="onRetireAgeChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估退休餘命" prop="retireLife">
                    <el-input-number v-model="retirement.lifeExpectancy" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="勞保投保年資">
                    <el-input-number v-model="retirement.currentSeniority" :min="0" @change="oncurrentSeniorityChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估退休年資">
                    <el-input-number v-model="retirement.futureSeniority" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="顧主提繳累計">
                    <el-input-number v-model="retirement.employerContribution" :min="0"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="個人提繳累計">
                    <el-input-number v-model="retirement.employeeContrubution" :min="0"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="顧主提繳收益">
                    <el-input-number v-model="retirement.employerContributionIncome" :min="0"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="個人提繳收益">
                    <el-input-number v-model="retirement.employeeContrubutionIncome" :min="0"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="退休五等分位">
                    <el-radio-group v-model="retirement.level" @change="onRetirementLevelChanged()">
                        <el-radio v-for="(item, key) in retirementQuartile" :value="key+1">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="23">
                <el-form-item label="退休年支出PR">
                    <el-slider v-model="retirement.percentileRank" :marks="expenseQuartileMarks" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <br/>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <ul>
                    <li>
                        勞退收益率：<a href="https://www.pension.org.tw/index.php/2018-10-03-15-11-09/2019-02-13-00-01-00" target="_blank">中華民國退休基金協會</a>
                    </li>
                    <li>
                        勞保勞退查詢：<a href="https://edesk.bli.gov.tw/me/#/na/login">勞保局E化服務系統</a>
                    </li>
                    <li>資料來源：
                        <a href="https://www.stat.gov.tw/News_Content.aspx?n=3908&s=231908">
                            主計總處統計專區 家庭收支調查 統計表 調查報告 平均每戶家庭收支按家庭組織型態別分
                        </a>
                    </li>
                </ul>
                <table class="table">
                    <tr>
                        <th>
                            <div>65歲及以上</div>
                            <div>按戶數五等分位組</div>
                        </th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                    </tr>
                    <tr>
                        <td>平均每戶人數</td>
                        <td>1.62</td>
                        <td>1.98</td>
                        <td>2.22</td>
                        <td>2.64</td>
                        <td>3.07</td>
                    </tr>
                    <tr>
                        <td>消費支出</td>
                        <td>380,421</td>
                        <td>614,536</td>
                        <td>772,725</td>
                        <td>961,375</td>
                        <td>1,335,663</td>
                    </tr>
                    <tr>
                        <td>平均每人消費支出</td>
                        <td>234,827</td>
                        <td>310,371</td>
                        <td>348,074</td>
                        <td>364,157</td>
                        <td>435,069</td>
                    </tr>
                </table>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>
<br v-if="checkedNeeds.includes('housing')"/>
<h3 v-if="checkedNeeds.includes('housing')" id="_購屋總價試算" tabindex="-1">購屋總價試算</h3>
<el-card v-if="checkedNeeds.includes('housing')">
    <el-form ref="ruleFormRef" v-loading="buildingLoading" :model="building" :rules="buildingRules" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="居住縣市" prop="county">
                    <el-select v-model="building.county" placeholder="請選擇" @change="onCountyChanged()">
                        <el-option v-for="item in counties":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="行政區" prop="town">
                    <el-select v-model="building.town" placeholder="請選擇" :disabled="!building.county" @change="onTownChanged()">
                        <el-option v-for="item in towns":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="建物類別" prop="buildingType">
                    <el-select v-model="building.buildingType" placeholder="請選擇" :disabled="!building.town"  @change="onBuildingTypeChanged()">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in buildingTypes":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="屋齡[年]" prop="buildingAge">
                    <el-select v-model="building.buildingAge" placeholder="請選擇" :disabled="!building.town" @change="onBuildingAgeChanged()">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in buildingAges":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="含車位" prop="hasParking">
                    <el-select v-model="building.hasParking" placeholder="請選擇" @change="onHasParkingChanged()">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in hasParkingOptions":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="資料筆數" prop="unitPrice">
                    <el-text>{{ Number(building.count).toLocaleString(undefined) }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="23">
                <el-form-item label="單價(萬/坪)" prop="unitPrice">
                    <el-slider v-model="buildingUnitPrice" :min="building.pr25" :max="building.pr75" :marks="unitPriceMarks" :disabled="!building.average" @change="calculateTotalPrice()"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <br/>
    <el-form ref="ruleFormRef" :model="room" :rules="roomRules" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="雙人房數量">
                    <el-input-number v-model="room.doubleBedRoom" :min="0" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="單人房數量">
                    <el-input-number v-model="room.singleBedRoom" :min="0" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="餐廳+客廳">
                    <el-input-number v-model="room.diningRoom" :min="1" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="衛浴數量">
                    <el-input-number v-model="room.bathroom" :min="1" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <!-- <el-col :span="12">
                <el-form-item label="廚房">
                    <el-input-number v-model="room.kitchen" :disabled="true" :min="1" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col> -->
            <el-col :span="12">
                <el-form-item label="公設比(%)" >
                    <el-input-number v-model="room.publicRatio" :min="0" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="預估主建實坪" prop="floorSize">
                    <el-text>{{ room.mainBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估附屬建物" prop="floorSize">
                    <el-text>{{ room.outBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="預估權狀坪數" prop="floorSize">
                    <el-text>{{ room.floorSize }} 坪</el-text>
                </el-form-item>
            </el-col>
            <el-col v-if="building.hasParking" :span="12">
                <el-form-item label="預估車位權狀" prop="floorSize">
                    <el-text>{{ room.parkingSize }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="總價" prop="unitPrice">
            <el-text>{{ Number(totalHousePrice).toLocaleString() }} 萬</el-text>
        </el-form-item>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                單價資料來源：<a href="https://www.jcic.org.tw/openapi/swagger/index.html" target="_blank">財團法人金融聯合徵信中心 OpenAPI
                </a>
                <table class="table">
                    <tr>
                        <th>空間</th>
                        <th>參考平方公尺</th>
                        <th>參考依據</th>
                    </tr>
                    <tr>
                        <td>雙人房</td>
                        <td>19</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13" target="_blank">
                                觀光旅館建築及設備標準
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>單人房</td>
                        <td>13</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13" target="_blank">
                                觀光旅館建築及設備標準
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>衛浴</td>
                        <td>4</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070115&flno=295" target="_blank">
                                建築技術規則建築設計施工編
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>廚房</td>
                        <td>2~4</td>
                        <td>
                            <a href="https://www.pro360.com.tw/category/kitchen_decorating#:~:text=%E4%B8%8D%E5%90%8C%E7%9A%84%E5%BB%9A%E5%85%B7%E9%85%8D%E7%BD%AE%E5%B0%8D,%E8%BC%83%E5%A5%BD%E7%9A%84%E4%BD%BF%E7%94%A8%E9%AB%94%E9%A9%97%E3%80%82" target="_blank">
                                廚房空間如何規劃？廚房設計4大攻略及範例圖片參考｜PRO360達人網
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>餐廳+客廳</td>
                        <td>1/人</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060009&flno=322" target="_blank">
                                職業安全衛生設施規則
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>其他室內空間</td>
                        <td>30</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=H0070037&flno=10" target="_blank">
                                幼兒園及其分班基本設施設備標準
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>陽台</td>
                        <td>10%</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingleRela.aspx?PCODE=D0070115&FLNO=162&ty=L" target="_blank">
                                建築技術規則建築設計施工編
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>車位</td>
                        <td>24.75</td>
                        <td>
                            <a href="https://tnews.cc/ur/newscon25045.htm" target="_blank">
                                研商「精進建物測繪登記相關業務」第 2 次會議紀錄
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>公設比</td>
                        <td>預設35%</td>
                        <td>
                            <a href="https://www.google.com/search?q=%E5%85%AC%E8%A8%AD%E6%AF%94" target="_blank">
                                Google搜索
                            </a>
                        </td>
                    </tr>
                </table>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>
<br v-if="checkedNeeds.includes('housing')"/>
<h3 v-if="checkedNeeds.includes('housing')" id="_購屋貸款試算" tabindex="-1">購屋貸款試算</h3>
<el-card v-if="checkedNeeds.includes('housing')">
    <el-form label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="計畫購屋年" @change="onBuyHouseYearChanged()">
                    <el-input-number v-model="mortgage.buyHouseYear" :min="2024" :max="2124"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估利息(%)">
                    <el-input-number v-model="interestRate" :min="0"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="貸款比例(%)">
                    <el-input-number v-model="mortgage.loanPercent" :min="0" :max="100"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="貸款年期">
                    <el-input-number v-model="mortgage.loanTerm" :min="0" @change="calculateMortgate()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="預估頭期款" prop="floorSize">
                    <el-text>{{ Number(mortgage.downPayment).toLocaleString() }} NTD</el-text>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估貸款" prop="floorSize">
                    <el-text>{{ Number(mortgage.loanAmount).toLocaleString() }} NTD</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="每月還款金額" prop="floorSize">
                    <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD</el-text>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
                <el-form-item label="預估貸款" prop="floorSize">
                    <el-text>{{ Number(mortgage.loanAmount).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col> -->
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                預估利息：<a href="https://www.cbc.gov.tw/tw/lp-370-1.html" target="_blank">央行貼放利率
                </a>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>
<br v-if="checkedNeeds.includes('parenting')"/>
<h3 v-if="checkedNeeds.includes('parenting')" id="_育兒試算" tabindex="-1">育兒試算</h3>
<el-card v-if="checkedNeeds.includes('parenting')">
    <el-form label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="平均月開支(隻/每年)">
                    <el-input-number v-model="parenting.childAnnualExpense" :min="0" @change="onChildMonthlyExpenseChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="養到幾歲放生">
                    <el-input-number v-model="parenting.independantAge" :min="18" @change="onIndependantAgeChanged()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="第一隻出生年">
                    <el-input-number v-model="parenting.firstBornYear" :min="0" @change="onFirstBornYearChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="第二隻出生年">
                    <el-input-number v-model="parenting.secondBornYear" :min="0" @change="onSecondBornYearChanged()"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                因為缺少資料集或是相關api，故此部分資料會較為粗糙。
                <ul>
                    <li>資料來源：
                        <a href="https://www.stat.gov.tw/News_Content.aspx?n=3908&s=231908">
                            主計總處統計專區 家庭收支調查 統計表 調查報告 平均每戶家庭收支按家庭組織型態別分
                        </a>
                    </li>
                </ul>
                <table class="table">
                    <tr>
                        <th>2021年家庭組織</th>
                        <th>雙親</th>
                        <th>核心</th>
                    </tr>
                    <tr>
                        <td>平均每戶人數</td>
                        <td>2.00</td>
                        <td>3.62</td>
                    </tr>
                    <tr>
                        <td>平均每戶就業人數</td>
                        <td>0.70</td>
                        <td>1.85</td>
                    </tr>
                    <tr>
                        <td>消費支出</td>
                        <td>652,023</td>
                        <td>1,028,621</td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            平均每位受扶養者帶來的支出： <br>
                            (核心消費支出 - 雙親消費支出) / (核心每戶人數 - 核心就業人數) = 212,767
                        </td>
                    </tr>
                </table>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>

## 3. 一生資產檢驗

<el-card>
    <el-form label-width="auto">
        <el-row>
            <el-col>
                <el-form-item label="股債比">
                    <el-radio-group v-model="investment.allocation" @change="onAllocationChanged()">
                        <el-radio v-for="(label, key) in porfolioLabels" :value="key">{{label}}(IRR:{{portfolioIRR[key]}}%)</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="已備資產" @change="onAssetChanged()">
                    <el-input-number v-model="investment.assetAmount" :min="0"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="月實領 - 月支出" @change="onIncomeChanged()">
                    <el-input-number v-model="investment.monthlyAveraging" :min="0" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <canvas id="myChart"></canvas>
        <el-row>
            <el-col>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <table class="table">
                    <tr>
                        <th>參考標的</th>
                        <th>股債比</th>
                        <th>來源網址</th>
                    </tr>
                    <tr>
                        <td>AOA</td>
                        <td>股8債2</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239729/ishares-aggressive-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>AOR</td>
                        <td>股6債4</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239756/ishares-growth-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>AOM</td>
                        <td>股4債6</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239765/ishares-moderate-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>AOK</td>
                        <td>股2債8</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239733/ishares-conservative-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                </table>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>

<script setup>
/**
 * Warning: FirebaseUI is not currently compatible with the v9 modular SDK. The v9 compatibility layer (specifically, the * app-compat and auth-compat packages) permits the usage of FirebaseUI alongside v9, but without the app size reduction * and other benefits of the v9 SDK.
 * https://firebase.google.com/docs/auth/web/firebaseui
 * https://firebase.google.com/docs/web/modular-upgrade
 */
/**
 * FirebaseUI for Web — Auth
 * https://firebaseopensource.com/projects/firebase/firebaseui-web/
 */
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import { onMounted, ref, reactive, watch, nextTick, shallowRef, onBeforeUnmount, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Chart from 'chart.js/auto';
// 設定檔案
const dialogVisible = ref(false)
const isFullScreen = ref(false)
const user = reactive({
    displayName: '註冊用戶',
    email: '',
    photoURL: '',
    uid: ''
})
const counties = ref([])
const townMap = reactive({})
const buildingTypes = ref([])
const buildingAges = ref([])
const genders = ref([])
const retirementQuartile = ref([])
const interestRate = ref(0)
const portfolioIRR = reactive({})
const porfolioLabels = reactive({
    aoa: '股8債2',
    aor: '股6債4',
    aom: '股4債6',
    aok: '股2債8',
})
const currentYear = new Date().getFullYear()
onMounted(async () => {
    initializeApp()
    setSelecOptions()
    calculateFloorSize()
    window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
})
function onResize() {
    isFullScreen.value = window.innerWidth < 768
}
async function initializeApp () {
    await firebase.initializeApp({
        apiKey: "AIzaSyDzxiXnAvtkAW5AzoV-CsBLNbryVJZrGqI",
        authDomain: "econ-sense-9a250.firebaseapp.com",
        projectId: "econ-sense-9a250",
        storageBucket: "econ-sense-9a250.appspot.com",
        messagingSenderId: "449033690264",
        appId: "1:449033690264:web:f5e419118030eb3afe44ed",
        measurementId: "G-19NFT8GVCZ"
    })
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
        if(!firebaseUser) {
            return
        }
        const { displayName = '註冊用戶', email, photoURL, uid } = firebaseUser
        user.photoURL = photoURL
        user.uid = uid
        user.email = email
        user.displayName = displayName
        dialogVisible.value = false
    })
}
async function setSelecOptions() {
    try {
        const selectRes = await fetch(`${import.meta.env.VITE_BASE_URL}/select`)
        const selectResJson = await selectRes.json()
        counties.value = selectResJson.counties || []
        buildingTypes.value = selectResJson.buildingTypes || []
        buildingAges.value = selectResJson.buildingAges || []
        genders.value = selectResJson.genders || []
        retirementQuartile.value = selectResJson.retirementQuartile || []
        Object.assign(townMap, selectResJson.townMap)

        const bankConfigRes = await fetch(`${import.meta.env.VITE_BASE_URL}/bank/config`)
        const bankConfigResJson = await bankConfigRes.json()
        interestRate.value = bankConfigResJson.interestRate
        Object.assign(portfolioIRR, bankConfigResJson.portfolioIRR)
    }
    catch (error) {
        // https://element-plus.org/en-US/component/message-box.html#message-box
        ElMessageBox.alert(error.message, {
        confirmButtonText: '回講座排程',
        callback: (action) => {
                window.location.replace('/calendar');
            },
        })
    }
    await calculateLifeExpectancy()
    if(building.county) {
        towns.value = townMap[building.county]
    }
    // 職業
    calculateMonthlyContributionTotal()
    // 退休
    calculateRetirementQuartileMarks()
    // 買房
    await getUnitPrice()
    calculateMortgate()
    // 建立資產表
    createLifeFinanceChart()
}
function openSignInDialog() {
    dialogVisible.value = true
    nextTick(() => {
        const uiConfig = {
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            signInFlow: 'popup',
            // Terms of service url.
            tosUrl: 'https://storage.googleapis.com/public.econ-sense.com/Terms%20of%20Use.pdf',
            // Privacy policy url.
            privacyPolicyUrl: 'https://storage.googleapis.com/public.econ-sense.com/Privacy%20Policy%20for%20Econ-Sense.com.pdf'
        };
        // https://stackoverflow.com/questions/47589209/error-in-mounted-hook-error-an-authui-instance-already-exists
        if(firebaseui.auth.AuthUI.getInstance()) {
            const ui = firebaseui.auth.AuthUI.getInstance()
            ui.start('#firebaseui-auth-container', uiConfig)
        } else {
            const ui = new firebaseui.auth.AuthUI(firebase.auth())
            ui.start('#firebaseui-auth-container', uiConfig)
        }
    })
}
async function signOut() {
    const result = await firebase.auth().signOut()
    for(let key in user) {
        user[key] = ''
    }
}
// 基本資料
const profile = reactive({
    dateOfBirth: '1990-12-12',
    gender: 'M',
    age: 0,
    lifeExpectancy: 0,
})
const profileRules = reactive({
    dateOfBirth:{ required: true, message: '請選擇', },
    gender: { required: true, message: '請選擇', },
})
function handleDateOfBirthChanged() {
    calculateLifeExpectancy()
}
function handleGenderChanged() {
    calculateLifeExpectancy()
}
function onAgeChaged() {
    calculateFutureSeniority()
    calculateRetireLife()
}
async function calculateLifeExpectancy() {
    const { dateOfBirth, gender, age } = profile
    if(dateOfBirth && gender){
        const ceYear = new Date().getFullYear()
        const yearOfBirth = dateOfBirth.slice(0,4)
        const calculateAge = ceYear - yearOfBirth
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calculate/lifeExpectancy`, {
            method: 'post',
            body: JSON.stringify({
                ceYear,
                age:calculateAge,
                gender,
            }),
            headers: {'Content-Type': 'application/json'}
        })

        profile.age = calculateAge
        profile.lifeExpectancy = await res.json()
        calculateRetireLife()
    }
}
// 需求分析
const checkAll = ref(false)
const isIndeterminate = ref(true)
const needs = ['career','retirement', 'housing', 'parenting',]
const checkedNeeds = ref(['career', 'retirement', 'housing', 'parenting',])
const needLabelMap = {
    housing: '購屋',
    parenting: '育兒',
    retirement: '退休',
}
const handleCheckAllChange = (val) => {
  checkedNeeds.value = val ? needs : []
  isIndeterminate.value = false
}
const handleCheckedNeedsChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === needs.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < needs.length
}
// 職業試算
const career = reactive({
    monthlySalary: 70000,
    foodExpense: 3000,
    monthylyContributionWages: 76500,
    employeeContrubutionRate: 6,
    monthylyContributionTotal: 0,
    monthlyEAT: 63000,
    monthlyExpense: 36000,
})
function onWageChanged() {
    calculateMonthlyContributionTotal()
}
function onRateChanged() {
    calculateMonthlyContributionTotal()
}
function calculateMonthlyContributionTotal() {
    const { monthylyContributionWages, employeeContrubutionRate } = career
    career.monthylyContributionTotal = Math.floor(monthylyContributionWages * (6 + employeeContrubutionRate) / 100) 
}
function onMonthlyEATChanged() {
    calculateMonthlyAveraging()
}
function onMonthlyExpenseChanged() {
    calculateMonthlyAveraging()
}
function calculateMonthlyAveraging() {
    const { monthlyEAT, monthlyExpense } = career
    investment.monthlyAveraging = monthlyEAT - monthlyExpense
}
// 退休試算
const retirement = reactive({
    age: 60,
    lifeExpectancy: 0,
    currentSeniority: 6.9,
    futureSeniority: 0,
    employerContribution: 250609,
    employerContributionIncome: 45571,
    employeeContrubution: 137264,
    employeeContrubutionIncome: 10308,
    level: 3,
    percentileRank: 50,
    monthlyExpense: 50,
})
const expenseQuartileMarks = reactive({})
function onRetireAgeChanged() {
    calculateRetireLife()
    calculateFutureSeniority()
}
function oncurrentSeniorityChanged() {
    calculateFutureSeniority()
}
function calculateFutureSeniority() {
    const { currentSeniority } = retirement
    retirement.futureSeniority = Number(Number(currentSeniority + retirement.age - profile.age).toFixed(1))
}
function onRetirementLevelChanged() {
    const { level } = retirement
    const selectedItem = retirementQuartile.value[level - 1]
    retirement.percentileRank = level * 20 - 10
    retirement.monthlyExpense = selectedItem.value
}
async function calculateRetireLife() {
    retirement.lifeExpectancy =  Number(Number(profile.age + profile.lifeExpectancy - retirement.age).toFixed(2))
}
// 購屋分析
const building = reactive({
    county: 'A',
    town: '63000110',
    buildingType: '',
    buildingAge: '',
    hasParking: '',
    count: 0,
    pr25: 0,
    pr75: 100,
    average: 0,
})
const buildingUnitPrice = ref(0)
let unitPriceMarks = reactive({
    0: 'PR25：？',
    100: 'PR75：？'
})
const buildingLoading = ref(false)
const towns = ref([])
const hasParkingOptions = ref([
    { label: '含', value: true },
    { label: '不含', value: false},
])
const buildingRules = reactive({
    county: { required: true, message: '請選擇', },
    town: { required: true, message: '請選擇', },
})
function onCountyChanged() {
    building.town = ''
    towns.value = []
    if(building.county) {
        towns.value = townMap[building.county]
    }
    getUnitPrice()
}
function onTownChanged() {
    getUnitPrice()
}
function onBuildingTypeChanged() {
    getUnitPrice()
}
function onBuildingAgeChanged() {
    getUnitPrice()
}
function onHasParkingChanged() {
    getUnitPrice()
}
async function getUnitPrice() {
    const {county, town, buildingType, buildingAge} = building
    if(county && town) {
        buildingLoading.value = true
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calculate/unitPrice`, {
            method: 'post',
            body: JSON.stringify(building),
            headers: {'Content-Type': 'application/json'}
        })
        buildingLoading.value = false
        const resJson = await res.json()
        Object.assign(building, resJson)

        const { pr25, pr75, average } = resJson
        if(!average) {
            ElMessage('資料筆數過少，請調整查詢條件')
            return
        }
        unitPriceMarks = {}
        unitPriceMarks[pr25] = `PR25: ${pr25}`
        unitPriceMarks[pr75] = `PR75: ${pr75}`
        unitPriceMarks[average] = `平均：${average}`
        buildingUnitPrice.value = average
        calculateTotalPrice()
    }
}
// 購屋分析2
const room = reactive({
    doubleBedRoom: 1,
    singleBedRoom: 2,
    bathroom: 2,
    diningRoom: 1,
    publicRatio: 35,
    mainBuilding: 0,
    outBuilding: 0,
    floorSize: 0,
    parkingSize: 0,
})
const totalHousePrice = ref(0)
const roomRules = {
    doubleBedRoom: { required: true, message: '請選擇', },
    singleBedRoom: { required: true, message: '請選擇', },
    bathroom:  { required: true, message: '請選擇', },
    publicRatio: { required: true, message: '請選擇', },
}
function calculateFloorSize() {
    const { doubleBedRoom, singleBedRoom, bathroom, diningRoom, publicRatio } = room

    const fortmatRatio = 0.3025
    const baseInteriorSize = 30 * fortmatRatio
    const doubleRoomSize = doubleBedRoom * 19 * fortmatRatio
    const singleRoomSize = singleBedRoom * 13 * fortmatRatio
    const bathRoomSize = bathroom * 4 * fortmatRatio
    const headCount = 2 * doubleBedRoom + singleBedRoom
    const diningTableSize = Math.max(2, headCount) * diningRoom *  fortmatRatio

    // 主建物只包含室內空間
    room.mainBuilding = Number(Number(baseInteriorSize + doubleRoomSize + singleRoomSize + bathRoomSize + diningTableSize).toFixed(2))

    // 附屬建築比如陽台
    const balcanyPercent = 0.1 // 10%
    room.outBuilding = Number(Number(room.mainBuilding * balcanyPercent).toFixed(2))

    // 公設比計算
    const publicRatioPercent = 1 + publicRatio / 100

    // 停車位權狀
    const parkingSize = 24.75 * fortmatRatio * publicRatioPercent
    room.parkingSize = Number(Number(parkingSize).toFixed(2))

    // 權狀坪數
    let floorSize = (room.mainBuilding + room.outBuilding) * publicRatioPercent
    if(building.hasParking) {
        floorSize += room.parkingSize
    }
    room.floorSize = Number(Number(floorSize).toFixed(2))
    calculateTotalPrice()
}
function calculateTotalPrice() {
    if(buildingUnitPrice.value && room.floorSize){
        const beforeFormatPrice =  Number(buildingUnitPrice.value) * Number(room.floorSize)
        totalHousePrice.value = Number(beforeFormatPrice.toFixed(2))
        calculateMortgate()
    }
}
// 房屋貸款試算
const mortgage = reactive({
    loanPercent: 70,
    downPayment: 0,
    loanAmount: 0,
    loanTerm: 30,
    monthlyRepay: 0,
    buyHouseYear: currentYear + 10,
})
function calculateMortgate() {
    if(!totalHousePrice.value){
        return
    }

    const loanAmount = totalHousePrice.value *　mortgage.loanPercent * 100
    const downPayment = totalHousePrice.value * 10000 - mortgage.loanAmount
    mortgage.loanAmount = loanAmount
    mortgage.downPayment = downPayment

    /**
     * 本息平均攤還
     * https://zh.wikipedia.org/zh-tw/%E6%9C%AC%E6%81%AF%E5%B9%B3%E5%9D%87%E6%94%A4%E9%82%84
     */
    const monthlyInterestRate = interestRate.value / 100 / 12
    const monthCount = mortgage.loanTerm * 12

    const part = Math.pow(1 + monthlyInterestRate, monthCount)
    const fraction = part * monthlyInterestRate
    const deno = part - 1

    const averageRepayRate = fraction /  deno
    mortgage.monthlyRepay = loanAmount * averageRepayRate
}
// 育兒試算
const parenting = reactive({
    childAnnualExpense: 212767,
    independantAge: 22,
    firstBornYear: 0,
    secondBornYear: 0,
})
function onChildMonthlyExpenseChanged() {
    createLifeFinanceChart()
}
function onIndependantAgeChanged() {
    createLifeFinanceChart()
}
function onFirstBornYearChanged() {
    createLifeFinanceChart()
}
function onSecondBornYearChanged() {
    createLifeFinanceChart()
}
// 投資試算
const investment = reactive({
    allocation: 'aoa',
    assetAmount: 1000000,
    monthlyAveraging: 70000,
    chartInstance: null,
})
function calculateRetirementQuartileMarks() {
    retirementQuartile.value.forEach((item, index) => {
        const { value } = item
        const percentileRank = (index + 1) * 20 - 10
        expenseQuartileMarks[percentileRank] = Number(value).toLocaleString()
    })
}
function onAllocationChanged() {
    createLifeFinanceChart()
}
function onAssetChanged() {
    createLifeFinanceChart()
}
function onIncomeChanged() {
    createLifeFinanceChart()
}
function onBuyHouseYearChanged() {
    createLifeFinanceChart()
}
function createLifeFinanceChart() {
    let pv = investment.assetAmount
    const irr = portfolioIRR[investment.allocation]
    let fv = 0 // fv = pv * irr + pmt
    const labels = []
    const datasetData = []
    for(let year = currentYear;year < currentYear + profile.lifeExpectancy; year++) {
        labels.push(year)
        datasetData.push(pv)

        // 基本資料
        const { dateOfBirth } = profile
        const birthYear = new Date(dateOfBirth).getFullYear()

        // 影響存量重大事件
        const { buyHouseYear } = mortgage
        if (year === buyHouseYear) {
            pv -= mortgage.downPayment
        }

        let calculatedPmt = 0
        // 退休開支影響收入與支出
        const reitrementStartYear = birthYear + retirement.age
        if(year <= reitrementStartYear) {
            calculatedPmt = investment.monthlyAveraging * 12
        }
        // 房貸利息影響每月儲蓄
        const mortgageStartYear = buyHouseYear
        const mortgageEndYear = buyHouseYear + mortgage.loanTerm
        if(mortgageStartYear <= year && year < mortgageEndYear) {
            calculatedPmt -= mortgage.monthlyRepay * 12
        }
        // 育兒開支影響每月儲蓄
        const { firstBornYear, secondBornYear, independantAge, childAnnualExpense } = parenting
        const firstBornEndYear = firstBornYear + independantAge
        const secondBornEndYear = secondBornYear + independantAge
        if(currentYear <= firstBornYear && firstBornYear <= year && year < firstBornEndYear) {
            calculatedPmt -= childAnnualExpense
        }
        if(currentYear <= secondBornYear && secondBornYear && secondBornYear <= year && year < secondBornEndYear) {
            calculatedPmt -= childAnnualExpense
        }

        // 計算複利終值
        fv = pv * (1 + irr / 100) + calculatedPmt
        pv = fv
    }
    const chartData = {
        datasets: [
            {
                label: '一生資產試算',
                data: datasetData,
            }
        ],
        labels
    }

    if(investment.chartInstance) {
        investment.chartInstance.data = chartData
        investment.chartInstance.update()
        return
    }

    const ctx = document.getElementById('myChart')
    const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData
    })
    investment.chartInstance = shallowRef(chartInstance)
}
</script>
<style lang="scss" scoped>
.card-header--custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular);
        background: white !important;
    }
}
:deep(.my-label) {
  background: white;
}
:deep(.my-content) {
  background: white;
}
</style>
