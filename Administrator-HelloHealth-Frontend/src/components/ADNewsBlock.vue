<!--
管理员端资讯页面中间大块的新闻预览中的一个小新闻块，增加了修改和删除按钮
作者：吴可非、wkq
-->
<template>
  <el-card shadow="hover" class="news-block-card">
    <el-container class="news-block">
      <el-aside width="120px">
        <!-- 新闻图片 -->
        <img
            class="flash-image"
            :src="flash_image"
        />
      </el-aside>
      <el-container>
        <el-header class="flash-header">
          <!-- 新闻标题 -->
          <h1 class="flash-title" @click="goFullContent"
              style="font-weight: bold;">{{ truncatedTitle }}</h1>
          <span class="flash-date">{{ flash_date }}</span>
        </el-header>
        <el-main class="flash-preview">
          <!-- 新闻预览内容 -->
          <p>{{ flash_display_content }}</p>
        </el-main>
        <el-footer class="flash-tags">
          <!-- 新闻标签 -->
          <el-tag size="small"
                  v-for="tag in flash_tags_list"
                  :key="tag">{{ tag }}</el-tag>
        </el-footer>
      </el-container>
    </el-container>

    <div class="news-block-actions" v-if="isMy()">
      <!-- 编辑按钮 -->
      <i class="fi fi-rr-pencil clickable" @click="onEdit"/>
      <div style="width: 10px;"/>
      <!-- 删除按钮 -->
      <i class="fi fi-rr-trash clickable" @click="onDelete"/>
    </div>

  </el-card>
</template>

<script>
import axios from "axios";
import globalData from "@/global/global";

export default {
  name: "ADNewsBlock",
  props: {
    flash_image: String,
    flash_id: Number,
    flash_title: String,
    flash_date: String,
    flash_content: Object,
    flash_tags_list: Array,
    is_editing: Boolean,
    flash_admin: Number,
  },
  computed: {
    truncatedTitle: function() {
      const limit = 15; /* title最大字符数 */
      if (this.flash_title.length > limit) {
        return this.flash_title.substring(0, limit) + '...';
      } else {
        return this.flash_title;
      }
    },
      flash_display_content: function() {
        let contentJson = this.flash_content
        let paragraphs = [];
        if (contentJson && Array.isArray(contentJson.content)) {
          for (const block of contentJson.content) {
            if (block.type === 'paragraph' && Array.isArray(block.content)) {
              let paragraph = block.content.map(node => node.text).join(' ');
              paragraphs.push(paragraph);
            }
          }
        }
        return this.truncateContent(paragraphs.join(' '));
      }
  },
  methods: {
    isMy() {
      return  (this.flash_admin===globalData.userInfo.user_id)
    },
    onEdit() {
      this.$emit('edit', this.$props.flash_id, this.$props.flash_title, this.$props.flash_content, this.$props.flash_tags_list);
      console.log("isMy?",this.flash_admin===globalData.userInfo.user_id)
    },
    onDelete() {
      this.$messageBox.confirm(`是否确定删除新闻:${this.flash_title}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除

        axios.delete(`/api/Flash/delete/${this.flash_id}`)

            .then(res => {
              this.$emit('delete', this.flash_id)
            });
      }).catch(() => {
        // 取消删除
      });
    },
      truncateContent: function(content) {
          const limit = 50; /* preview最大字符数 */
          if (content.length > limit) {
              return content.substring(0, limit) + '...';
          } else {
              return content;
          }
      },
      goFullContent() {
        let newWindow=window.open('about:blank');
        newWindow.location = (globalData.userWebsite + "/news/"+this.$props.flash_id);
        newWindow.focus()
      },
  }
}
</script>

<style scoped>
.news-block-card {
  flex-wrap: wrap;
  margin-bottom: 3px;
}
.news-block-actions {
  display: flex;
  justify-content: right;
}
.news-block {
  height: 120px;
  width: 600px;
}
.flash-image {
  object-fit: fill;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.flash-header {
  display: flex;
  justify-content: space-between;   /* 包含了title和date */
  height: 10px;
}
.flash-title {
  position: relative;
  text-decoration: none;            /* 移除默认的下划线 */
}
.flash-title::after {
  content: "";
  position: absolute;
  left: 0;
  top: 1.2em;                    /* 调整下划线与文字的距离 */
  width: 100%;
  height: 1px;                      /* 设置默认粗细 */
  background-color: #333;
}
.flash-title:hover::after {
  height: 2px;                      /* 鼠标悬停时改变粗细 */
}
.flash-date {
  width: 40%;          /* 日期宽度为 40% */
  text-align: right;   /* 日期右对齐 */
}
.flash-preview {
  height: auto;
}
.flash-tags {
  height: auto;
}
.el-tag {
  margin-right: 5px;  /* 设置标签之间的左间距 */
}
</style>