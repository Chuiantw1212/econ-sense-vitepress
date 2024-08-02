
# 金錢類型測驗

<el-card>
    <el-form>
        <el-row>
            <el-col>
                 <el-form-item label="出生年" required>
                        <econSelect v-model="profile.yearOfBirth" @change="calculateProfile()" style="width: 130px"
                            :options="birthYearOptions">
                        </econSelect>
                    </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</el-card>

<script setup>
const optionsGroups = [
    {
        options:{
            {
            text: '',
            value: 'a'
        },
        {

        },
        {
            text: '',
            value: 'b'
        },
        {
            
        },
        {
            text: '',
            value: 'c'
        },
        {
            text: '',
            value: 'd'
        }
        }
    }
]
</script>