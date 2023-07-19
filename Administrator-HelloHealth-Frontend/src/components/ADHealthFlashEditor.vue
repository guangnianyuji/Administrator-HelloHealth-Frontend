<!--
管理员页面的新闻编辑 admin/edit
复用了Post中的dialog
-->
<template>
  <div>新建新闻</div>
  <el-container shadow="hover" class="news-block">
    <el-card class="new-card clickable" @click="onCreateFlash">
      <i class="fi fi-br-plus"></i>
    </el-card>
  </el-container>
  <div>已发布新闻</div>
  <el-container>
    <el-aside>
      <!-- 标签选择器 -->
      <NewsTagSelector @tag-selected="handleTagSelected" />
    </el-aside>
    <el-main>
      <!-- 资讯页面中间大块的新闻预览 -->
      <ADNewsBlockList :selected-tag-id="selectedTagId" @edit="handleEdit"/>
      <!-- :selected-tag-id对应NewsBlockList的props中的selectedTagId -->
    </el-main>
  </el-container>

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
            placeholder="选择2~4个标签"
            style="width: 240px"
            :allow-create="true"
            :filterable="true"
            :multiple-limit="4"
        >
          <el-option
              v-for="tag in this.tags"
              :key="tag.tag_id"
              :label="tag.tag_name"
              :value="tag.tag_id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <TipTapEditable ref="editor"/>
    <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitNewFlash">
                    发布
                </el-button>
            </span>
    </template>
  </el-dialog>


</template>


<script>
import {defineComponent} from 'vue'
import ADNewsBlockList from "@/components/ADNewsBlockList.vue";
import WritePostButton from "@/components/postBoardView/WritePostButton.vue";
import NewsBlockList from "@/components/NewsBlockList.vue";
import NewsTagSelector from "@/components/NewsTagSelector.vue";
import TipTapEditable from "@/components/postView/TipTapEditable.vue";
import {ElMessage} from "element-plus";
import axios from "axios";

export default defineComponent({
  name: "HealthFlashEditor",
  components: {TipTapEditable, NewsTagSelector, NewsBlockList, ADNewsBlockList},
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
    },
    async submitNewFlash() {
      if(this.$refs.editor.editor.state.doc.textContent.length < 15) {
        ElMessage.error('请输入更多内容。');
        return;
      }
      if(this.newFlashInfo.title.length < 5) {
        ElMessage.error('请输入更长的标题。');
        return;
      }
      if(this.newFlashInfo.tags.length < 2) {
        ElMessage.error('请选择更多标签。');
        return;
      }
      this.newFlashInfo.content = JSON.stringify(this.$refs.editor.editor.getJSON())
      let response = await axios.post("/api/sendFlash",this.newFlashInfo)
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
      this.newFlashInfo = {
        flash_being_edited_id:-1,
        title:"",
        content: "",
        tags: []
      }
    }
  },
  mounted() { // mounted 时获取全部标签列表
    axios.get("https://mock.apifox.cn/m1/2961538-0-default/api/childTags")
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
.news-block {
  display: flex;
  justify-content: center;
}
.new-card {
  height: 100px;
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>