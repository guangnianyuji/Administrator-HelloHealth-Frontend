<template>
  <!--整个页面是可以上下滚动的-->
  <div  class="wrapper">
    <!--展示信息的分栏，分栏1：管理员头像-->
    <div>
      <el-card class="cardStyle">
        <div class="common-layout">
          <el-container>
            <el-aside width="200px">
              <div class="avatar-container">
                <el-avatar :size="100" style="margin-left:30px;margin-top:20px;" fit="contain" :src="isLogin ? administrator.portrait :require('/src/assets/defaultAvatar.png')"></el-avatar>
                <template v-if="isCurrentAdministrator">
                  <el-button class="pic-edit-button" type="primary" icon="el-icon-edit" @click="showPhotoUpload">Edit</el-button>
                  <el-dialog v-model="photoUpload" title="头像上传" width="50%">
                    <div style="text-align: center;">
                      <p>请上传头像</p>
                      <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :auto-upload="false"
                          :on-change="handleChange"
                          accept="image/jpg,image/jpeg,image/png,image/gif"
                      >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">上传文件格式为.jpg、.jpeg、.png、.gif，且不超过 2MB</div>
                      </el-upload>
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="photoUpload = false">取 消</el-button>
                      <el-button type="primary" @click="submitPhoto">确 定</el-button>
                    </div>
                  </el-dialog>
                </template>
              </div>
            </el-aside>
            <el-main>
              <span class="userName">{{ displayName }}</span>
              <el-button v-if="!isLogin" class="login-button" type="primary" @click="goToLoginPage">请登录</el-button>
              <br><br><br>
            </el-main>
          </el-container>
        </div>
      </el-card>
    </div>
    <!--展示信息的分栏，分栏2：基本信息-->
    <div v-if="isLogin">
      <el-card class="cardStyle">
        <el-descriptions
            class="margin-top"
            title="基本信息"
            :column="3"
            :size="size"
            border
        >
          <template #extra v-if="isCurrentAdministrator">
            <!--点“编辑”按钮可以对管理员信息进行编辑-->
            <el-button type="primary"  v-if="!isEdit" @click="edit">编辑</el-button>
            <el-button type="primary" v-if="isEdit" @click="save">保存</el-button>
          </template>
          <template v-if="isAdministrator">
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  工号：
                </div>
              </template>
              <!--从数据库获取管理员的工号-->
                  <span class="idStyle">{{administrator.id}}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  名称：
                </div>
              </template>
              <!--从数据库获取管理员的名称-->
                <span class="idStyle">{{administrator.name}}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  联系方式：
                </div>
              </template>
              <!--从数据库获取管理员的联系方式-->
                <span class="idStyle">{{administrator.telephone}}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  邮箱：
                </div>
              </template>
              <!--从数据库获取管理员的邮箱-->
              <el-input v-model="administrator.email" :disabled="!isEdit"></el-input>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-card>
    </div>

    <!--展示信息的分栏，分栏3：发布的新闻-->
    <div v-if="isLogin && isAdministrator">
      <el-card class="cardStyle">
        <el-descriptions
            class="margin-top"
            title="发布的新闻"
            :column="3"
            :size="size"
            border
        >
        </el-descriptions>
        <el-row v-if="userPosts">
          <ADNewsBlockList :is-editing="false"/>
        </el-row>
      </el-card>
    </div>

  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import axios from "axios"
