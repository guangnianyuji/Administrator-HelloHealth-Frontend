<template>
    <el-form label-width="auto" :model="check_info" :rules="doctorrule" ref="doctorform">
 
        <el-form-item label="申请用户:">
            <UserInfoCardSmall :avatar-url="applydoctor_info.user_portrait" :user-name="applydoctor_info.user_name" :user-id="applydoctor_info.user_id"></UserInfoCardSmall>
         </el-form-item>

         <el-form-item label="申请时间:">
            {{ applydoctor_info.submit_time }}
        </el-form-item>
          
         <el-form-item label="执业医师资格证:">
            <img :src="applydoctor_info.certification">
         </el-form-item>
         <el-form-item label="执业医师执业证:">
            <img :src="applydoctor_info.license">
         </el-form-item>

         <el-form-item v-if="is_checked" label="医生职称:">
            {{applydoctor_info.title}}
             
         </el-form-item>

         <el-form-item v-if="!is_checked" label="医生职称:" 
         prop="doctor_title">
            <el-input v-model="check_info.doctor_title" class="input" placeholder="请输入医生职称"/>    
         </el-form-item> 

         <el-form-item v-if="is_checked" label="医生所属科室:">
            {{applydoctor_info.department}}
             
         </el-form-item>

         <el-form-item v-if="!is_checked" label="医生所属科室:"
         prop="doctor_department">
            <el-input v-model="check_info.doctor_department" class="input" placeholder="请输入医生所属科室"/>    
         </el-form-item> 


         <el-form-item v-if="is_checked" label="医生所在医院级别:">
            {{applydoctor_info.hospital_rank}}
             
         </el-form-item>

         <el-form-item v-if="!is_checked" label="医生所在医院级别:"
         prop="doctor_hospital_rank">
            <el-input v-model="check_info.doctor_hospital_rank" class="input" placeholder="请输入医生所在医院级别"/>    
         </el-form-item> 

         <el-form-item v-if="!is_checked" label="是否通过:">
                <el-radio-group v-model="check_info.is_passed">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
                
        </el-form-item>

        <el-form-item v-if="is_checked" label="是否通过:">
            <span v-if="applydoctor_info.review_status==1">通过</span>
            <span v-if="applydoctor_info.review_status==0">不通过</span>
        </el-form-item>

         
        <el-form-item  v-if="!is_checked" label="审核原因:">
            <el-input v-model="check_info.reason" class="input" placeholder="若不通过，请输入原因"/>
        </el-form-item>
     
        <el-form-item  v-if="is_checked" label="审核时间:">
             {{applydoctor_info.review_time}}
        </el-form-item>

        <el-form-item  v-if="is_checked" label="审核原因:">
             {{applydoctor_info.review_reason}}
        </el-form-item>

  
    </el-form>

        <span style="margin-left: 40%;" v-if="!is_checked">
            <el-button @click="cancel">取消</el-button>
            <el-button @click="submit">提交
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                            </svg>     
            </el-button>
        </span>
 

</template>

<style scoped>
.input {
    font-size: 1em;
    width: 70%;
    padding: 0.6em 1em;
    border: none;
    border-radius: 6px;
    background-color: #f8f8f8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

}

.input:hover {
    background-color: #f2f2f2;
}

.input:focus {
    outline: none;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input::placeholder {
    color: #999;
}
</style>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

import UserInfoCardSmall from "@/components/UserInfoCardSmall.vue";
export default{
    components: {UserInfoCardSmall},
    props:["applydoctor_info","is_checked"],
    emits:['closeMe','refresh'],
    data:()=>({
       
        doctorrule:{
            doctor_title:[
                {required:true,message:'医生职称不能为空',trigger:'blur'},
            ],
            doctor_department:[
                {required:true,message:'医生所属科室不能为空',trigger:'blur'},
            ],
            doctor_hospital_rank:[
                {required:true,message:'医生所在医院等级不能为空',trigger:'blur'},
            ],
        },
        check_info:{
            apply_id:0,
            is_passed:true,
            reason:"",
            doctor_title:"",
            doctor_department:"",
            doctor_hospital_rank:""
        },
    }),
    methods:{
        ssubmit() {
            axios.post("/api/Check/Doctor/Submit",this.check_info)
            .then((res)=> {
            let responseObj = res.data;
            if(responseObj.errorCode!==200) {
                ElMessage.error('审核信息发送失败，错误码：' + responseObj.errorCode);
                this.$emit('closeMe');
                return;
            }
            if(responseObj.data.status!==true) {
                ElMessage.error('审核信息发送失败,请重试');
                this.$emit('closeMe'); 
                return;
            }
            ElMessage.success('审核信息发送成功。')
            this.$emit('closeMe'); 
            this.$emit('refresh'); 
        }
        
        );
        },

        submit(){
            
            if(this.check_info.is_passed){
                this.$refs.doctorform.validate((valid) =>{
                    if(!valid){
                        ElMessage.error('请完善表单相关信息！');
                        return;
                    }
                    this.ssubmit();
              })
            }
            else{
                this.ssubmit()
            }         
        },
        cancel(){
            this.$emit('closeMe');    
        }
    },
    created()
    {
        this.check_info.apply_id=this.applydoctor_info.apply_id;
        this.check_info.user_id=this.applydoctor_info.user_id;
    }


}
</script>
 