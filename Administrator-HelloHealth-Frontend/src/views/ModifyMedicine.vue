<template>
    <div class="AM_body">
        <el-card class="AM_title">
            <el-row>
                <el-col :span="18">

                    <el-row>
                        <div class="title">编辑药品信息</div>
                    </el-row>

                    <el-row>
                        <div class="annotation">请修改药品信息</div>
                    </el-row>
                    <br>
                    <el-row>
                        <div class="annotation">
                            请注意：药品中文名称、药品分类、药品厂商、药品剂型、药品成分、药品用法、药品适应症、药品禁忌、是否为处方药、是否为医保药，不可为空！
                        </div>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <img class="illustration" src="@/assets/17.png">
                </el-col>
            </el-row>
        </el-card>
    </div>

    <div class="AddMedicineFrame">
        <el-card class="Medicine-Card">
            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品中文名称：</div>
                </el-col>
                <el-col :span="12">
                    <div class="input-hint">
                        连花清瘟胶囊
                    </div>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" class="modify-button" @click="centerDialogVisible = true">修改</el-button>
                    <el-dialog v-model="centerDialogVisible" title="修改药品中文名称" width="30%" center>
                        <el-input v-model="input" placeholder="请输入新的中文名称" />
                        <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          确认
        </el-button>
      </span>
                        </template>
                    </el-dialog>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品英文名称：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品英文名称">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品图片：</div>
                </el-col>
                <el-col :span="18">
                    <el-upload
                            class="upload-demo"
                            drag
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                            multiple
                    >
                        <el-icon class="el-icon--upload">
                            <upload-filled/>
                        </el-icon>
                        <div class="el-upload__text">
                            Drop file here or <em>click to upload</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                jpg/png files with a size less than 500kb
                            </div>
                        </template>
                    </el-upload>


                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品分类：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品分类">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品简称：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品简称">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品简介：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品简介">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品来源国家：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品来源国家">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品厂商：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品厂商">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品剂型：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品剂型">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品性状：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品性状">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品成分：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品成分">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品有效期：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品有效期">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品用法：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品用法">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品适应症：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品适应症">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品禁忌：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品禁忌">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品贮藏方法：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品贮藏方法">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">是否为处方药：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input"
                               placeholder="请输入0/1。0代表不是处方药，1代表是处方药">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">是否为医保药：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input"
                               placeholder="请输入0/1。0代表不是医保药，1代表是医保药">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品参考报价：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-container">
                        <input type="text" name="text" class="input" placeholder="请输入药品参考报价">
                        <div class="highlight"></div>
                    </div>
                </el-col>
            </el-row>


        </el-card>
    </div>
</template>


<script>
import { ref } from 'vue'

export default {
    name: "AddMedicineView",
    data() {
        return {}
    },
    setup() {
        const centerDialogVisible = ref(false)
        const input = ref('')
        return {
            centerDialogVisible,
            input
        }

    }
}
</script>
<style>

.AM_body {
    margin: 0 auto;
    width: 90%;
    margin-top: 20px;
}

.AM_title {
    border-radius: 10px;
}

.title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 10px;
}

.illustration {
    width: 100%;
    height: 100%;
}

.annotation {
    color: gray;
}

.AddMedicineFrame {
    margin-top: 10px;
    margin-left: 5%;
    width: 90%;
}

.Medicine-Card {
    width: 90%;
    margin: 0 auto;
    border-radius: 10px;
}

.info-input {
    margin-left: 10%;
    margin-top: 30px;

}

.input-container {
    position: relative;
}

.input {
    font-size: 1em;
    width: 70%;
    padding: 0.6em 1em;
    border: none;
    border-radius: 6px;
    background-color: #f8f8f8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
//max-width: 600px; color: #333;
}

.input:hover {
    background-color: #f2f2f2;
}

.input:focus {
    outline: none;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input::placeholder {
    color: #999;
}

.highlight {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #019ccb;
    transition: width 0.3s ease;
}

.input:focus + .highlight {
    width: 75%;
}

/* Optional: Animation on focus */
@keyframes input-focus {
    from {
        transform: scale(1);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
    }

    to {
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
}

.input:focus {
    animation: input-focus 0.3s ease;
}

.input-hint {
//margin-top: 8px; font-family: SimSun; text-align: left; font-size: 20px;
    font-weight: 900;
}

.upload-demo {
    width: 75%;
}

.modify-button {
    font-size: small;
}
.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>