import globalData from "@/global/global"
import ADNewsBlockList from "@/components/ADNewsBlockList.vue";
export default {
  name: "AdministratorInfoView",

  components: {ADNewsBlockList},

  data(){
    return{
      isAdministrator: true, //是否为管理员
      administrator: {},    //管理员信息
      isLogin :true,    //初始状态未登录
      isEdit:false, //是否允许编辑信息
      dialogVisible:false,    //对话框是否可见
      size:'small',
      file:null, //上传的文件对象
      photoUpload:false,   //头像上传，初始为false
      userPosts: []   // 用户上传的帖子
    }
  },
  mounted() {
    let administratorID = parseInt(this.$route.params.administratorID ? this.$route.params.administratorID: 0);
    if(isNaN(administratorID)){
      this.$router.replace("/error");
      return;
    }
    axios.get('/api/Administrator/Details')
        .then(response => {
          const responseData = response.data.data.administrator;
          this.administrator = responseData
        })
        .catch(error => {
            if(error.network) return;
            switch (error.errorCode){
                case 103:
                    break;
                default:
                    error.defaultHandler("获取登录状态出错")
            }
        });
  },
  computed: {
    displayName() {
      if(this.isLogin) {
        return this.administrator.name;
      } else {
        return '未登录';
      }
    },
    //判断是否是本人在查看信息页面，来判断该管理员是否可对信息进行修改
    isCurrentAdministrator() {
      return !this.$route.params.administratorID;
    }
  },
  methods:{
    showPhotoUpload(){
      //显示上传头像框
      this.photoUpload = true;
    },
    /*跳转到登陆界面*/
    goToLoginPage(){
      this.$router.push('login')
    },
    edit(){
      this.isEdit = true;
    },
    save(){
      // 将修改后的管理员信息保存到数据库
      axios
          .post('/api/Administrator/modifyAdministratorInfo',{email: this.administrator.email})
          .then(response => {
            // 保存成功后将isEdit变量设置为false，禁用编辑模式
                let user_info={
                  //工号，名称，联系方式，邮箱
                  email:this.administrator.email,
                };
                if(response.data.data.status == true){
                  ElMessage({
                    type: "success",
                    message: "修改成功！",
                    duration: 2000,
                    showClose: true,
                  });
                    this.isEdit = false;
                  //store.commit("changePersonInfo", user_info);
                } else {
                  ElMessage({
                    type: "error",
                    message: "修改失败！",
                    duration: 2000,
                    showClose: true,
                  });
                }
          })
          .catch((error) => {
            this.isEdit = false;
            console.error(error);
          });
    },
    handleChange(file,fileList){
      console.log(file,fileList);
      this.file = file.raw
    },
    /*将管理员上传的头像传给后端数据库*/
    submitPhoto(){
      // 创建一个 FormData 对象
      const formData = new FormData();
      formData.append('file', this.file);
      // 发起一个 POST 请求，将 formData 发送给后端服务器
      axios.post("/api/UserInfo/uploadAvatar", formData)
          .then(response => {
            console.log(response.data);
            if(response.data.data.status == true){
              ElMessage.success("更改成功！");
              this.photoUpload = false;
              this.administrator.portrait = response.data.data.url;
              globalData.userInfo.avatar_url = response.data.data.url;
              location.reload()
            }
            else{
              ElMessage.error("更改失败！");
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error("更改失败！");
          });
    },
  }
}

</script>

<style scoped>
/*边框样式设置*/
.cardStyle{
  border-color: white;
  border-width:2px;
  margin-bottom:10px;
  margin-top:10px;
}
/*头像部分的容器设置*/
.avatar-container{
  position:relative;
  display:inline-block;
}
/*用户头像样式*/
.avatar{
  border-radius:50%;
  object-fit: cover;
  margin-top:20px;
  margin-left:20px;
  width:100px;
  height:100px;
}
/*头像编辑按钮的样式设置*/
.pic-edit-button{
  position: absolute;
  bottom: 20px;
  right: 0;
  transform: translate(-50%, 50%);
  border-radius:50%;
  width:25px;
  height:25px;
  background-color: transparent;
  border-color: transparent;
  color:#666666;
}
/*鼠标悬浮在编辑按钮时的样式*/
.pic-edit-button:hover {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #ffffff;
}
/*最上方的大的用户名字样*/
.userName{
  font-size:30px;
  /*font-family: 宋体;*/
  font-weight: bold;
  color:black;
}
/*”请登录“按钮样式*/
.login-button{
  background-color: white;
  color: red;
  border-color: white;
  font-size: 30px;
}
/*弹出的医师认证框的按钮设置*/
.dialog-footer {
  text-align: right;
}
.dialog-footer button:first-child {
  margin-right: 20px;
}

.wrapper{
  position: relative;
  width: 85%;
  margin: 0 auto;
}
/*ID的样式*/
.idStyle{
  margin-right:40px;
}
</style>