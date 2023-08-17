<template>
    <div class="title">
        <el-row>
            <el-col :span="15">
            <div class="forum-title title-with-line" >
            审核论坛楼层发布
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

    <el-table :data="comment_list" border style="width: 100%" height="400" empty-text="暂无发布楼层">
 

        <el-table-column label="发布用户" width="200" align="center">

            <template #default="scope">
                <UserInfoCardSmall :user-name="scope.row.author_name" :avatar-url="scope.row.author_portrait" :user-id="scope.row.author_id"></UserInfoCardSmall>
            </template>
        </el-table-column>

        <el-table-column label="发布时间" width="200" align="center">
            <template #default="scope">
                                   
                {{ scope.row.comment_time }}
                     
            </template>
        </el-table-column>

        <!--已审核-->
        <el-table-column v-if="type_sort.type=='checked'" label="审核管理员ID" align="center">
            <template #default="scope">
                {{ scope.row.administrator_id }}
            </template>
        </el-table-column>
    
        <!--已审核-->
        <el-table-column v-if="type_sort.type=='checked'" width="200" label="审核结果及时间" align="center">
            <template #default="scope">
                 <div v-if="scope.row.review_status=='1'" style="color: #118407a5;">
                    通过
                 </div>
                 <div v-else style="color: #fe0000a5;">
                    不通过
                 </div>
                 <div>
                    {{ scope.row.review_time }}
                </div>
            </template>
        </el-table-column>

        <el-table-column  label="操作" align="center">
            <template #default="scope">
                <FancyButton v-if="type_sort.type==='unchecked'" @click="check(scope.row)">去审核</FancyButton>
                <FancyButton v-else  @click="check(scope.row)">查看详情</FancyButton>
            </template>
        </el-table-column>
       

    </el-table>
    </div>


    <el-dialog
        v-model="checkDialogVisible"
         
        align-center
        title="审核楼层发表"
        width="70%"
        top="0"
        class="checkform"
    >
        <CheckFloorForm v-if="checkDialogVisible" :comment_info="selected_comment" :is_checked="type_sort.type=='checked'" @open-content="openDetail" @refresh="display" @close-me="checkDialogVisible=false"/>
    </el-dialog>

    <el-dialog
        v-model="detailContentVisible"
        width="70%"
        top="0"
        title="内容详情"
        align-center
        >
        <!--用vif unmount和重新mount TipTapEditorReadonly达到每次打开内容都能刷新的目的-->
        <TipTapEditorReadonly v-if="detailContentVisible" :contentJsonString="selected_comment.content"></TipTapEditorReadonly>
        
    </el-dialog>

</template>


<script>
import axios from "axios"; 
import CheckFloorForm from "../components/checkView/CheckFloorForm.vue"
import UserInfoCardSmall from "@/components/UserInfoCardSmall.vue";
import FancyButton from "@/components/FancyButton.vue";
import TipTapEditorReadonly from "@/components/postView/TipTapEditorReadonly.vue";
export default{

    components:
        {
            TipTapEditorReadonly,
            FancyButton,
            UserInfoCardSmall,
            CheckFloorForm 
        },
    data:()=>({
        type_sort:{type:"unchecked"},
        
        comment_list:[],
        checkDialogVisible:false,
        detailContentVisible:false,
        selected_comment: undefined
    }),
    methods:
    {
        check(comment_info){
            axios.post("/api/Check/Floor/Detail",{comment_id:comment_info.comment_id})
            .then((res)=> {
                comment_info.post_id=res.data.data.post_id; 
                comment_info.floor_number=res.data.data.floor_number; 
                comment_info.content=res.data.data.content;    
                this.selected_comment = comment_info;
                this.checkDialogVisible = true
            })
            .catch(error => {
                if(error.network) return;
                error.defaultHandler("获取审核信息出错")
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
                .post("/api/Check/Floor/SortBy", this.type_sort)
                .then((res)=> {
                    this.comment_list= res.data.data.comment_list;
                     
                })

        },
        //防止标题过长
        PostTitleSummary(title){
                if(title.length<10){
                    return title;
                }
                else{
                    return title.slice(0,12)+"...";
                }
            },
        openDetail(){
            console.log("openDetail")
            console.log(this.selected_comment.content)
            this.detailContentVisible=true;
             
        }
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