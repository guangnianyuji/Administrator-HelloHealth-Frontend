<template>
    <div class="title">
        <div class="forum-title title-with-line" >
            审核专业医生认证
        </div>
    </div>

    <div class="bodytable">
    <el-tabs
        v-model="type_sort.type"
        
        @tab-click="sortSwitcher">
        <el-tab-pane  label="未审核" name="unchecked"> </el-tab-pane>
        <el-tab-pane  label="已审核" name="checked"> </el-tab-pane>
             
    </el-tabs>

    

    <el-table :data="doctor_list" border style="width: 100%" height="400" empty-text="暂无医生">
        
        <el-table-column label="申请用户" width="200" align="center">
            <template #default="scope">
                <el-avatar :size="25" :src="scope.row.user_portrait" ></el-avatar>
                    
                {{ scope.row.user_name }}
                     
            </template>
        </el-table-column>

        
        <el-table-column label="申请时间" width="200" align="center" >
            <template #default="scope">
                <div>{{ scope.row.submit_date }}</div>
               
                 
            </template>
        </el-table-column>

        <el-table-column v-if="type_sort.type=='checked'" width="200" label="审核结果" align="center">
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
        <el-table-column v-if="type_sort.type=='checked'" width="200" label="审核管理员ID" align="center">
            <template #default="scope">
                {{ scope.row.administrator_id }}
            </template>
        </el-table-column>
    
        
        <el-table-column  label="操作" align="center">
            <template #default="scope">
            <div style="display: inline-block;" >
            <button v-if="type_sort.type=='unchecked'" class="cssbuttons-io-button" @click="check(scope.row)"> 去审核
                            <div class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path fill="currentColor"
                                          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                                </svg>
                            </div>
            </button>

            <button v-else class="cssbuttons-io-button" @click="check(scope.row)"> 查看详情
                            <div class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path fill="currentColor"
                                          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                                </svg>
                            </div>
            </button>   
            </div>
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
    >
        <CheckDoctorForm :doctor_info="selected_doctor" :is_checked="type_sort.type=='checked'" @refresh="display" @close-me="checkDialogVisible=false"/>
    </el-dialog>

</template>


<script>
import axios from "axios"; 
import CheckDoctorForm from "../components/checkView/CheckDoctorForm.vue"
export default{

    components:
        {
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
                doctor_info.hospital=res.data.data.hospital; 
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
.bodytable{
    margin-top:5% ;
    margin-left: 10%;
    margin-right: 10%;
}

.container svg:hover {
    transform: scale(1.1);
}

.container input:checked ~ svg {
    fill: RGB(253, 190, 45);
}

.cssbuttons-io-button {
    background: RGB(0, 147, 191);
    color: white;
    font-family: inherit;
    padding: 0em;
    padding-left: 1em;
    font-size: 13px;
    font-weight: 400;
    border-radius: 0.9em;
    border: none;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 1.6em -0.6em RGB(0, 147, 191);
    overflow: hidden;
    position: relative;
    height: 2.8em;
    padding-right: 3.1em;
}

.cssbuttons-io-button .icon {
    background: white;
    margin-left: 1em;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.2em;
    width: 2.2em;
    border-radius: 0.7em;
    box-shadow: 0.1em 0.1em 0.6em 0.2em RGB(49,147, 191);
    right: 0.3em;
    transition: all 0.3s;
}

.cssbuttons-io-button:hover .icon {
    width: calc(100% - 0.6em);
}

.cssbuttons-io-button .icon svg {
    width: 1.1em;
    transition: transform 0.3s;
    color: RGB(49, 147, 191);
}

.cssbuttons-io-button:hover .icon svg {
    transform: translateX(0.1em);
}

.cssbuttons-io-button:active .icon {
    transform: scale(0.95);
}

</style>