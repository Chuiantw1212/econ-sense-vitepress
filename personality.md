
# 金錢類型測驗

<el-card>
    <el-form>
        <el-row>
            <el-col>
                 <el-form-item label="出生年" required>
                        <econSelect>
                        </econSelect>
                    </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</el-card>

<script setup>
import { onMounted } from "vue";

onMounted(async () => {
  const response = await fetch("/personality.json");
  const file = await response.json();
  console.log("cool file", file);
});
</script>