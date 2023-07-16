<template>
    <el-form>

        <el-form-item label="发布用户:">
            <UserInfoCardSmall :avatar-url="report_info.author_portrait" :user-name="report_info.author_name" :user-id="report_info.author_id"></UserInfoCardSmall>
         </el-form-item>

         <el-form-item label="发布时间:">
            {{ report_info.report_time }}
        </el-form-item>

        <el-form-item label="举报用户:">
            <UserInfoCardSmall :avatar-url="report_info.user_portrait" :user-name="report_info.user_name" :user-id="report_info.user_id"></UserInfoCardSmall>
         </el-form-item>

         <el-form-item label="举报时间">
            {{ report_info.report_time }}
        </el-form-item>

        <el-form-item label="所属帖子ID:" >
            <div>
                {{report_info.post_id}}
            </div>

            <GoToPostLink :floor_number="report_info.floor_number" :post_id="report_info.post_id"></GoToPostLink>
        </el-form-item>

        <el-form-item label="所属帖子标题:"  >
            {{report_info.post_title}}
        </el-form-item>

        <el-form-item label="楼层所在层数:"  >
            {{report_info.floor_number}}
        </el-form-item>
          
         <el-form-item label="举报内容:">
            {{ report_info.content }}
         </el-form-item>



         <el-form-item v-if="!is_checked" label="是否删除原评论内容:">
                <el-radio-group v-model="check_info.is_deleted">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
                
        </el-form-item>


        <el-form-item v-if="!is_checked" label="是否封禁用户:">
            <el-radio-group v-model="check_info.is_blocked">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
        </el-form-item>

         
        <el-form-item  v-if="!is_checked" label="处理原因:">
            <el-input v-model="check_info.report_respond" />
        </el-form-item>
     
        <el-form-item  v-if="is_checked" label="处理时间:">
             {{report_info.report_back_time}}
        </el-form-item>

        <el-form-item  v-if="is_checked" label="处理原因:">
             {{report_info.report_respond}}
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
    props:["report_info","is_checked"],
    emits:['closeMe','refresh'],
    watch:
        {
            report_info:function(newData)
            {
                this.check_info.report_id=newData.report_id;
                 
            },
           
        },
    data:()=>({
        check_info:{
            report_id:0,
            is_deleted:false,
            is_blocked:false,
            report_respond:""
        }
    }),
    methods:{
        submit(){
 
            axios.post("/api/Check/Report/Submit",this.check_info)
            .then((res)=> {
            let responseObj = res.data;
            if(responseObj.errorCode!==200) {
                ElMessage.error('举报处理信息发送失败，错误码：' + responseObj.errorCode);
                this.$emit('closeMe');
                return;
            }
            if(responseObj.data.status!==true) {
                ElMessage.error('举报处理信息发送失败,请重试');
                this.$emit('closeMe'); 
                return;
            }
            ElMessage.success('举报处理信息发送成功。')
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
 