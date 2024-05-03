<template>
    <el-form ref="ruleFormRef" v-loading="buildingLoading" :model="estatePrice" :rules="buildingRules"
        label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="居住縣市">
                    <select v-model="estatePrice.county" class="form__select" placeholder="請選擇"
                        @change="onCountyChanged()">
                        <option label="請選擇" value=""></option>
                        <option v-for="item in config.counties" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="行政區">
                    <select v-model="estatePrice.town" class="form__select" placeholder="請選擇"
                        :disabled="!estatePrice.county" @change="onTownChanged()">
                        <option label="請選擇" value=""></option>
                        <option v-for="item in towns" :key="item.value" :label="item.label" :value="item.value" />
                    </select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="建物類別">
                    <select v-model="estatePrice.buildingType" class="form__select" placeholder="請選擇"
                        :disabled="!estatePrice.town" @change="onBuildingTypeChanged()">
                        <option label="不限" value=""></option>
                        <option v-for="item in config.buildingTypes" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="屋齡[年]">
                    <select v-model="estatePrice.buildingAge" class="form__select" placeholder="請選擇"
                        :disabled="!estatePrice.town" @change="onBuildingAgeChanged()">
                        <option label="不限" value=""></option>
                        <option v-for="item in config.buildingAges" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="含車位">
                    <select v-model="estatePrice.hasParking" class="form__select" placeholder="請選擇"
                        @change="onHasParkingChanged()">
                        <option label="不限" value=""></option>
                        <option v-for="item in hasParkingOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="資料筆數">
                    <el-text>{{ Number(estatePrice.count).toLocaleString(undefined) }} 筆</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="23">
                <el-form-item label="單價(萬/坪)">
                    <el-slider v-model="buildingUnitPrice" :min="estatePrice.pr25" :max="estatePrice.pr75"
                        :marks="unitPriceMarks" :disabled="!estatePrice.average" @change="calculateTotalPrice()" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>