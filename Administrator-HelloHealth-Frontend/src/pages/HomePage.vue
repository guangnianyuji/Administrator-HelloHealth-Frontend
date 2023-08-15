<script setup>

import SearchBox from "@/components/SearchBox.vue";
import LinkButtonWithIcon from "@/components/LinkButtonWithIcon.vue";
import {changeTheme} from "@/assets/changeTheme";
import router from "@/router";
import axios from "axios";
import {onMounted, reactive, ref} from "vue";
import UserInfoCard from "@/components/UserInfoCard.vue";
import globalData from "@/global/global"
import {ElMenuItem, ElMessage, ElSubMenu} from "element-plus";

changeTheme("#0093bf")

function loginButtonClicked () {
    router.push("/login")
}

const menuItemClick = (ke) => {
    router.push(ke.index)
}

const searchStart = (msg) => {
    // TODO 不知道要干什么，先提示一下
    alert("搜索开始！"+msg)
}

const exitButtonClicked = async ()=>{
    await axios.get("/api/Logout")
    window.location.href ="/login";
}

const notificationButtonClicked = () => {
    // TODO 不知道要干什么，先写个切换小红点的代码
    userInfo.unread_notification = !userInfo.unread_notification
}

const avatarClicked = () =>{
    if(isLogin.value){

    }else{
        router.push("/login")
    }
}

const menus = [
    {"title":"个人信息","icon":"fi-rr-user-gear","path":"/adminiInfo"},
    {
        "title":"审核","icon":"fi-rr-memo-circle-check","path":"censorSubMenu",
        "children":[
            {"title":"论坛发布审核","icon":"fi-rr-user-md-chat","path":"/forumCensor"},
            {"title":"专业医生资质审核","icon":"fi-rr-badge","path":"/qualificationVerify"},
        ]
    },
    {"title":"举报处理","icon":"fi-rr-shield","path":"/reportHandle"},
    {"title":"药品信息管理","icon":"fi-rr-capsules","path":"/medicineManagement"},
    {"title":"健康资讯管理","icon":"fi-rr-books","path":"/newsManagement"},
];

let userInfo = reactive({
    data:{
        user_phone:"",
        user_name:"未登录",
        user_id:123456,
        user_group:"none",
        avatar_url:"/src/assets/defaultAvatar.png",
        unread_notification:true,
        verified: false
    }

});

const isLogin = ref(false);

(async ()=>{
    let response = await axios.get("/api/Administrator/Details")

    if(response.data.errorCode!==200) return;
    let responseObj = response.data.data
    isLogin.value = responseObj.isLogin;

    if(!responseObj.isLogin){
        // 管理员没登陆啥都干不了，直接跳到登录界面
        ElMessage.error("登录状态失效，请重新登录。")
        await router.push("/login");
        return;
    }
    globalData.login = true;
    globalData.userInfo = {
        user_id: responseObj.administrator.id,
        user_name: responseObj.administrator.name,
        avatar_url: responseObj.administrator.portrait,
        user_group: "admin"
    }
    userInfo.data = globalData.userInfo
    console.log(globalData.userInfo)
    console.log(responseObj.administrator)
})()

const getSidebarPath = () => {
    let path = router.currentRoute.value.path.split("/")
    if(path.length === 1){
        return ""
    }else{
        return "/" + path[1];
    }


}

const menu = ref();
onMounted(()=>{
    (()=>{
        let menuItemNow = getSidebarPath();
        for(let item of menus){
            if(!item.children) continue;
            for(let child of item.children){
                if(child.path===menuItemNow){
                    menu.value.open(item.path);
                }
            }
        }
    })()
})

</script>

<template>
    <div class="pageWrapper">
        <div class="headerHolder">
            <div class="leftTitle">
                <img alt="" src="../assets/logo.png">
                <SearchBox @searchStart="searchStart"></SearchBox>
            </div>
            <div class="rightTitle" v-if="isLogin">
                <img alt="" src="../assets/titleImg1.png">
                <LinkButtonWithIcon font-color="#fff" text="消息通知" icon="fi-rr-bell" :has-notification="userInfo.unread_notification" @click="notificationButtonClicked"></LinkButtonWithIcon>
                <div class="line">
                </div>
                <LinkButtonWithIcon font-color="#fff" text="退出" icon="" @click="exitButtonClicked"></LinkButtonWithIcon>
            </div>
            <div class="rightTitle" v-if="!isLogin">
                <img alt="" src="../assets/titleImg1.png">

                <LinkButtonWithIcon font-color="#fff" text="点击登录" icon="" @click="loginButtonClicked"></LinkButtonWithIcon>
            </div>
        </div>
        <div class="contentHolder">
            <div class="sideBar">
                <div class="userInfoWrapper">
                    <UserInfoCard :user-info="userInfo.data" showAvatarBorder @click="avatarClicked"></UserInfoCard>
                </div>


                <el-menu :default-active="getSidebarPath()" class="sideBarMenu" ref="menu">
                    <component v-for="item in menus" :is="item.children ? ElSubMenu : ElMenuItem" :index="item.path" v-on="item.children ? {}: {click: menuItemClick}">
                        <template #title>
                            <i class="fi" :class="item.icon"></i>
                            <span>{{item.title}}</span>
                        </template>
                        <el-menu-item v-if="item.children" v-for="child in item.children" :index="child.path" @click="menuItemClick">
                            <i class="fi" :class="child.icon"></i>
                            <span>{{child.title}}</span>
                        </el-menu-item>
                    </component>
                </el-menu>
            </div>

            <div class="content">
                <RouterView></RouterView>
            </div>
        </div>
    </div>
</template>


<style scoped>

.headerHolder{
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    background-color: var(--el-color-primary);
    display: flex;
    justify-content: space-between;
    max-height: 60px;
    flex: 1;
}
.headerHolder>div{
    display: flex;
    align-items: center;
    margin: 0 20px;
}

.pageWrapper{
    height: 100vh;
    width: 100%;
    min-width: 1200px;
    max-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.leftTitle img {
    max-height: 50px;
    margin-right: 20px;
}

.rightTitle img{
    height: 60px;
}

.rightTitle>*{
    margin: 0 10px;
}

.line{
    border-left: #fff 1px solid;
    height: 1em;
    width: 1px;
    margin: 0 5px;
}

.contentHolder{
    display: flex;
    justify-items: stretch;
    flex: 3;
    overflow: hidden;

}


.content{
    overflow-y: auto;
    background-color: var(--el-color-primary-light-9);
    flex: 1;
}

.sideBar{
    width: 230px;
    min-width: 230px;
    max-width: 230px;
    flex: 3;
}

.sideBar .sideBarMenu{
    border-right: none;
}

.sideBar .sideBarMenu i{
    margin-right: 10px;
    font-size: 1.1em;
}

.userInfoWrapper{
    padding: 10px 20px;
    border-bottom: 1px #eee solid;
    cursor: pointer;
}
</style>