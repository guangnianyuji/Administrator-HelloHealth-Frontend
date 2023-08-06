<template>
    <div class="MedicineCard">
        <el-card class="Medicine-Card hover-card" shadow="hover">
            <el-row>
                <el-col :span="8">
                    <div style="color: gray">编号：{{ medicine.medicine_id }}</div>
                    <img class="img" src="@/assets/连花清瘟.jpg">
                </el-col>
                <el-col :span="13">
                    <el-row class="M_title">{{ medicine.medicine_ch_name }}（{{ medicine.medicine_en_name }}）</el-row>
                    <div class="content">类别：{{ medicine.medicine_category }}</div>
                    <div class="content">厂商：{{ medicine.medicine_manufacturer }}</div>
                    <div class="content">是否医保药：{{ medicine.is_medical_insurance_medicine }}</div>
                    <div class="content">是否处方：{{ medicine.medicine_indications ? "是" : "否" }}</div>
                    <div class="content">适应症：{{ medicine.is_prescription_medicine ? "是" : "否" }}</div>
                </el-col>
                <el-col :span="3">
                    <button class="edit fancy">
                        <span class="shadow"></span>
                        <span class="edit-edge"></span>
                        <span class="edit-front text" @click="ModifyMedicine"> 编辑</span>
                    </button>
                    <button class="delete fancy">
                        <span class="shadow"></span>
                        <span class="edge"></span>
                        <span class="front text" @click="delete_dialog_visible = true"> 删除</span>
                    </button>
                    <el-dialog v-model="delete_dialog_visible" title="警告" width="30%" center
                               :before-close="handleClose">
                        <span style="margin-left: 40px">你确认要删除该药品信息吗? 此操作不可逆！</span>
                        <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="danger" @click="deleteMedicine">
          确认
        </el-button>
      </span>
                        </template>
                    </el-dialog>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>


<script>
//这是个展示药品信息的卡片
// 传入一个对象，至少要有medicine_id、medicine_ch_name、medicine_en_name、medicine_category、medicine_manufacturer、is_prescription_medicine、
// is_medical_insurance_medicine、medicine_indications 这8个属性.
//直接传入medicine对象好了
import {ref} from "vue";
import {ElMessage} from 'element-plus'
import axios from "axios";

export default {
    props: ["medicine"],
    data() {
        return {
            delete_dialog_visible: false,
        };
    },
    methods: {
        ModifyMedicine() {
            this.$router.push({
                path: "/ModifyMedicine",
                query: {
                    medicine_id: this.medicine.medicine_id,
                },
            });
        },
        handleClose() {
            this.delete_dialog_visible = false;
        },
        deleteMedicine() {
            axios.delete('/api/admin/medicine/' + this.medicine.medicine_id)
                .then((res) => {
                    this.delete_dialog_visible = false;
                    console.log(res);
                    if (res.data.data.status) {
                        ElMessage.success("删除成功!");
                        console.log(res.data.data.status);
                        this.$emit("deletesuccess", true);
                    } else {
                        ElMessage.error("删除失败!" + res.data.data.errorCode);
                    }
                })
                .catch(error => {
                    console.log(error);
                    ElMessage.error("删除失败!" + error);
                });
        }
    },


}
</script>


<style scoped>

.MedicineCard {
    margin-top: 20px;
}

.Medicine-Card {
    width: 94%;
    margin: 0 auto;
//border-radius: 20px;
}

.img {
    width: 80%;
    margin-top: 10px;
}

.M_title {
    font-size: 23px;
    margin-top: 10px;
    margin-bottom: 20px;
    font-weight: bold;
}

.content {
    margin-top: 10px;
}

button.fancy {
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
    user-select: none;
    touch-action: manipulation;
}

.shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

.edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(
            to left,
            hsl(340deg 100% 16%) 0%,
            hsl(340deg 100% 32%) 8%,
            hsl(340deg 100% 32%) 92%,
            hsl(340deg 100% 16%) 100%
    );
}

.front {
    display: block;
    position: relative;
    padding: 12px 27px;
    border-radius: 12px;
    font-size: 1.1rem;
    color: white;
    background: hsl(345deg 100% 47%);
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

button:hover {
    filter: brightness(110%);
}

button:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
}

button:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
}

button:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
}

button:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
}

button:focus:not(:focus-visible) {
    outline: none;
}

.delete {
    margin-top: 20px;
    margin-left: 10px;
}

.edit {
    margin-top: 50px;
    margin-left: 10px;
}

.edit-edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(
            to left,
            hsl(340deg 100% 16%) 0%,
            hsl(194, 100%, 22%) 8%,
            hsl(195, 89%, 26%) 92%,
            hsl(340deg 100% 16%) 100%
    );
}

.edit-front {
    display: block;
    position: relative;
    padding: 12px 27px;
    border-radius: 12px;
    font-size: 1.1rem;
    color: white;
    background: hsl(194, 97%, 39%);
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

button:hover .edit-front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
}

button:active .edit-front {
    transform: translateY(-2px);
    transition: transform 34ms;
}

.hover-card:hover {
    border: RGB(0, 147, 191) 0.15em solid;
}

@keyframes fly-1 {
    from {
        transform: translateY(0.1em);
    }

    to {
        transform: translateY(-0.1em);
    }
}
</style>