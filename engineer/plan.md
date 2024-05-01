---
description: 探索台灣唯一開源的線上財務規劃表，工程師可學習Javascript，民眾建立財務觀念，並提供回饋意見。
outline: deep
---

# 開源財務規劃表

1. 台灣唯一<a href="https://zh.wikipedia.org/zh-tw/%E5%BC%80%E6%BA%90%E8%BD%AF%E4%BB%B6" target="_blank">開源</a>的線上財務規劃表。一切數字有憑有據，不賣商品賣事實。
2. 工程師可藉由開源的前後端程式碼學習Javascript (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-fastify-typescript" target="_blank">後端開源</a>)。
3. 民眾可以快速建立生涯財務觀念，並提共<a href="/calendar.html#聯絡en">回饋意見</a>。

<el-dialog v-model="loginDialogVisible" title="登入" :fullscreen="isFullScreen">
    邀請您進入我們的服務。註冊後，您可以方便地使用我們的平台，因為您的資料將被儲存，包括您的電子郵件地址以及填寫的表單內容。這樣做是為了讓您下次登入時不必重新輸入表單資料，提供更流暢的使用體驗。我們尊重您的隱私，您的資料將受到保護並嚴格保密。
    <div v-if="!user.uid" id="firebaseui-auth-container"></div>
</el-dialog>

## 1. 基本資料

<el-card>
    <template #header>
      <div class="card-header card-header--custom">
        <span>基本資料與參數</span>
        <el-button v-if="!user.uid" @click="openSignInDialog()">登入</el-button>
        <el-button v-else @click="signOut()">登出</el-button>
      </div>
    </template>
    <el-form ref="ruleFormRef" :model="profile" label-width="auto">
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
                <el-form-item label="出生年" prop="dateOfBirth">
                    <el-select v-model="profile.yearOfBirth" placeholder="請選擇" @change="onYearOfBirthChanged()" style="width: 130px">
                        <el-option v-for="year in yearOptions":key="year":label="year" :value="year"/>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="出生日期" prop="dateOfBirth">
                    <el-date-picker
                        v-model="profile.dateOfBirth"
                        type="date"
                        placeholder="選擇出生日期"
                        @change="onYearOfBirthChanged()"
                    />
                </el-form-item> -->
            </el-col>
            <el-col :span="12">
                <el-form-item label="試算年齡" prop="lifeExpectancy">
                    <el-text>{{ profile.age }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="性別" prop="gender">
                    <el-radio-group v-model="profile.gender" @change="handleGenderChanged()">
                        <el-radio v-for="(item, key) in genders" :value="item.value">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估餘命">
                    <el-text>{{ profile.lifeExpectancy }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="通貨膨脹">
                    <el-text>{{ inflationRate }}%</el-text>
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
                    <li>
                        通貨膨脹(消費者物價指數年增率)：<a href="https://www.stat.gov.tw/Point.aspx?sid=t.2&n=3581&sms=11480" target="_blank">中華民國統計資訊網</a>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>

## 2. 我可以FIRE嗎？

財務安全的理財方式，將退休前與退休後的資產分開計算。退休先有保障，當上流老人，再用退休前資產去試算是否可以推關。

### 職業試算

<el-card v-show="checkedNeeds.includes('career')">
    <el-form label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="本薪">
                    <el-input-number v-model="career.monthlyBasicSalary" :min="0" @change="onMonthlyBasicSalaryChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="伙食津貼">
                    <el-text>{{ Number(career.foodExpense).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="職工福利金">
                    <el-text> {{ Number(career.employeeWelfareFund).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="勞退/健保提繳工資">
                    <el-input-number v-model="career.pension.salary" :min="career.pension.salaryMin" :max="150000" @change="onPensionSalaryChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="試算提繳工資">
                    <a href="https://www.bli.gov.tw/0108097.html" target="_blank" tabIndex="-1">勞動部勞工保險局</a>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="健保負擔">
                    <el-text> {{ Number(career.healthInsutancePremium).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="勞退自提率(%)">
                    <el-input-number v-model="career.pension.rate" @change="onPensionContributionRateChanged()" :min="0" :max="6"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="勞退月提繳">
                    <el-text>{{ Number(career.pension.monthlyContribution).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="勞保提繳工資">
                    <el-input-number v-model="career.insurance.salary" :min="0" :max="45800" @change="onInsuranceSalaryChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="勞保勞工負擔">
                    <el-text>{{ Number(career.insurance.expense).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="職工福利金">
                    <el-text>{{ Number(career.employeeWelfareFund).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row> -->
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="月實領試算">
                    <el-text> {{ Number(career.monthlyNetPayEstimated).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="全年實領/12">
                    <el-input-number v-model="career.monthlyNetPay" :min="0" @change="onMonthlyEATChanged()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="月支出">
                    <el-input-number v-model="career.monthlyExpense" :min="0" @change="onMonthlyExpenseChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="月實領 - 月支出">
                    <el-text>{{ Number(investmentAveraging).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <ul>
                    <li>
                        假設薪資成長率永遠剛好抵銷通膨
                    </li>
                    <li>
                        月提繳查詢：<a href="https://www.bli.gov.tw/0013083.html" target="_blank">勞動部勞工保險局</a>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </template>
    <canvas v-show="career.monthlyBasicSalary" id="incomeChart"></canvas>
</el-card>

### 退休試算

<el-card v-show="checkedNeeds.includes('retirement')">
    <el-form label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="計畫退休年齡" prop="lifeExpectancy">
                    <el-input-number v-model="retirement.age" :min="60" :max="70" @change="onRetireAgeChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="距離退休" prop="retireLife">
                    <el-text>{{ retirement.age - profile.age }} 年</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="退休後餘命" prop="retireLife">
                    <el-text>{{ retirement.lifeExpectancy }} 年</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="目前勞保投保年資">
                    <el-input-number v-model="retirement.insurance.presentSeniority" :min="0" @change="onCurrentSeniorityChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估屆退年資">
                    <el-text>{{ retirement.insurance.futureSeniority }} 年</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估勞保年金">
                    <el-text>{{ Number(retirement.insurance.monthlyAnnuity).toLocaleString() }}  / 月</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="餘命 x 年金">
                    <el-text>{{ Number(retirement.insurance.annuitySum).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="顧主提繳累計">
                    <el-input-number v-model="retirement.pension.employerContribution" :min="0" @change="onEmployerContributionChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="個人提繳累計">
                    <el-input-number v-model="retirement.pension.employeeContrubution" :min="0" @change="onEmployeeContributionChanged()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="顧主提繳收益">
                    <el-input-number v-model="retirement.pension.employerContributionIncome" :min="0" @change="onEmployerContributionIncomeChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="個人提繳收益">
                    <el-input-number v-model="retirement.pension.employeeContrubutionIncome" :min="0" @change="onEmployeeContributionIncomeChanged()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="勞退十年收益率">
                    <el-input-number v-model="retirement.pension.irrOverDecade" :min="0" @change="onTenYearIrrChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估勞退總額">
                    <el-text>{{ Number(retirement.pension.finalValue).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估勞退稅基">
                    <el-text>{{ Number(retirement.pension.tax).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="退休品質">
                    <el-radio-group v-model="retirement.qualityLevel" @change="onRetirementLevelChanged()">
                        <el-radio v-for="(item, key) in retirementQuartile" :value="key+1">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="23">
                <el-form-item label="退休月支出">
                    <el-slider v-model="retirement.percentileRank" :marks="expenseQuartileMarks" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <br/>
        <canvas id="pensionChart"></canvas>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <ul>
                    <li>
                        勞保勞退查詢：<a href="https://edesk.bli.gov.tw/me/#/na/login">勞保局E化服務系統</a>
                    </li>
                    <li>
                        勞退收益率：<a href="https://www.pension.org.tw/index.php/2018-10-03-15-11-09/2019-02-13-00-01-00" target="_blank">中華民國退休基金協會</a>
                    </li>
                    <li>
                        假設勞退皆為一次領，且領後的再投資報酬率打平勞動基金
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

## 3. 五子登科

<el-card>
    <el-form label-width="auto">
        <el-row>
            <el-col :span="24">
                <el-form-item label="資產配置">
                    <el-radio-group v-model="investment.allocationETF" @change="onAllocationChanged()">
                        <el-radio v-for="(label, key) in porfolioLabels" :value="key">{{label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="23">
                <el-form-item label="範例標的IRR">
                    <el-slider v-model="investment.stockPercentage" :marks="allocationQuartileMarks" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="12">
                <el-form-item label="已備資產" @change="onAssetChanged()">
                    <el-input-number v-model="investment.presentAsset" :min="0"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="定期定額" @change="onAssetChanged()">
                    <el-text>{{ Number(investmentAveraging).toLocaleString() }} NTD / 月</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="12">
                <el-form-item label="第一隻西元年">
                    <el-input-number v-model="parenting.secondBornYear" :min="0" @change="onSecondBornYearChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="第二隻西元年">
                    <el-input-number v-model="parenting.secondBornYear" :min="0" @change="onSecondBornYearChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row> -->
        <el-row>
            <el-col :span="12">
                <el-form-item label="購屋西元年">
                    <el-input-number v-model="mortgage.buyHouseYear"  @change="onBuyHouseYearChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <!-- <el-form-item label="房貸利息負債" @change="onAssetChanged()">
                    <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD / 月</el-text>
                </el-form-item> -->
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="房貸利息負債" @change="onAssetChanged()">
                    <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD / 月</el-text>
                </el-form-item>
            </el-col>
        </el-row> -->
        <!-- <el-row>
            <el-col :span="4">
                <el-checkbox
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange"
                >
                    全部顯示
                </el-checkbox>
            </el-col>
            <el-col :span="20">
                <el-checkbox-group v-model="checkedNeeds" @change="handleCheckedNeedsChange">
                    <el-checkbox v-for="need in needs" :key="need" :value="need">
                    {{ needLabelMap[need] }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-col>
        </el-row> -->
        <canvas id="assetChart"></canvas>
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
                        <th>資產配置</th>
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

### 育兒試算

<el-card>
    <el-form label-width="auto">
         <el-row>
            <el-col :span="12">
                <el-form-item label="配偶貢獻">
                    <el-input-number v-model="parenting.spouseMonthlyContribution" :min="0" @change="drawLifeAssetChart()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="房屋容納人數">
                    <el-text>{{ estateSize.doubleBedRoom * 2 + estateSize.singleBedRoom }} 人</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="平均月開支(隻/每年)">
                    <el-input-number v-model="parenting.childAnnualExpense" :min="0" @change="drawLifeAssetChart()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="養到幾歲放生">
                    <el-input-number v-model="parenting.independantAge" :min="18" @change="drawLifeAssetChart()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="第一隻西元年">
                    <el-input-number v-model="parenting.firstBornYear" :min="0" @change="drawLifeAssetChart()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="第二隻西元年">
                    <el-input-number v-model="parenting.secondBornYear" :min="0" @change="drawLifeAssetChart()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
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

<h3 v-show="checkedNeeds.includes('housing')" id="_購屋總價試算" tabindex="-1">購屋總價試算</h3>
<el-card v-show="checkedNeeds.includes('housing')">
    <el-form ref="ruleFormRef" v-loading="buildingLoading" :model="estatePrice" :rules="buildingRules" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="居住縣市" prop="county">
                    <el-select v-model="estatePrice.county" placeholder="請選擇" @change="onCountyChanged()">
                        <el-option v-for="item in counties":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="行政區" prop="town">
                    <el-select v-model="estatePrice.town" placeholder="請選擇" :disabled="!estatePrice.county" @change="onTownChanged()">
                        <el-option v-for="item in towns":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="建物類別" prop="buildingType">
                    <el-select v-model="estatePrice.buildingType" placeholder="請選擇" :disabled="!estatePrice.town"  @change="onBuildingTypeChanged()">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in buildingTypes":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="屋齡[年]" prop="buildingAge">
                    <el-select v-model="estatePrice.buildingAge" placeholder="請選擇" :disabled="!estatePrice.town" @change="onBuildingAgeChanged()">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in buildingAges":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="含車位" prop="hasParking">
                    <el-select v-model="estatePrice.hasParking" placeholder="請選擇" @change="onHasParkingChanged()">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in hasParkingOptions":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="資料筆數" prop="unitPrice">
                    <el-text>{{ Number(estatePrice.count).toLocaleString(undefined) }} 筆</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="23">
                <el-form-item label="單價(萬/坪)" prop="unitPrice">
                    <el-slider v-model="buildingUnitPrice" :min="estatePrice.pr25" :max="estatePrice.pr75" :marks="unitPriceMarks" :disabled="!estatePrice.average" @change="calculateTotalPrice()"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <br/>
    <el-form ref="ruleFormRef" :model="estateSize" :rules="roomRules" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="雙人房數量">
                    <el-input-number v-model="estateSize.doubleBedRoom" :min="0" @change="calculateEstateSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="單人房數量">
                    <el-input-number v-model="estateSize.singleBedRoom" :min="0" @change="calculateEstateSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="客廳+餐廳">
                    <el-input-number v-model="estateSize.livingRoom" :min="1" @change="calculateEstateSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="衛浴數量">
                    <el-input-number v-model="estateSize.bathroom" :min="1" @change="calculateEstateSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估主建實坪" prop="floorSize">
                    <el-text>{{ estateSize.mainBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="陽台數量">
                    <el-input-number v-model="estateSize.balcany" :min="0" @change="calculateEstateSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估附屬建物" prop="floorSize">
                    <el-text>{{ estateSize.outBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="estatePrice.hasParking" >
            <el-col :span="12">
                <el-form-item label="車位數量" >
                    <el-input-number v-model="estateSize.parkingSpace" :min="0" @change="onParkingSpaceChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估車位權狀" prop="floorSize">
                    <el-text>{{ estateSize.parkingSize }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="公設比(%)" >
                    <el-input-number v-model="estateSize.publicRatio" :min="0" @change="calculateEstateSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估權狀坪數" prop="floorSize">
                    <el-text>{{ estateSize.floorSize }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="總價" prop="unitPrice">
                    <el-text>{{ Number(totalHousePrice).toLocaleString() }} 萬</el-text>
                </el-form-item>
            </el-col>
        </el-row>
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
<h3 v-show="checkedNeeds.includes('housing')" id="_購屋貸款試算" tabindex="-1">購屋貸款試算</h3>
<el-card v-show="checkedNeeds.includes('housing')">
    <el-form label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="購屋西元年">
                    <el-input-number v-model="mortgage.buyHouseYear" @change="onBuyHouseYearChanged()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估貸款成數" prop="floorSize">
                    <a href="https://member.jcic.org.tw/main_member/MorgageQuery.aspx" target="_blank">住宅貸款統計查詢網</a>
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
                <el-form-item label="預估貸款" prop="floorSize">
                    <el-text>{{ Number(mortgage.loanAmount).toLocaleString() }} NTD</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估頭期款" prop="floorSize">
                    <el-text>{{ Number(mortgage.downPayment).toLocaleString() }} NTD</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="試算利息(%)">
                    <el-input-number v-model="mortgage.interestRate" :min="0" @change="calculateMortgate()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="貸款年期">
                    <el-input-number v-model="mortgage.loanTerm" :min="0" @change="calculateMortgate()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="每月還款金額" prop="floorSize">
                    <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD</el-text>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <ul>
                    <li>
                        試算利息：<a href="https://www.cbc.gov.tw/tw/lp-370-1.html" target="_blank">央行貼放利率</a>
                    </li>
                </ul>
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
import { onMounted, ref, reactive, watch, nextTick, shallowRef, onBeforeUnmount, computed } from 'vue'
import { ElMessage, ElMessageBox, ElLoading  } from 'element-plus'
import Chart from 'chart.js/auto';
// 用戶與權限
const user = reactive({
    displayName: '註冊用戶',
    email: '',
    photoURL: '',
    uid: ''
})
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
    firebase.auth().onAuthStateChanged(async (firebaseUser)=> {
        if(!firebaseUser) {
            setIdToken()
            getUserFormSync()
            return
        }
        const { displayName = '註冊用戶', email, photoURL, uid } = firebaseUser
        await setIdToken(firebaseUser)

        user.photoURL = photoURL
        user.uid = uid
        user.email = email
        user.displayName = displayName
        loginDialogVisible.value = false
        await getUserFormSync(firebaseUser)
        initializeCalculator()
    })
}
const idToken = ref()
const idTokenIntervalId = ref()
async function setIdToken(currentUser) {
    if(currentUser) {
        idToken.value = await currentUser.getIdToken()
        idTokenIntervalId.value = setInterval(async () => {
            idToken.value = await firebase.auth().currentUser.getIdToken(true)
        }, 50 * 60 * 1000)
    } else {
        idToken.value = null
        clearInterval(idTokenIntervalId.value)
    }
}
async function authFetch(appendUrl, options = {}) {
    const currentUser = firebase.auth().currentUser
    if(!currentUser) {
        return // 離線使用或未登入
    }
    const { uid } = currentUser
    let baseUrl = import.meta.env.VITE_BASE_URL
    const defaultOptions = {
        method: 'get',
        headers: {
            Authorization: `Bearer ${idToken.value}`,
        }
    }
    defaultOptions.method = options.method
    if(options.body) {
        defaultOptions.body = JSON.stringify(options.body)
        Object.assign(defaultOptions.headers, {
            'Content-Type': 'application/json'
        })
    }
    Object.assign(defaultOptions.headers, options.headers)
    const res = await fetch(baseUrl + appendUrl, defaultOptions)
    if(res.status !== 200) {
        ElMessage(res.body || res.statusText)
        return
    }
    return res
}
const loginDialogVisible = ref(false)
function openSignInDialog() {
    loginDialogVisible.value = true
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
        /**
         * 避免FirebaseUI重複初始化錯誤
         * https://stackoverflow.com/questions/47589209/error-in-mounted-hook-error-an-authui-instance-already-exists
         */
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
// 主要從資料庫來的設定檔案
const inflationRate = ref(2)
const currentYear = new Date().getFullYear()
const counties = ref([])
const townMap = reactive({})
const buildingTypes = ref([])
const buildingAges = ref([])
const genders = ref([])
const retirementQuartile = ref([])
const portfolioIRR = reactive({})
const porfolioLabels = reactive({
    aok: '股2債8',
    aom: '股4債6',
    aor: '股6債4',
    aoa: '股8債2',
})
async function setSelecOptionSync() {
    const loading = ElLoading.service()
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
        mortgage.interestRate = bankConfigResJson.interestRate
        Object.assign(portfolioIRR, bankConfigResJson.portfolioIRR)
    }
    catch (error) {
        // https://element-plus.org/en-US/component/message-box.html#message-box
        ElMessageBox.alert(error.message, {
        confirmButtonText: '回講座排程',
        callback: (action) => {
                window?.location.replace('/calendar');
            },
        })
    } finally {
        loading.close()
    }
}
async function getUserFormSync(firebaseUser) {
    const initForm = {
        retirement: {
            age: 65,
            pension: {
                employeeContrubution: 0,
                employeeContrubutionIncome: 0,
                employerContribution: 0,
                employerContributionIncome: 0,
                irrOverDecade: 4.76
            },
            percentileRank: 50,
            qualityLevel: 3
        },
        investment: {
            allocationETF: 'aok',
        },
        parenting: {
            childAnnualExpense: 212767,
            independantAge: 18,
        },
        estateSize: {
            publicRatio: 35,
            bathroom: 1,
            livingRoom: 1,
            balcany: 1,
            parkingSpace: 1
        },
        mortgage: {
            loanPercent: 80,
            loanTerm:25,
        },
    }
    let userForm = {}
    try {
        if(firebaseUser) {
            const { uid } = firebaseUser
            const res = await authFetch(`/user/${uid}`, {
                method: 'post'
            })
            userForm = await res.json()
        }
    } catch (error) {
        const res = await authFetch(`/user/new`, {
            method: 'post'
        })
        userForm = await res.json()
    } finally {
        Object.assign(initForm, userForm)
        Object.assign(profile, initForm.profile)
        Object.assign(career, initForm.career)
        Object.assign(retirement, initForm.retirement)
        Object.assign(investment, initForm.investment)
        Object.assign(estatePrice, initForm.estatePrice)
        Object.assign(estateSize, initForm.estateSize)
        Object.assign(mortgage, initForm.mortgage)
        Object.assign(parenting, initForm.parenting)
        initializeCalculator()
    }
}
async function initializeCalculator() {
    // 基本資料
    await calculateLifeExpectancyAndAge()
    // 職業
    onMonthlyBasicSalaryChanged()
    onInsuranceSalaryChanged()
    onPensionSalaryChanged()
    // 退休
    calculateFutureSeniority()
    calculateRetirementQuartileMarks()
    calculateRetirementMonthlyExpense()
    // 買房
    if(estatePrice.county) {
        towns.value = townMap[estatePrice.county]
    }
    await getUnitPriceSync()
    calculateEstateSize()
    calculateMortgate() // will calculate asset
    // 投資
    calculatePortfolioMarks()
}
// 基本資料
const profile = reactive({
    yearOfBirth: '',
    dateOfBirth: '',
    gender: '',
    age: 0,
    lifeExpectancy: 0,
})

function onYearOfBirthChanged() {
    calculateLifeExpectancyAndAge()
}
function handleGenderChanged() {
    calculateLifeExpectancyAndAge()
}
async function calculateLifeExpectancyAndAge() {
    const { yearOfBirth, gender, age } = profile
    if(yearOfBirth && gender){
        const ceYear = new Date().getFullYear()
        const calculateAge = ceYear - yearOfBirth
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calculate/lifeExpectancy`, {
            method: 'post',
            body: JSON.stringify({
                ceYear,
                age: calculateAge,
                gender,
            }),
            headers: {'Content-Type': 'application/json'}
        })
        const lifeExpectancy = await res.json()
        profile.age = calculateAge
        profile.lifeExpectancy = lifeExpectancy

        calculateRetireLife()
        calculateFutureSeniority()
        drawRetirementPensionChart()

        await authFetch(`/user/profile`, {
            method: 'put',
            body: profile,
        })
    }
}
// 需求分析
const checkAll = ref(false)
const isIndeterminate = ref(true)
const needs = ['career','retirement', 'investment','housing', 'parenting',]
const checkedNeeds = ref(['career', 'retirement', 'investment', 'housing', 'parenting',])
const needLabelMap = {
    career: '職業試算',
    retirement: '退休試算',
    investment: '退休前資產試算',
    housing: '購屋試算',
    parenting: '育兒試算',
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
    monthlyBasicSalary: 0,
    foodExpense: 3000,
    employeeWelfareFund: 0,
    pension: {
        salary: 0,
        salaryMin: 0,
        rate: 0,
        monthlyContribution: 0,
        monthlyContributionEmployee: 0,
    },
    healthInsutancePremium: 0,
    insurance: {
        salary: 0,
        salaryMin: 0,
        expense: 0,
    },
    monthlyNetPayEstimated: 0,
    monthlyNetPay: 0,
    monthlyExpense: 0,
})
let incomeChartInstance = ref(null)
function onMonthlyBasicSalaryChanged() {
    calculatePensionSalaryMin()
    calculateInsuranceSalaryMin()
    drawChartAndCalculateIncome()
    calculateMonthlyInvesting()
    const { monthlyBasicSalary, } = career
    career.employeeWelfareFund = Math.floor(monthlyBasicSalary * 0.5 / 100)
}
function onInsuranceSalaryChanged() {
    calculateInsuranceSalaryMin()
    calculateMonthlyAnnuity()
    drawChartAndCalculateIncome()
    drawRetirementPensionChart()
}
function onPensionSalaryChanged() {
    calculateCareerPensionTotal()
    calculateHealthInsurancePremium()
    drawChartAndCalculateIncome()
}
function calculatePensionSalaryMin() {
    const { monthlyBasicSalary, foodExpense, } = career
    const salaryMin = monthlyBasicSalary + foodExpense
    career.pension.salaryMin = salaryMin
    career.pension.salary = Math.max(career.pension.salary, salaryMin)
    calculateHealthInsurancePremium()
}
function calculateInsuranceSalaryMin() {
    if(career.monthlyBasicSalary) {
        career.insurance.salaryMin = Math.min(45800, career.monthlyBasicSalary)
    }
    if(!career.insurance.salary) {
        career.insurance.salary = career.insurance.salaryMin
    }
    calculateInsuranceExpense()
}
function calculateInsuranceExpense() {
    const { salary, } = career.insurance
    const insuranceRate = 12 / 100
    const premiumRate =  20 / 100
    career.insurance.expense = Math.ceil(salary * insuranceRate * premiumRate)
}
function onPensionContributionRateChanged() {
    calculateCareerPensionTotal()
    drawChartAndCalculateIncome()
}
function calculateHealthInsurancePremium() {
    const { salary, salaryMin } = career.pension
    const salaryBasis = Math.max(salary, salaryMin)
    const healthInsutancePremiumRate =  5.17 / 100
    const employeeContributionRate = 30 / 100
    career.healthInsutancePremium = Math.ceil(salaryBasis * healthInsutancePremiumRate * employeeContributionRate)
}
function calculateCareerPensionTotal() {
    const { salary, salaryMin, rate } = career.pension
    const salaryBasis = Math.max(salary, salaryMin)
    const maxContribution = Math.min(salaryBasis, 150000)
    career.pension.monthlyContributionEmployee = Math.floor(maxContribution * rate / 100)
    career.pension.monthlyContribution = Math.floor(maxContribution * (6 + rate) / 100)
    drawRetirementPensionChart()
}
function onMonthlyEATChanged() {
    drawChartAndCalculateIncome()
    calculateMonthlyInvesting()
}
function onMonthlyExpenseChanged() {
    drawChartAndCalculateIncome()
    calculateMonthlyInvesting()
}
function calculateMonthlyInvesting() {
    const { monthlyNetPay = 0, monthlyExpense = 0, monthlyNetPayEstimated } = career
    const monthlyNetPayBasis = monthlyNetPay || monthlyNetPayEstimated
    investmentAveraging.value = Math.floor(monthlyNetPayBasis - monthlyExpense)
}
function drawChartAndCalculateIncome() {
    debounce(() => {
        // 儲存參數
        authFetch(`/user/career`, {
            method: 'put',
            body: career,
        })
        // 繪製圖表
        let pv = 0
        let fv = 0
        const dataAndDataIndex = []
        fv = career.monthlyBasicSalary
        dataAndDataIndex.push({  
            label: '本薪',
            data: [pv, fv],
            datasetIndex: 0,
        })

        pv = fv
        fv += career.foodExpense
        dataAndDataIndex.push({
            label: '伙食津貼',
            data: [pv, fv],
            datasetIndex: 0,
        })

        pv = fv
        fv -= career.employeeWelfareFund
        dataAndDataIndex.push({
            label: '職工福利金',
            data: [pv, fv],
            datasetIndex: 1,
        })

        pv = fv
        fv -= career.healthInsutancePremium
        dataAndDataIndex.push({
            label: '健保',
            data: [pv, fv],
            datasetIndex: 1,
        })

        pv = fv
        fv -= career.insurance.expense
        dataAndDataIndex.push({
            label: '勞保',
            data: [pv, fv],
            datasetIndex: 1,
        })

        pv = fv
        fv -= career.pension.monthlyContributionEmployee
        dataAndDataIndex.push({
            label: '勞退',
            data: [pv, fv],
            datasetIndex: 1,
        })

        career.monthlyNetPayEstimated = fv
        calculateMonthlyInvesting()
        fv = career.monthlyNetPay || fv
        dataAndDataIndex.push({
            label: '月實領',
            data: [fv, 0],
            datasetIndex: 0,
        })

        if(career.monthlyExpense) {
            pv = fv
            fv -= career.monthlyExpense
            dataAndDataIndex.push({
                label: '月支出',
                data: [pv, fv],
                datasetIndex: 1,
            })
        }

        if(0 <= fv) {
            dataAndDataIndex.push({
                label: '定期定額',
                data: [fv, 0],
                datasetIndex: 0,
            })
        }

        const labels = dataAndDataIndex.map(item => item.label)
        const data0 = dataAndDataIndex.map(item => {
            if(item.datasetIndex === 0){
                return item.data
            } else {
                return [0, 0]
            }
        })
        const data1 = dataAndDataIndex.map(item => {
            if(item.datasetIndex === 1){
                return item.data
            } else {
                return [0, 0]
            }
        })

        const data = {
            labels: labels,
            datasets: [
                {
                    label: '應付月薪',
                    data: data0,
                },
                {
                    label: '應扣項目',
                    data: data1
                },
            ]
        }
        if(incomeChartInstance.value) {
            incomeChartInstance.value.data = data
            incomeChartInstance.value.update()
            return
        }
        const ctx = document.getElementById('incomeChart')
        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: tooltipFormat,
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        })
        incomeChartInstance = shallowRef(chartInstance)
    })()
}
function tooltipFormat(tooltipItems) {
    const { raw } = tooltipItems
    const variedValue = raw[1] - raw[0]
    return Number(variedValue).toLocaleString()
}
// 退休試算
const retirement = reactive({
    age: 60,
    lifeExpectancy: 0,
    insurance: {
        presentSeniority: 0, // 6.9
        futureSeniority: 0,
        monthlyAnnuity: 0,
    },
    pension: {
        employeeContrubution: 0,
        employeeContrubutionIncome: 0,
        employerContribution: 0,
        employerContributionIncome: 0,
        irrOverDecade: 4.76,
        finalValue: 0,
    },
    qualityLevel: 0,
    percentileRank: 0,
})
let pensionChartInstance = ref(null)
const expenseQuartileMarks = reactive({})
function onRetireAgeChanged() {
    calculateRetireLife()
    calculateFutureSeniority()
    calculateMonthlyAnnuity()
    drawRetirementPensionChart()
    drawLifeAssetChart()
}
function onCurrentSeniorityChanged() {
    calculateFutureSeniority()
    calculateMonthlyAnnuity()
    drawRetirementPensionChart()
}
function calculateFutureSeniority() {
    const { presentSeniority } = retirement.insurance
    retirement.insurance.futureSeniority = Number(Number(presentSeniority + retirement.age - profile.age).toFixed(1))
}
function calculateMonthlyAnnuity() {
    const { salary } = career.insurance
    const { age, lifeExpectancy } = retirement
    const { futureSeniority, } = retirement.insurance
    const ageModifier = 1 + (retirement.age - 65) * 0.04
    const formulaOne = (salary * futureSeniority * 0.775 / 100 + 3000) * ageModifier
    const formulaTwo = (salary * futureSeniority * 1.55 / 100) * ageModifier
    retirement.insurance.monthlyAnnuity = Math.floor(Math.max(formulaOne, formulaTwo))
    retirement.insurance.annuitySum = Math.floor(retirement.insurance.monthlyAnnuity * 12 * lifeExpectancy)
}
function onEmployerContributionChanged() {
    drawRetirementPensionChart()
}
function onEmployeeContributionChanged() {
    drawRetirementPensionChart()
}
function onEmployerContributionIncomeChanged() {
    drawRetirementPensionChart()
}
function onEmployeeContributionIncomeChanged() {
    drawRetirementPensionChart()
}
function onTenYearIrrChanged() {
    drawRetirementPensionChart()
}
function onRetirementLevelChanged() {
    const { qualityLevel } = retirement
    retirement.percentileRank = qualityLevel * 20 - 10
    calculateRetirementMonthlyExpense()
}
function calculateRetirementMonthlyExpense() {
    const { qualityLevel } = retirement
    if(!qualityLevel || !retirementQuartile.value.length) {
        return
    }
    const selectedItem = retirementQuartile.value[qualityLevel - 1]
    retirement.annualExpense = selectedItem.value
    drawRetirementPensionChart()
}
async function calculateRetireLife() {
    retirement.lifeExpectancy =  Number(Number(profile.age + profile.lifeExpectancy - retirement.age).toFixed(2))
}
async function drawRetirementPensionChart() {
    debounce(() => {
        // 儲存參數
        authFetch(`/user/retirement`, {
            method: 'put',
            body: retirement,
        })
        // 計算資料
        const {
            employerContribution,
            employeeContrubution,
            employerContributionIncome,
            employeeContrubutionIncome,
            irrOverDecade
        } = retirement.pension
        let inflationModifier = 1

        let pv = employerContribution + employeeContrubution + employerContributionIncome + employeeContrubutionIncome
        const n = retirement.age - profile.age
        const pensionContribution = career.pension.monthlyContribution * 12
        const irr = irrOverDecade
        let fv = 0 // fv = pv * irr + pensionContribution

        const labels = []
        const datasetData = []

        // 退休前資產累積
        for(let i = 0;i < n; i++) {
            const calculatedYear = currentYear + i
            labels.push(calculatedYear)
            datasetData.push(pv)

            inflationModifier *= (1 + inflationRate.value / 100)
            fv = Math.floor(pv * (1 + irr / 100) + pensionContribution * inflationModifier)
            pv = fv
        }
        calculatePensionFinalValue(fv)

        // 退休後退休支出
        for(let i = 0;i < retirement.lifeExpectancy; i++) {
            const calculatedYear = currentYear + n + i
            datasetData.push(pv)
            labels.push(calculatedYear)

            inflationModifier *= (1 + inflationRate.value / 100)
            const pmt = retirement.insurance.monthlyAnnuity * 12 - retirement.annualExpense * inflationModifier
            fv = Math.floor(pv * (1 + irr / 100) + pmt)
            pv = fv
        }
        const chartData = {
            datasets: [
                {
                    label: '退休金資產試算',
                    data: datasetData,
                }
            ],
            labels
        }
        if(pensionChartInstance.value) {
            pensionChartInstance.value.data = chartData
            pensionChartInstance.value.update()
            return
        }
        const ctx = document.getElementById('pensionChart')
        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData
        })
        pensionChartInstance = shallowRef(chartInstance)
    }, 'retirement',)()
}
function calculatePensionFinalValue(fv) {
    retirement.pension.finalValue = fv || 0
    const { futureSeniority } = retirement.insurance
    const taxFreeLevel = 19.8 * 10000 * futureSeniority
    const taxHalfLevel = 39.8 * 10000 * futureSeniority
    let taxBasis = retirement.pension.finalValue
    taxBasis -= taxFreeLevel
    const taxHalf = Math.max(0, taxBasis) / 2
    taxBasis -= taxHalfLevel
    const taxFull = Math.max(0, taxBasis) / 2
    retirement.pension.tax = Math.floor(taxHalf + taxFull)
}
// 投資試算
const investment = reactive({
    allocationETF: '',
    stockPercentage: 0,
    presentAsset: 0,
})
const investmentAveraging = ref(0)
const allocationQuartileMarks = reactive({})
let investmentChartInstance = ref(null)
function calculateRetirementQuartileMarks() {
    retirementQuartile.value.forEach((item, index) => {
        const { value } = item
        const percentileRank = (index + 1) * 20 - 10
        const retirementMonthlyExpense = value / 12
        expenseQuartileMarks[percentileRank] = Number(Math.floor(retirementMonthlyExpense)).toLocaleString()
    })
}
function onAllocationChanged() {
    calculatePortfolioMarks()
    drawLifeAssetChart()
}
function calculatePortfolioMarks() {
    const { allocationETF } = investment
    const allocationLabels = Object.keys(porfolioLabels)
    const allocationIndex = allocationLabels.findIndex(label => label === allocationETF)
    const stockPercentage = Math.floor((allocationIndex + 1) * 20)
    investment.stockPercentage = stockPercentage
    allocationLabels.forEach((label, index) => {
        const irr = portfolioIRR[label]
        const stockPercentage = Math.floor((index + 1) * 20)
        allocationQuartileMarks[stockPercentage] = `IRR: ${irr}`
    })
}
function onAssetChanged() {
    drawLifeAssetChart()
}
function onIncomeChanged() {
    drawLifeAssetChart()
}
function onBuyHouseYearChanged() {
    drawLifeAssetChart()
}
function drawLifeAssetChart() {
    debounce(() => {
        // 儲存參數
        authFetch(`/user/parenting`, {
            method: 'put',
            body: parenting,
        })
    }, 'parenting')()
    debounce(() => {
        authFetch(`/user/investment`, {
            method: 'put',
            body: investment,
        })
    }, 'investment')()

    let inflationModifier = 1

    let pv = investment.presentAsset
    const irr = portfolioIRR[investment.allocationETF]
    let fv = 0 // fv = pv * irr + pmt
    const labels = []
    const datasetData = []
    for(let year = currentYear;year < currentYear + retirement.insurance.futureSeniority; year++) {
        labels.push(year)
        datasetData.push(pv)

        // 基本資料
        const { yearOfBirth } = profile

        // 影響存量重大事件
        const { buyHouseYear } = mortgage
        if (year === buyHouseYear) {
            pv -= mortgage.downPayment * inflationModifier
        }

        let calculatedPmt = 0
        // 退休開支影響收入與支出
        const reitrementStartYear = yearOfBirth + retirement.age
        if(year < reitrementStartYear) {
            calculatedPmt = investmentAveraging.value * 12 * inflationModifier
        }
        // 房貸利息影響每月儲蓄
        const mortgageStartYear = buyHouseYear
        const mortgageEndYear = buyHouseYear + mortgage.loanTerm
        if(mortgageStartYear <= year && year < mortgageEndYear) {
            calculatedPmt -= mortgage.monthlyRepay * 12
        }
        // 育兒開支影響每月儲蓄
        const { firstBornYear, secondBornYear, independantAge, childAnnualExpense, spouseMonthlyContribution } = parenting
        const firstBornEndYear = firstBornYear + independantAge
        const secondBornEndYear = secondBornYear + independantAge
        const hasFirstBorn = currentYear <= firstBornYear && firstBornYear <= year && year < firstBornEndYear
        const hasSecondBorn = currentYear <= secondBornYear && secondBornYear && secondBornYear <= year && year < secondBornEndYear
        if(hasFirstBorn) {
            calculatedPmt -= childAnnualExpense * inflationModifier
        }
        if(hasSecondBorn) {
            calculatedPmt -= childAnnualExpense * inflationModifier
        }
        if(hasFirstBorn || hasSecondBorn) {
            calculatedPmt += spouseMonthlyContribution * 12 * inflationModifier
        }

        // 計算複利終值
        inflationModifier *= 1 + inflationRate.value / 100
        fv = pv * (1 + irr / 100) + calculatedPmt
        pv = fv
    }
    const chartData = {
        datasets: [
            {
                label: '退休前資產',
                data: datasetData,
            }
        ],
        labels
    }

    if(investmentChartInstance.value) {
        investmentChartInstance.value.data = chartData
        investmentChartInstance.value.update()
        return
    }

    const ctx = document.getElementById('assetChart')
    const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData
    })
    investmentChartInstance = shallowRef(chartInstance)
}
// 育兒試算
const parenting = reactive({
    childAnnualExpense: 0,
    spouseMonthlyContribution: 0,
    independantAge: 0,
    firstBornYear: 0,
    secondBornYear: 0,
})
// 購屋分析
const estatePrice = reactive({
    county: '',
    town: '',
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
    estatePrice.town = ''
    towns.value = []
    if(estatePrice.county) {
        towns.value = townMap[estatePrice.county]
    }
    getUnitPriceSync()
}
function onTownChanged() {
    getUnitPriceSync()
}
function onBuildingTypeChanged() {
    getUnitPriceSync()
}
function onBuildingAgeChanged() {
    getUnitPriceSync()
}
function onHasParkingChanged() {
    if(estatePrice.hasParking) {
        estateSize.parkingSpace = Math.max(1, estateSize.parkingSpace)
    }
    getUnitPriceSync()
}
async function getUnitPriceSync() {
    const {county, town, buildingType, buildingAge} = estatePrice
    if(county && town) {
        buildingLoading.value = true
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calculate/unitPrice`, {
            method: 'post',
            body: JSON.stringify(estatePrice),
            headers: {'Content-Type': 'application/json'}
        })
        buildingLoading.value = false
        const resJson = await res.json()
        Object.assign(estatePrice, resJson)

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
const estateSize = reactive({
    doubleBedRoom: 0,
    singleBedRoom: 0,
    bathroom: 0,
    livingRoom: 0,
    publicRatio: 0,
    mainBuilding: 0,
    balcany: 0,
    outBuilding: 0,
    floorSize: 0,
    parkingSpace: 0,
    parkingSize: 0,
    headCount: 0,
})
const totalHousePrice = ref(0)
const roomRules = {
    doubleBedRoom: { required: true, message: '請選擇', },
    singleBedRoom: { required: true, message: '請選擇', },
    bathroom:  { required: true, message: '請選擇', },
    publicRatio: { required: true, message: '請選擇', },
}
async function onParkingSpaceChanged() {
    if(!estateSize.parkingSpace){
        estatePrice.hasParking = ''
    }
    await getUnitPriceSync()
    calculateEstateSize()
}
function calculateEstateSize() {
    const { doubleBedRoom, singleBedRoom, bathroom, livingRoom, publicRatio, balcany, parkingSpace } = estateSize
    const headCount = 2 * doubleBedRoom + singleBedRoom
    estateSize.headCount = headCount

    const fortmatRatio = 0.3025
    const baseInteriorSize = 30 * fortmatRatio
    const doubleRoomSize = doubleBedRoom * 19 * fortmatRatio
    const singleRoomSize = singleBedRoom * 13 * fortmatRatio
    const bathRoomSize = bathroom * 4 * fortmatRatio
    const diningTableSize = Math.max(2, headCount) * livingRoom *  fortmatRatio

    // 主建物只包含室內空間
    estateSize.mainBuilding = Number(Number(baseInteriorSize + doubleRoomSize + singleRoomSize + bathRoomSize + diningTableSize).toFixed(2))

    // 附屬建築比如陽台
    const balcanyPercent = 0.1 * balcany // 10%
    estateSize.outBuilding = Number(Number(estateSize.mainBuilding * balcanyPercent).toFixed(2))

    // 公設比計算
    const publicRatioPercent = 1 + publicRatio / 100

    // 停車位權狀
    if(estatePrice.hasParking) {
        const parkingSize = 24.75 * parkingSpace * fortmatRatio * publicRatioPercent
        estateSize.parkingSize = Number(Number(parkingSize).toFixed(2))
    }

    // 權狀坪數
    let floorSize = (estateSize.mainBuilding + estateSize.outBuilding) * publicRatioPercent
    if(estatePrice.hasParking) {
        floorSize += estateSize.parkingSize
    }
    estateSize.floorSize = Number(Number(floorSize).toFixed(2))
    calculateTotalPrice()
}
function calculateTotalPrice() {
    if(!buildingUnitPrice.value || !estateSize.floorSize){
        return
    }
    // 儲存參數
    debounce(() => {
        authFetch(`/user/estatePrice`, {
            method: 'put',
            body: estatePrice,
        })
    }, 'estatePrice')()
    debounce(() => {
        authFetch(`/user/estateSize`, {
            method: 'put',
            body: estateSize,
        })
    }, 'estateSize')()
    const beforeFormatPrice =  Number(buildingUnitPrice.value) * Number(estateSize.floorSize)
    totalHousePrice.value = Number(beforeFormatPrice.toFixed(2))
    calculateMortgate()
}
// 房屋貸款試算
const mortgage = reactive({
    buyHouseYear: 0,
    loanPercent: 0,
    interestRate: 0,
    loanTerm: 0,
    downPayment: 0,
    loanAmount: 0,
    monthlyRepay: 0,
})
async function calculateMortgate() {
    const { loanPercent, loanTerm } = mortgage
    if(!totalHousePrice.value || !loanPercent || !loanTerm){
        return
    }
    debounce(() => {
        // 儲存參數
        authFetch(`/user/mortgage`, {
            method: 'put',
            body: mortgage,
        })
    }, 'mortgage')()
    const loanAmount = totalHousePrice.value *　mortgage.loanPercent * 100
    mortgage.loanAmount = loanAmount
    const downPayment = totalHousePrice.value * 10000 - loanAmount
    mortgage.downPayment = downPayment

    /**
     * 本息平均攤還
     * https://zh.wikipedia.org/zh-tw/%E6%9C%AC%E6%81%AF%E5%B9%B3%E5%9D%87%E6%94%A4%E9%82%84
     */
    const monthlyInterestRate = 　mortgage.interestRate / 100 / 12
    const monthCount = mortgage.loanTerm * 12

    const part = Math.pow(1 + monthlyInterestRate, monthCount)
    const fraction = part * monthlyInterestRate
    const deno = part - 1

    const averageRepayRate = fraction /  deno
    mortgage.monthlyRepay = Math.floor(loanAmount * averageRepayRate)
    drawLifeAssetChart()
}
// 沒什麼會去動到的Mounted&Debounce放底下
const yearOptions = ref([])
onMounted(async () => {
    const yearOptionsTemp = []
    for(let i = 0;i < 60; i++){
        yearOptionsTemp.push(currentYear - i - 18)
    }
    yearOptions.value = yearOptionsTemp
    initializeApp()
    await setSelecOptionSync()
    initializeCalculator()
    window?.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
    window?.removeEventListener('resize', onResize)
})
const isFullScreen = ref(false)
function onResize() {
    isFullScreen.value = window?.innerWidth < 768
}
const debounceIdGroup = reactive({})
function debounce(func, label = '', delay = 50) {
    return (...args) => {
        clearTimeout(debounceIdGroup[label])
        debounceIdGroup[label] = setTimeout(() => {
            debounceIdGroup[label] = undefined
            func()
        }, delay)
    }
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
