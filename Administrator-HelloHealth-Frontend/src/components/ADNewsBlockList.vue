<!--
管理员端资讯页面中间大块的新闻预览
作者：吴可非
-->
<template>
  <el-container class="news-container">
    <el-main>
      <!-- 三个 NewsBlock 组件 -->
      <ADNewsBlock
          v-for="flash in currentNewsList"  :key="flash.id"
          :flash_title="flash.title"
          :flash_date="flash.date"
          :flash_content="flash.content"
          :flash_image="flash.image"
          :flash_tags_list="flash.tags"
          :flash_id="flash.id"
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
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import ADNewsBlock from './ADNewsBlock.vue'
import axios from "axios";
export default {
  name: "ADNewsBlockList",
  components: { ADNewsBlock },
  props: {
    selectedTagId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      newsList: [],  // 全部新闻列表
      page: 1,       // 当前页码
      pageSize: 4,   // 每页新闻数
      total: 0       // 总新闻数
    }
  },
  computed: {
    currentNewsList() {  // 计算当前页新闻列表，自动计算的，不用调用
      if (this.newsList && this.total > 0) {
        let start = (this.page - 1) * this.pageSize;
        let end = start + this.pageSize;
        return this.newsList.slice(start, end);
      } else {
        return []; // 如果 newsList 未定义或为空，返回空数组
      }
    },
  },
  methods: {
    handlePageChange(newPage) {
      this.page = newPage;
      console.log(`page changed`);
    },
    handleDelete(id) {
      this.newsList = this.newsList.filter(n => n.id !== id);
      this.total = this.newsList.length;

      if (this.page > 1 && (this.total - 1) / this.pageSize < this.page - 1) {
        this.page--;
      }
    },
    onEdit(flash_id, title, content, tags) {
      this.$emit('edit', flash_id, title, content, tags);
    },
    getNewsList() {
      const apiUrl = this.selectedTagId
          /* ? `/api/newsByTag?id=${this.selectedTagId}&title=`
          : "/api/newsByTag?id=&title="; 这个应该是不mock的版本 */
          ? "https://mock.apifox.cn/m1/2961538-0-default/api/newsByTag?id=${this.selectedTagId}&title="
          : "https://mock.apifox.cn/m1/2961538-0-default/api/newsByTag?id=&title=";
      axios.get(apiUrl)
          .then(res => {
            this.newsList = res.data.data.newsList;    // 获取全部新闻列表
            this.total = this.newsList.length;         // 总新闻数
          })
    },
    addNews(newNews) {
      this.newsList.push(newNews);
      this.total = this.newsList.length;
    },
    updateNews(newNews) {
      // 在 newsList 中找到相同 id 的新闻，然后进行更新
      for (let i = 0; i < this.newsList.length; i++) {
        if (this.newsList[i].id === newNews.id) {
          this.newsList[i] = newNews;
          break;
        }
      }
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
</style>