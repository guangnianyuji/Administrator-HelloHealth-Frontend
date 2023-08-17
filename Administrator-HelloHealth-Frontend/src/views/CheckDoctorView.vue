<template>
<div class="title">
        <el-row>
            <el-col :span="15">
            <div class="forum-title title-with-line" >
                审核专业医生认证
            </div>
     
         </el-col>

            <el-col :span="4">
                <img src="../assets/8.png "  style="height: 150px">
            </el-col>
        
            </el-row>
        </div>

    <div class="bodyTable">
    <el-tabs
        v-model="type_sort.type"
        
        @tab-click="sortSwitcher">
        <el-tab-pane  label="未审核" name="unchecked"> </el-tab-pane>
        <el-tab-pane  label="已审核" name="checked"> </el-tab-pane>
             
    </el-tabs>

    

    <el-table :data="doctor_list" border style="width: 100%" height="400" empty-text="暂无医生">
        
        <el-table-column label="申请用户" width="200" align="center">
            <template #default="scope">
                <UserInfoCardSmall :avatar-url="scope.row.user_portrait" :user-name="scope.row.user_name" :user-id="scope.row.user_id"></UserInfoCardSmall>
            </template>
        </el-table-column>

        
        <el-table-column label="申请时间" width="200" align="center" >
            <template #default="scope">
                <div>{{ scope.row.submit_date }}</div>
            </template>
        </el-table-column>

        <el-table-column v-if="type_sort.type=='checked'" width="200" label="审核管理员ID" align="center">
            <template #default="scope">
                {{ scope.row.administrator_id }}
            </template>
        </el-table-column>

        <el-table-column v-if="type_sort.type=='checked'" width="200" label="审核结果及时间" align="center">
            <template #default="scope">
                 <div v-if="scope.row.review_status=='1'" style="color: #118407a5;">
                    通过
                 </div>
                 <div v-else style="color: #fe0000a5;">
                    不通过
                 </div>
                 <div>
                    {{ scope.row.review_date }}
                </div>
            </template>
        </el-table-column>
        
    
        
        <el-table-column  label="操作" align="center">
            <template #default="scope">
                <FancyButton v-if="type_sort.type==='unchecked'" @click="check(scope.row)">去审核</FancyButton>
                <FancyButton v-else @click="check(scope.row)">查看详情</FancyButton>
            </template>
        </el-table-column>
       

    </el-table>
    </div>


    <el-dialog
        v-model="checkDialogVisible"
         
        align-center
        title="审核专业医生认证"
        width="70%"
        top="0"
        class="checkform"
    >
        <CheckDoctorForm v-if="checkDialogVisible" :doctor_info="selected_doctor" :is_checked="type_sort.type=='checked'" @refresh="display" @close-me="checkDialogVisible=false"/>
    </el-dialog>

</template>


<script>
import axios from "axios"; 
import CheckDoctorForm from "../components/checkView/CheckDoctorForm.vue"
import FancyButton from "@/components/FancyButton.vue";
import UserInfoCardSmall from "@/components/UserInfoCardSmall.vue";
export default{

    components:
        {
            UserInfoCardSmall,
            FancyButton,
            CheckDoctorForm
        },
    data:()=>({
        type_sort:{type:"unchecked"},
        
        doctor_list:[],
        checkDialogVisible:false,
        selected_doctor:{}
    }),
    methods:
    {
        check(doctor_info){
            axios.post("/api/Check/Doctor/Detail",{doctor_id:doctor_info.doctor_id})
            .then((res)=> {
                doctor_info.certification=res.data.data.certification;    
                doctor_info.license=res.data.data.license; 
                doctor_info.title=res.data.data.title; 
                doctor_info.department=res.data.data.department; 
                doctor_info.hospital_rank=res.data.data.hospital_rank; 
                 
            })
            .then(()=>{
                
                this.selected_doctor=doctor_info;
                this.checkDialogVisible=true;
            })

           
        },
 
        sortSwitcher(res){
            if(res.paneName==this.type_sort.type){
                return;
            }
            this.type_sort.type=res.paneName;
            this.display();
        },
        display(){
            axios
                .post("/api/Check/Doctor/SortBy", this.type_sort)
                .then((res)=> {
                    this.doctor_list= res.data.data.doctor_list;
                     
                })

        },
    },
    created(){
        this.display();
    }

}
</script>


<style scoped>


.title {
    font-size: xx-large;
   margin-left: 10%;
   margin-top:5%;
   font-weight: bold;
}

.forum-title {
    position: relative;
}

.title-with-line:before{
    content:"";
    top:50%;
    width: 1px;
    height: 1.2em;
    display: inline-block;
    position: absolute;
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    border-radius: 2px;
    transform: translate(-16px , -50%);
}
.bodyTable{
    width: 85%;
    margin: 5% auto 0 auto;
}

.container svg:hover {
    transform: scale(1.1);
}

.container input:checked ~ svg {
    fill: RGB(253, 190, 45);
}

</style>