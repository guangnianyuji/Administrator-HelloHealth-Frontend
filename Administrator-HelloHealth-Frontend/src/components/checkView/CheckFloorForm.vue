<template>
    <el-form>

        <el-form-item label="发布用户:">
            <UserInfoCardSmall :user-name="comment_info.author_name" :avatar-url="comment_info.author_portrait" :user-id="comment_info.author_id"></UserInfoCardSmall>
         </el-form-item>

         <el-form-item label="发布时间">
            {{ comment_info.comment_time }}
        </el-form-item>

        <el-form-item label="所属帖子ID:" v-model="check_info">
            <span>
                {{comment_info.post_id}}
            </span>
            <GoToPostLink :floor_number="comment_info.floor_number" :post_id="comment_info.post_id"></GoToPostLink>
        </el-form-item>

        <el-form-item label="楼层所在层数:" v-model="check_info">
            {{comment_info.floor_number}}
        </el-form-item>
          
         <el-form-item label="楼层发布内容:">
            {{ comment_info.content }}
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
            <el-input v-model="check_info.review_reason" />
        </el-form-item>
     
        <el-form-item  v-if="is_checked" label="审核时间:">
             {{comment_info.review_time}}
        </el-form-item>

        <el-form-item  v-if="is_checked" label="审核原因:">
             {{comment_info.review_reason}}
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
import GoToPostLink from "@/components/checkView/GoToPostLink.vue";

export default{
    components: {GoToPostLink, UserInfoCardSmall},
    props:["comment_info","is_checked"],
    emits:['closeMe','refresh'],
    watch:
        {
            comment_info:function(newData)
            {
                this.check_info.comment_id=newData.comment_id;
                this.check_info.author_id=newData.author_id;
            
            },
           
        },
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
        }
    },


}
</script>
 