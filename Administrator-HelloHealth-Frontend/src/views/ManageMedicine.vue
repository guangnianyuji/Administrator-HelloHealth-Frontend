<template>
    <div
            class="school-center-layout"
            v-loading.fullscreen.lock="isLoading"
            element-loading-text="正在加载"
    />
    <div class="MM_body">
        <el-card class="MM_title">
            <el-row>
                <el-col :span="19">
                    <el-row>
                        <div class="title">药品信息管理</div>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-input style="width: 95%" v-model.change="this.search_value" clearable @change="search" placeholder="请输入药品中文名称"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="primary" @click="search">搜索</el-button>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="gotoAddMedicinePage">
                                <span>添加药品</span>
                                <i class="fi fi-rr-add centerIcon"></i>
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <div class="describe_text">
                            当前药品列表如下，共{{ this.all_num }}个药品：
                        </div>
                    </el-row>
                </el-col>
                <el-col :span="5">
                    <img class="illustration" src="@/assets/7.png">
                </el-col>
            </el-row>
        </el-card>

        <!--        药品卡片-->
        <div v-for="(medicine, index) in page_list" :key="medicine.medicine_id">
            <medicine-info-card
                    :medicine="medicine"
                    @deletesuccess="removeFromList(index)"
            ></medicine-info-card>
            <br/>
        </div>
<!--            如果没有药品-->
            <div v-if="page_list.length === 0" class="no_medicine">
                <el-card>暂无药品信息</el-card>
            </div>


        <!--        分页-->
        <div class="pagination">
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="PAGESIZE"
                    :total="all_num"
                    @current-change="curChange"/>
        </div>
    </div>
</template>

<script>
import MedicineInfoCard from "@/components/MedicineInfoCard.vue";
import axios from "axios";
import {ref} from "vue";

