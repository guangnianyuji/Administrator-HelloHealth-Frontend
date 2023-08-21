<!--
管理员页面的新闻编辑
复用了Post中的dialog
-->
<template>
  <div class="view-wrapper">
<!--    <div class="title">-->
<!--        <div class="forum-title title-with-line" >-->
<!--          新建资讯-->
<!--        </div>-->
<!--    </div>-->
<!--    <el-container shadow="hover" class="news-block">-->
<!--      <el-card class="new-card clickable" @click="onCreateFlash">-->
<!--        <i class="fi fi-br-plus"></i>-->
<!--      </el-card>-->
<!--    </el-container>-->
    <WritePostButton @click="onCreateFlash"></WritePostButton>
    <div class="title">
        <div class="forum-title title-with-line" >
          管理资讯
        </div>
    </div>
    <div class="manage-wrapper">
      <div class="left">
        <!-- 标签选择器 -->
        <NewsTagSelector @tag-selected="handleTagSelected" style="width: min-content;"/>
      </div>
    <div class="right">
      <!-- 资讯页面中间大块的新闻预览 -->
      <ADNewsBlockList :selected-tag-id="selectedTagId" @edit="handleEdit"
                       ref="newsBlockListInstance"/>
      <!-- :selected-tag-id对应NewsBlockList的props中的selectedTagId -->
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      class="editorDialog"
      modal-class="editorDialogModal"
      title="发布资讯"
      width="70%"
      top="0"
    >
    <el-form label-width="50px" label-position="left" :model="newFlashInfo">
      <el-form-item label="标题">
        <el-input v-model="newFlashInfo.title" />
      </el-form-item>
      <el-form-item label="标签">
        <el-select
            class="tagSelector"
            v-model="newFlashInfo.tags"
            multiple
            placeholder="选择1~4个标签"
            style="width: 100%"
            :filterable="true"
            :multiple-limit="4"
        >
          <el-option
              v-for="tag in this.tags"
              :key="tag.tag_id"
              :label="tag.tag_name"
              :value="tag.tag_name"
          />
        </el-select>
      </el-form-item>
      </el-form>
      <TipTapEditable ref="editor" />
      <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitNewFlash">
                    发布
                </el-button>
            </span>
      </template>
    </el-dialog>
  </div>
  


</template>


<script>
import {defineComponent} from 'vue'
import ADNewsBlockList from "@/components/ADNewsBlockList.vue";
import NewsTagSelector from "@/components/NewsTagSelector.vue";
import TipTapEditable from "@/components/postView/TipTapEditable.vue";
import {ElMessage} from "element-plus";
import axios from "axios";
import WritePostButton from "@/components/postBoardView/WritePostButton.vue";

export default defineComponent({
  name: "FlashEditorView",
  components: {WritePostButton, TipTapEditable, NewsTagSelector, ADNewsBlockList},
  data() {
    return {
      selectedTagId: null,
      dialogVisible: false,
      newFlashInfo: {
        flash_being_edited_id: -1,
        title:"",
        content: "",
        tags: []
      },
      tags: [],
    }
  },
  methods: {
    onCreateFlash(){
      this.dialogVisible=true;
      this.newFlashInfo = {
        flash_being_edited_id: -1,
        title:"",
        content: "",
        tags: []
      };
      this.$refs.editor.editor.commands.clearContent();
    },
    handleTagSelected(tagId) {
      this.selectedTagId = tagId;
    },
    handleEdit(flash_id, title, content, tags) {
      this.dialogVisible = true;
      this.newFlashInfo = {
        flash_being_edited_id: flash_id,
        title: title,
        content: content,
        tags: tags
      };
      // 一旦对话框打开，直接设置内容
      this.$nextTick(() => {
        let contentJson = JSON.parse(content);  // 将字符串解析为 JSON 对象
        this.$refs.editor.editor.commands.setContent(contentJson);
      });
    },
    async submitNewFlash() {
      if(this.$refs.editor.editor.state.doc.textContent.length < 5) {
        ElMessage.error('请输入更多内容。');
        return;
      }
      if(this.newFlashInfo.title.length < 5) {
        ElMessage.error('请输入更长的标题。');
        return;
      }
      if(this.newFlashInfo.tags.length < 1) {
        ElMessage.error('请选择更多标签。');
        return;
      }
      this.newFlashInfo.content = JSON.stringify(this.$refs.editor.editor.getJSON())

      let response = await axios.post("/api/Flash/sendFlash",this.newFlashInfo)
      let responseObj = response.data;
      if(responseObj.errorCode!==200) {
        ElMessage.error('发送失败，错误码：' + responseObj.errorCode);
        return;
      }
      if(responseObj.data.status!==true) {
        ElMessage.error('发送失败：' + responseObj.data.msg);
        return;
      }
      ElMessage.success('发送成功。');
      this.dialogVisible = false;
      this.$refs.editor.editor.commands.clearContent();

      const newNews = {
        id: this.newFlashInfo.flash_being_edited_id,
        image: this.getCoverImageUrl(this.newFlashInfo.content),
        title: this.newFlashInfo.title,
        content: this.newFlashInfo.content,
        tags: this.newFlashInfo.tags,
      };

      if (newNews.id === -1) {
        // 如果是新建新闻，调用 addNews
        this.$refs.newsBlockListInstance.addNews(newNews);
      } else {
        // 如果是编辑新闻，调用 updateNews
        this.$refs.newsBlockListInstance.updateNews(newNews);
      }
      this.$refs.editor.editor.commands.clearContent();
    },
    getCoverImageUrl(contentJson) {
      contentJson = JSON.parse(contentJson);
      if (contentJson && Array.isArray(contentJson.content)) {
        for (const contentObj of contentJson.content) {
          if (contentObj.type === 'image') {
            return contentObj.attrs.src;
          }
        }
      }
      return '';
    },
  },
  mounted() { // mounted 时获取全部标签列表
    axios.get("/api/Flash/childTags")
        .then(response => {
          this.tags = response.data.data.tags;
        })
        .catch(error => {
          console.error(error)
        });
  }
})
</script>

<style scoped>
.view-wrapper{
  margin-left: 5%;

}
.title {
   font-size: 30px;
   margin-left: 5%;
   margin-top:3%;
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
.manage-wrapper{
  width:fit-content;
  display: flex;
  flex-direction: row;
}

.manage-wrapper .left{
  padding-top: 1%;
  padding-left: 5%;
  width: auto;
  padding-right: 0%;
}
.manage-wrapper .right{
  padding-top: 0%;
  margin-left: 4%;
  width:auto;
}
</style>