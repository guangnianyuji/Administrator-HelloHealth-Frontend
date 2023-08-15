<template>
    <el-form label-width="auto">

        <el-form-item label="发布用户:">
            <UserInfoCardSmall :user-name="comment_info.author_name" :avatar-url="comment_info.author_portrait" :user-id="comment_info.author_id"></UserInfoCardSmall>
         </el-form-item>

         <el-form-item label="发布时间:">
            {{ comment_info.comment_time }}
        </el-form-item>

        <el-form-item label="所属帖子ID:" v-model="check_info">
            <span>
                {{comment_info.post_id}}
            </span>
        </el-form-item>

        <el-form-item label="楼层所在层数:" v-model="check_info">
            {{comment_info.floor_number}}
        </el-form-item>
          
         <el-form-item label="楼层发布内容:">
            <el-button @click="openContent">点击查看内容详情</el-button>
         </el-form-item>

         <el-form-item v-if="!is_checked" label="是否通过:">
                <el-radio-group v-model="check_info.is_passed">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
                
        </el-form-item>

        <el-form-item v-if="is_checked" label="是否通过:">
            <span v-if="comment_info.review_status==1">通过</span>
            <span v-if="comment_info.review_status==0">不通过</span>
        </el-form-item>

        <el-form-item v-if="!is_checked &&!check_info.is_passed" label="是否封禁用户:">
            <el-radio-group v-model="check_info.is_blocked">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
        </el-form-item>

         
        <el-form-item  v-if="!is_checked" label="审核原因:">
            
            <el-input v-model="check_info.review_reason" class="input" placeholder="若不通过，请输入原因"/>
                   
        </el-form-item>
     
        <el-form-item  v-if="is_checked" label="审核时间:">
             {{comment_info.review_time}}
        </el-form-item>

        <el-form-item  v-if="is_checked" label="审核原因:">
             {{comment_info.review_reason}}
        </el-form-item>

  
    </el-form>

        <div  v-if="!is_checked" style="margin-left: 40%;">
             
            <el-button size="large" @click="cancel">
                取消
                
            </el-button>
            <el-button size="large" @click="submit">提交
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                            </svg>       
            
            </el-button>
            
        </div>
 

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
import GoToPostLink from "@/components/checkView/GoToPostLink.vue";
import FancyButton from "@/components/FancyButton.vue";
export default{
    components: {GoToPostLink, UserInfoCardSmall,FancyButton},
    props:["comment_info","is_checked"],
    emits:['closeMe','refresh'],
    data:()=>({
        
        check_info:{
            comment_id:0,
            author_id:0,
            is_passed:true,
            is_blocked:false,
            review_reason:""
        },
    }),
    methods:{
        submit(){
            if(this.check_info.is_passed){
                this.check_info.is_blocked=false;
            }
            axios.post("/api/Check/Floor/Submit",this.check_info)
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
        },
        openContent(){
            console.log("opencontent")
            this.$emit('openContent');
             
        }
    },
    created()
    {
        this.check_info.comment_id=this.comment_info.comment_id;
        this.check_info.author_id=this.comment_info.author_id;
    }


}
</script>
 