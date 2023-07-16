<template>
    <el-form>
 
        <el-form-item label="申请用户:">
            <UserInfoCardSmall :avatar-url="doctor_info.user_portrait" :user-name="doctor_info.user_name" :user-id="doctor_info.user_id"></UserInfoCardSmall>
         </el-form-item>

         <el-form-item label="申请时间">
            {{ doctor_info.submit_date }}
        </el-form-item>
          
         <el-form-item label="执业医师资格证:">
            <img :src="doctor_info.certification">
         </el-form-item>
         <el-form-item label="执业医师执业证:">
            <img :src="doctor_info.license">
         </el-form-item>
         <el-form-item label="医生职称:">
            {{doctor_info.title}}
             
         </el-form-item>
         <el-form-item label="医生所在医院:">
            {{doctor_info.hospital}}
             
         </el-form-item>
         <el-form-item label="医生所在医院级别:">
            {{doctor_info.hospital_rank}}
             
         </el-form-item>

         <el-form-item v-if="!is_checked" label="是否通过:">
                <el-radio-group v-model="check_info.is_passed">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
                
        </el-form-item>

        <el-form-item v-if="is_checked" label="是否通过:">
            <span v-if="doctor_info.review_status==1">通过</span>
            <span v-if="doctor_info.review_status==0">不通过</span>
        </el-form-item>

         
        <el-form-item  v-if="!is_checked" label="审核原因:">
            <el-input v-model="check_info.reason" />
        </el-form-item>
     
        <el-form-item  v-if="is_checked" label="审核时间:">
             {{doctor_info.review_date}}
        </el-form-item>

        <el-form-item  v-if="is_checked" label="审核原因:">
             {{doctor_info.review_reason}}
        </el-form-item>

  
    </el-form>

        <span class="dialog-footer" v-if="!is_checked">
            <el-button @click="cancel">取消</el-button>
            <el-button @click="submit">提交</el-button>
        </span>
 

</template>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
 
</style>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import UserInfoCardSmall from "@/components/UserInfoCardSmall.vue";
export default{
    components: {UserInfoCardSmall},
    props:["doctor_info","is_checked"],
    emits:['closeMe','refresh'],
    watch:
        {
            doctor_info:function(newData)
            {
                this.check_info.post_id=newData.post_id;
                this.check_info.user_id=newData.user_id;
            
            },
           
        },
    data:()=>({
        
        check_info:{
            doctor_id:0,
            user_id:0,
            is_passed:true,
            reason:""
        },
    }),
    methods:{
        submit(){

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
        });
            
        },
        cancel(){
            this.$emit('closeMe');    
        }
    },


}
</script>
 