export default {
    name: "ManageMedicineView",
    components: {MedicineInfoCard},
    data() {
        return {
            cur_page: 1,
            page_num: 90,
            PAGESIZE: 2,
            all_num: 0,//总药品个数
            medicine_list: [
                {
                    medicine_id: '001',
                    medicine_ch_name: '连花清瘟胶囊',
                    medicine_en_name: 'LianHua QingWen JiaoNang',
                    medicine_category: '中药',
                    medicine_abbreviation: '5',
                    medicine_introduction: '6',
                    medicine_country: '7',
                    medicine_manufacturer: '石家庄以岭药业股份有限公司',
                    medicine_form: '9',
                    medicine_character: '1',
                    medicine_ingredient: '2',
                    medicine_validityperiod: '3',
                    medicine_usage: '4',
                    medicine_indications: '高热 恶寒 肌肉酸痛 鼻塞 咳嗽 头痛 咽痛 流行性感冒 感冒',
                    medicine_taboo: '6',
                    medicine_storage: '8',
                    is_prescription_medicine: true,
                    is_medical_insurance_medicine: false,
                    medicine_image: null,
                },
                {
                    medicine_id: '002',
                    medicine_ch_name: '消旋卡多曲颗粒',
                    medicine_en_name: 'Racecadotril Granules',
                    medicine_category: '西药',
                    medicine_abbreviation: 'd',
                    medicine_introduction: '6',
                    medicine_country: '7',
                    medicine_manufacturer: '四川百利药业有限责任公司',
                    medicine_form: '9',
                    medicine_character: '1',
                    medicine_ingredient: '2',
                    medicine_validityperiod: '3',
                    medicine_usage: '4',
                    medicine_indications: '用于1月以上婴儿和儿童的急性腹泻，必要时给予口服补液或静脉补液',
                    medicine_taboo: '6',
                    medicine_storage: '8',
                    is_prescription_medicine: true,
                    is_medical_insurance_medicine: true,
                    medicine_image: null,
                },
            ], //经过筛选条件后下面展示的药品
            all_medicine_list: [], //最初赋值获得的所有药品
            page_list:[],//当前页面的药品列表
            search_value: "",
            isLoading: false,

        }
    },
    methods: {
        search(){
            this.isLoading=true;
            // 根据输入的药品名称进行搜索
            // 如果输入为空，则显示所有药品
            if (this.search_value === "") {
                this.medicine_list = this.all_medicine_list;
                this.all_num = this.medicine_list.length;this.page_num = Math.ceil(this.all_num / this.PAGESIZE); //向上取整
                this.page_list = this.medicine_list.slice((this.cur_page - 1) * this.PAGESIZE, this.cur_page * this.PAGESIZE);
                this.isLoading=false;
            }
            else{// 否则，根据输入的药品名称进行搜索
                this.medicine_list = this.all_medicine_list.filter((medicine) => {
                    return medicine.medicine_ch_name.includes(this.search_value)?true:false;//该药品中文名是否包含输入的文字
                });
                this.all_num = this.medicine_list.length;
                this.page_num = Math.ceil(this.all_num / this.PAGESIZE); //向上取整
                this.page_list = this.medicine_list.slice((this.cur_page - 1) * this.PAGESIZE, this.cur_page * this.PAGESIZE);
                this.isLoading=false;
                console.log("筛选后的药品列表：");
                console.log(this.medicine_list);
            }
        },
        curChange(res) {
            this.cur_page = res;
            this.page_list = this.medicine_list.slice((this.cur_page - 1) * this.PAGESIZE, this.cur_page * this.PAGESIZE);
        },
        gotoAddMedicinePage() {
            this.$router.push('/AddMedicine');
        },
        gotoModifyMedicinePage() {
            this.$router.push('/ModifyMedicine');
        },
        removeFromList(index) {//删除药品
            // 根据传入的page和index计算出在medicine_list中的index
            let real_index = (this.cur_page - 1) * this.PAGESIZE + index;
            console.log("删除的药品在medicine_list中的index为：" + real_index);
            // 从medicine_list中删除该药品
            this.medicine_list.splice(real_index, 1);
            console.log("删除后的药品列表：");
            console.log(this.medicine_list);
            this.curChange(this.cur_page);
            this.all_num--;
        },
        refresh(){
            console.log("我更新了！")
            this.isLoading = true
            axios({
                url: "/api/Administrator/medicineList",
                method: "get",
            }).then((res) => {
                console.log("已获取到数据");
                this.all_num = res.data.data.medicineBasicInfoList.length;//药品数组长度
                this.page_num = Math.ceil(this.all_num / this.PAGESIZE); //向上取整
                this.all_medicine_list = res.data.data.medicineBasicInfoList;
                //this.medicine_list = this.all_medicine_list.slice((this.cur_page - 1) * this.PAGESIZE, this.cur_page * this.PAGESIZE);
                this.medicine_list =this.all_medicine_list;//一开始没有任何筛选条件时
                console.log("所有药品列表：");
                console.log(this.medicine_list);
                this.page_list = this.medicine_list.slice((this.cur_page - 1) * this.PAGESIZE, this.cur_page * this.PAGESIZE);
                this.isLoading = false;
            });
        },
    },
    created() {//页面初始化时获取数据，获取全部的药品列表
        this.refresh();
    },
}
</script>

<style scoped>
.MM_body {
    margin: 20px auto;
    width: 90%;
}

.MM_title {
    border-radius: 10px;
}

.title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
}

.illustration {
    width: 100%;
    height: 100%;
}


.describe_text {
    margin-top: 30px;
    color: gray;
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

button:hover .edit-front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
}

button:active .edit-front {
    transform: translateY(-2px);
    transition: transform 34ms;
}

.pagination {
    margin-left: 45%;
    margin-top: 20px;
}

.hover-card:hover {
    border: RGB(0, 147, 191) 0.15em solid;
}

.centerIcon {
    margin: 0 0 0 5px;
}
.no_medicine{
    margin-top: 20px;
    font-size: 20px;
    color: gray;
    text-align: center;
    animation: fly-1 1s infinite alternate;
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