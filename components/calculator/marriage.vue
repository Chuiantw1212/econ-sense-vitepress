<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="結婚年">
                        <el-radio-group v-model="investment.allocationETF" @change="calculateAsset()">
                            <el-radio v-for="(label, key) in config.porfolioLabels" :value="key">{{ label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">

</script>