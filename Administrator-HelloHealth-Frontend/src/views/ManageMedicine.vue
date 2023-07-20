<template>
    <div class="MM_body">
        <el-card class="MM_title">
            <el-row>
                <el-col :span="19">
                    <el-row>
                        <div class="title">药品信息管理</div>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-input style="width: 95%" placeholder="请输入药品名称"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="primary">搜索</el-button>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="gotoAddMedicinePage">添加药品
                                <svg t="1689567480448" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" p-id="4238" width="20" height="20">
                                    <path d="M511.829333 975.725714C242.517333 975.725714 24.210286 757.369905 24.210286 488.106667 24.210286 218.794667 242.517333 0.487619 511.829333 0.487619 781.141333 0.487619 999.448381 218.794667 999.448381 488.106667 999.448381 757.369905 781.141333 975.725714 511.829333 975.725714ZM509.098667 91.428571C290.304 91.428571 120.56381 268.824381 120.56381 487.619048 120.56381 706.413714 290.304 877.714286 509.098667 877.714286 727.942095 877.714286 905.337905 706.413714 905.337905 487.619048 905.337905 268.824381 727.942095 91.428571 509.098667 91.428571ZM707.267048 536.380952C707.267048 536.380952 560.932571 536.380952 560.932571 536.380952 560.932571 536.380952 560.932571 682.715429 560.932571 682.715429 560.932571 709.632 539.136 731.428571 512.219429 731.428571 512.219429 731.428571 512.121905 731.428571 512.121905 731.428571 485.205333 731.428571 463.408762 709.632 463.408762 682.715429 463.408762 682.715429 463.408762 536.380952 463.408762 536.380952 463.408762 536.380952 317.074286 536.380952 317.074286 536.380952 290.157714 536.380952 268.361143 514.584381 268.361143 487.66781 268.361143 487.66781 268.361143 487.570286 268.361143 487.570286 268.361143 460.653714 290.157714 438.857143 317.074286 438.857143 317.074286 438.857143 463.408762 438.857143 463.408762 438.857143 463.408762 438.857143 463.408762 292.522667 463.408762 292.522667 463.408762 265.606095 485.205333 243.809524 512.121905 243.809524 512.121905 243.809524 512.219429 243.809524 512.219429 243.809524 539.136 243.809524 560.932571 265.606095 560.932571 292.522667 560.932571 292.522667 560.932571 438.857143 560.932571 438.857143 560.932571 438.857143 707.267048 438.857143 707.267048 438.857143 734.183619 438.857143 755.98019 460.653714 755.98019 487.570286 755.98019 487.570286 755.98019 487.66781 755.98019 487.66781 755.98019 514.584381 734.183619 536.380952 707.267048 536.380952Z"
                                          fill="#ffffff" p-id="4239"></path>
                                </svg>
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <div class="describe_text">
                            当前药品列表如下，共xx个药品，按名称字典排序：
                        </div>
                    </el-row>
                </el-col>
                <el-col :span="5">
                    <img class="illustration" src="@/assets/7.png">
                </el-col>
            </el-row>
        </el-card>
        <!--        药品卡片-->
        <div class="MedicineCard">
            <el-card class="Medicine-Card hover-card" shadow="hover">
                <el-row>
                    <el-col :span="8">
                        <div style="color: gray">编号：001</div>
                        <img class="img" src="@/assets/连花清瘟.jpg">
                    </el-col>
                    <el-col :span="13">
                        <el-row class="M_title">连花清瘟胶囊（LianHua QingWen JiaoNang）</el-row>
                        <div class="content">类别：中药</div>
                        <div class="content">厂商：石家庄以岭药业股份有限公司</div>
                        <div class="content">是否医保药：是</div>
                        <div class="content">是否处方：否</div>
                        <div class="content">适应症：高热 恶寒 肌肉酸痛 鼻塞 咳嗽 头痛 咽痛 流行性感冒 感冒</div>
                    </el-col>
                    <el-col :span="3">
                        <button class="edit">
                            <span class="shadow"></span>
                            <span class="edit-edge"></span>
                            <span class="edit-front text" @click="gotoModifyMedicinePage"> 编辑</span>
                        </button>
                        <button class="delete">
                            <span class="shadow"></span>
                            <span class="edge"></span>
                            <span class="front text" @click="centerDialogVisible = true"> 删除</span>
                        </button>
                        <el-dialog v-model="centerDialogVisible" title="警告" width="30%" center>
                            <span style="margin-left: 40px">你确认要删除该药品信息吗? 此操作不可逆！</span>
                            <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="centerDialogVisible = false">
          确认
        </el-button>
      </span>
                            </template>
                        </el-dialog>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="MedicineCard">
            <el-card class="Medicine-Card hover-card" shadow="hover">
                <el-row>
                    <el-col :span="8">
                        <div style="color: gray">编号：002</div>
                        <img class="img" src="@/assets/颗粒.jpg">
                    </el-col>
                    <el-col :span="13">
                        <el-row class="M_title">消旋卡多曲颗粒（Racecadotril Granules）</el-row>
                        <div class="content">类别：西药</div>
                        <div class="content">厂商：四川百利药业有限责任公司</div>
                        <div class="content">是否医保药：是</div>
                        <div class="content">是否处方：是</div>
                        <div class="content">适应症：用于1月以上婴儿和儿童的急性腹泻，必要时给予口服补液或静脉补液</div>
                    </el-col>
                    <el-col :span="3">
                        <button class="edit">
                            <span class="shadow"></span>
                            <span class="edit-edge"></span>
                            <span class="edit-front text"> 编辑</span>
                        </button>
                        <button class="delete">
                            <span class="shadow"></span>
                            <span class="edge"></span>
                            <span class="front text"> 删除</span>
                        </button>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <!--        分页-->
        <div class="pagination">
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div>
    </div>
</template>

<script>


import {ref} from "vue";

export default {
    name: "ManageMedicineView",
    data() {
        return {}
    },
    methods: {
        gotoAddMedicinePage() {
            this.$router.replace('/AddMedicine');
        },
        gotoModifyMedicinePage() {
            this.$router.replace('/ModifyMedicine');
        }
    },
    setup() {
        const centerDialogVisible = ref(false)
        return {
            centerDialogVisible
        }

    }
}

</script>

<style>
.MM_body {
    margin: 0 auto;
    width: 90%;
    margin-top: 20px;
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

.icon {
    margin-left: 5px;
}

.describe_text {
    margin-top: 30px;
    color: gray;
}

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
    font-family: 等线;
    margin-top: 10px;
    margin-bottom: 20px;
    font-weight: bold;
}

.content {
    margin-top: 10px;
}

button {
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

.pagination {
    margin-left: 33%;
    margin-top: 20px;
}

.hover-card:hover {
    border: RGB(0, 147, 191) 0.15em solid;
}
</style>