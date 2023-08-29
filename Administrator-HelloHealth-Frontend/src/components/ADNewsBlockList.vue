<!--
管理员端资讯页面中间大块的新闻预览
作者：吴可非
-->
<template>
  <el-container class="news-container">
    <el-main>
      <el-row class="result_title">
        <el-col >
          <el-input
              v-model="input"
              class="search-box"
              placeholder="根据关键词查找新闻"
              :suffix-icon="Search"
          />
        </el-col>
      </el-row>
      <!-- 三个 NewsBlock 组件 -->
      <ADNewsBlock
          v-for="flash in currentNewsList"  :key="flash.id"
          :flash_title="flash.title"
          :flash_date="flash.time"
          :flash_image="flash.image"
          :flash_content="flash.content"
          :flash_tags_list="flash.tags"
          :flash_id="flash.id"
          :is_editing="isEditing"
          :flash_admin="flash.admin_id"
          @delete="handleDelete"
          @edit="onEdit"
      />
    </el-main>
    <el-footer>
      <!-- 分页组件 -->
      <el-pagination
          background
          v-model:page="page"
          :page-size="pageSize"
          :total="+filteredNewsListTotal"
          layout="prev, pager, next"
          @current-change="handlePageChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import ADNewsBlock from './ADNewsBlock.vue'
import axios from "axios";
import {Search} from "@element-plus/icons-vue";
export default {
  name: "ADNewsBlockList",
  components: { ADNewsBlock },
  props: {
    selectedTagId: {
      type: Number,
      default: null,
    },
      isEditing: Boolean
  },
    emits: ['edit'],
  data() {
    return {
      newsList: [],  // 全部新闻列表
      page: 1,       // 当前页码
      pageSize: 4,   // 每页新闻数
      input: ""
    }
  },
  computed: {
    Search() {
      return Search
    },
    currentNewsList() {
      if (this.filteredNewsList && this.filteredNewsListTotal > 0) {
        let start = (this.page - 1) * this.pageSize;
        let end = start + this.pageSize;
        return this.filteredNewsList.slice(start, end);
      } else {
        return [];
      }
    },
    filteredNewsList() {
      if (!this.input) {
        return this.newsList;
      }
      const keyword = this.input.toLowerCase();
      return this.newsList.filter(news => news.title.toLowerCase().includes(keyword));
    },
    filteredNewsListTotal() {
      return this.filteredNewsList.length;
    },
  },
  methods: {
    handlePageChange(newPage) {
      this.page = newPage;
      console.log(`page changed`);
    },
    handleDelete(id) {
      this.newsList = this.newsList.filter(n => n.id !== id);

      if (this.page > 1 && (this.filteredNewsListTotal - 1) / this.pageSize < this.page - 1) {
        this.page--;
      }
    },
    onEdit(flash_id, title, json, tags) {
      this.$emit('edit', flash_id, title, json, tags);
    },
    getNewsList() {
        // 通过my来获取属于当前管理员的资讯
      const apiUrl = this.selectedTagId
          ? `/api/Flash/newsByTag/${this.selectedTagId}`
          : "/api/Flash/newsByTag/-1";
      axios.get(apiUrl,{params:{"my":!this.isEditing}})
          .then(res => {
              for(let news of res.data.data.newsList){
                  news.content = JSON.parse(news.content)
              }
              this.newsList = res.data.data.newsList;    // 获取全部新闻列表
          })
    },
    addNews(newNews) {
      this.newsList.push(newNews);
      this.getNewsList();
    },
    updateNews(newNews) {
      // 在 newsList 中找到相同 id 的新闻，然后进行更新
      for (let i = 0; i < this.newsList.length; i++) {
        if (this.newsList[i].id === newNews.id) {
          this.newsList[i] = newNews;
          break;
        }
      }
      this.getNewsList();
    },
  },
  mounted() {  // mounted 时获取全部新闻列表
    this.getNewsList()
  },
  watch: {
    selectedTagId() {
      this.page = 1; // 重置页码
      this.getNewsList();
    },
  },
}
</script>

<style scoped>
.news-container {
  width: auto;
  display: flex;
  align-items: center;
}
.search-box {
  padding-bottom: 1%;
}
</style>