<template>
    
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
              v-for="tag in tags"
              :key="tag.tag_id"
              :label="tag.tag_name"
              :value="tag.tag_name"
          />
        </el-select>
      </el-form-item>
      </el-form>
      <TipTapEditableExpert ref="editor" />
        
            <span style="margin-left:50%;" class="dialog-footer">
                <el-button type="primary" @click="submitNewFlash">
                    发布
                </el-button>
            </span>
       
    

</template>

<script>
import WritePostButton from "@/components/postBoardView/WritePostButton.vue";
import TipTapEditableExpert from "@/components/postView/TipTapEditableExpert.vue";
import TipTapEditable from "@/components/postView/TipTapEditable.vue";
import {ElMessage} from "element-plus";
import axios from "axios";
export default{
     
    components: {TipTapEditableExpert, WritePostButton, TipTapEditable},
    props:["NewFlashInfo"],
    emits:["closeMe","refresh"],
    data:()=>({
        newFlashInfo:{},
        tags:[]

    }),
    mounted(){
        
          axios.get("/api/Flash/childTags")
        .then(response => {
          this.tags = response.data.data.tags;
        })
        .catch(error => {
          console.error(error)
        });
 
        if(this.newFlashInfo.flash_being_edited_id===-1){
            this.$refs.editor.editor.commands.clearContent();
        }
        else{
            this.$nextTick(() => {
            this.$refs.editor.editor.commands.setContent(this.newFlashInfo.content);
           });
        }
    },
    created(){
        this.newFlashInfo=this.NewFlashInfo
         
        console.log( this.tags)
    },
    methods:{


    submitNewFlash() {
      if(this.$refs.editor.editor.state.doc.textContent.length < 15) {

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

      this.newFlashInfo.content = this.$refs.editor.editor.getJSON();
      console.log(this.newFlashInfo.content)
        axios.post("/api/Flash/sendFlash",
            {
                content: JSON.stringify(this.$refs.editor.editor.getJSON()),
                flash_being_edited_id: this.newFlashInfo.flash_being_edited_id,
                tags: this.newFlashInfo.tags,
                title:this.newFlashInfo.title
            })
            .then(res => {
                ElMessage.success('发送成功。');
                this.$emit('closeMe')
                
                let newNews = {
                    id: this.newFlashInfo.flash_being_edited_id,
                    title: this.newFlashInfo.title,
                    content: this.newFlashInfo.content,
                    tags: this.newFlashInfo.tags,
                };
                this.$emit('refresh',newNews)
                console.log("116")
                // if (newNews.id === -1) {
                //     // 如果是新建新闻，调用 addNews
                //     this.$refs.newsBlockListInstance.addNews(newNews);
                // } else {
                //     // 如果是编辑新闻，调用 updateNews
                //     this.$refs.newsBlockListInstance.updateNews(newNews);
                // }
                 
                this.$refs.editor.editor.commands.clearContent();
            })
            .catch(error => {
                if(error.network) return;
                switch (error.errorCode){
                    case 400:
                        ElMessage.error('选择的标签数量有误');
                        break;
                    default:
                        error.defaultHandler("资讯发送失败")
                }
            })
        }
      }
}

</script>


