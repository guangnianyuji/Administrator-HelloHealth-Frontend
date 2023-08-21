<template>
    <div class="AM_body">
        <el-card class="AM_title">
            <el-row>
                <el-col :span="18">

                    <el-row>
                        <div class="title">编辑药品信息</div><back-button style="margin-left: 25%;margin-top: 5px"></back-button>
                    </el-row>

                    <el-row>
                        <div class="annotation">请修改药品信息</div>
                    </el-row>
                    <br>
                    <el-row>
                        <div class="annotation">
                            请注意：<br>
                            1.药品中文名称、药品分类、药品厂商、药品剂型、药品成分、药品用法、药品适应症、药品禁忌、是否为处方药、是否为医保药，不可为空！
                        </div>
                    </el-row>
<!--                    <br>-->
                    <el-row>
                        <div class="annotation">
                            2.批准文号不可更改，以批准文号为标准进行修改
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
                    <div class="input-hint">药品批准文号：</div>
                </el-col>
                <el-col :span="18">
                    <div class="input-hint">
                        {{medicineInfo.medicine_id}}
                    </div>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">药品图片：</div>
                </el-col>
                <el-col :span="16">
                    <el-upload
                        class="upload-demo"
                        drag
                        action="#"
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="uploadFile"
                        accept="image/jpg,image/jpeg,image/png"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="upload-img" />

                        <el-icon v-if="!imageUrl" class="el-icon--upload">
                            <upload-filled/>
                        </el-icon>
                        <div class="el-upload__text" v-if="!imageUrl">
                            Drop file here or <em>click to upload</em>
                        </div>
                    </el-upload>
                    <el-button
                        type="danger"
                        v-if="imageUrl"
                        class="upload-demo-clear"
                        @click="handleRemove"
                    >删除</el-button>
                </el-col>
            </el-row>

            <el-row class="info-input" v-for="item in fieldInfo">
                <el-col :span="6">
                    <div class="input-hint">{{item.name}}:</div>
                </el-col>
                <el-col :span="13">
                    <div class="input-hint">
                       {{medicineInfo[item.field]}}
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" class="modify-button" @click="startEdit(item.field, item.name)">修改</el-button>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">是否为处方药：</div>
                </el-col>
                <el-col :span="18">
                    <el-radio-group v-model="this.is_prescription_medicine" class="ml-4">
                        <el-radio :label="true" size="large">是</el-radio>
                        <el-radio :label="false" size="large">否</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>

            <el-row class="info-input">
                <el-col :span="6">
                    <div class="input-hint">是否为医保药：</div>
                </el-col>
                <el-col :span="18">
                    <el-radio-group v-model="this.is_medical_insurance_medicine" class="ml-4">
                        <el-radio :label="true" size="large">是</el-radio>
                        <el-radio :label="false" size="large">否</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>

            <el-row>
                <button class="submitButton" @click="submit">
                    <span class="svg-wrapper-1">
                        <span class="svg-wrapper">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                            </svg>
                        </span>
                    </span>
                    <span class="text">提交</span>
                </button>
            </el-row>

        </el-card>
    </div>

    <el-dialog v-model="centerDialogVisible" :title="'修改'+editingName" width="30%" center>
        <el-input v-model="modified" clearable :placeholder="'请输入新的'+editingName" autosize type="textarea"/>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="centerDialogVisible = false;">取消</el-button>
                <el-button type="primary" @click="endEdit">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>


<script>
import {UploadFilled} from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import BackButton from "@/components/BackButton.vue";
export default {
    name: "ModifyMedicineView",
    components: {BackButton, UploadFilled},
    data() {
        return {
            imageUrl: '',
            medicineInfo:{},
            modified: '',
            centerDialogVisible: false,
            is_medical_insurance_medicine: false,
            is_prescription_medicine: false,
            editingFieldKey: undefined,
            editingName: '',
            fieldInfo:[
                {name:"药品中文名称", field:"medicine_ch_name"},
                {name:"药品英文名称", field:"medicine_en_name"},
                {name:"药品分类", field:"medicine_category"},
                {name:"药品简称", field:"medicine_abbreviation"},
                {name:"药品简介", field:"medicine_introduction"},
                {name:"药品来源国家", field:"medicine_country"},
                {name:"药品厂商", field:"medicine_manufacturer"},
                {name:"药品剂型", field:"medicine_form"},
                {name:"药品性状", field:"medicine_character"},
                {name:"药品成分", field:"medicine_ingredient"},
                {name:"药品有效期", field:"medicine_validityperiod"},
                {name:"药品用法", field:"medicine_usage"},
                {name:"药品适应症", field:"medicine_indications"},
                {name:"药品禁忌", field:"medicine_taboo"},
                {name:"药品贮藏方法", field:"medicine_storage"},
                {name:"药品参考报价", field:"medicine_reference_quote"},
            ]
        }
    },
    methods:{
        uploadFile(item) {
            console.log(item);
            let formData = new FormData();
            let file = item.raw;
            this.imageUrl = URL.createObjectURL(file);
            formData.append("medicine_img", file);


            //将图片以formdata形式上传，后端返回图片url，再将url赋值给medicine_image
            axios.post('/api/Forum/ImgUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                ElMessage.success("图片上传成功，请等待图片加载。")
                this.medicineInfo.medicine_image = response.data.data.url;
                this.imageUrl = response.data.data.url;
            }).catch((error)=>{
                if(error.network) return;
                switch (error.errorCode) {
                    case 115:
                        ElMessage.error("图片上传失败，请联系管理员！")
                        break;
                    default:
                        error.defaultHandler();
                }
            })
        },
        // 删除只需清空imageUrl即可
        handleRemove(file, fileList) {
            this.imageUrl = "";
            this.medicineInfo.medicine_image=null;
        },
        check(){
            //药品中文名称、药品分类、药品厂商、药品剂型、药品成分、药品用法、药品适应症、药品禁忌、是否为处方药、是否为医保药，不可为空！
            if(this.medicineInfo.medicine_ch_name===''||
            this.medicineInfo.medicine_category===''||
            this.medicineInfo.medicine_manufacturer===''||
            this.medicineInfo.medicine_form===''||
            this.medicineInfo.medicine_ingredient===''||
            this.medicineInfo.medicine_usage===''||
            this.medicineInfo.medicine_indications===''||
            this.medicineInfo.medicine_taboo===''||
            this.medicineInfo.is_prescription_medicine===''||
            this.medicineInfo.is_medical_insurance_medicine===''||
            this.medicineInfo.medicine_image===''){
                ElMessage.error('请填写完整信息！');
                return false;
            }else{
                return true;
            }
        },
        submit(){
            console.log("提交")
            if(this.check()) {
                console.log(this.modified);
                this.medicineInfo.is_medical_insurance_medicine = this.is_medical_insurance_medicine ? '是' : '否';
                this.medicineInfo.is_prescription_medicine = this.is_prescription_medicine ? '是' : '否';
                console.log(this.medicineInfo.is_medical_insurance_medicine);
                console.log(this.medicineInfo.is_prescription_medicine);
                axios.post("/api/Administrator/modifyMedicine", this.medicineInfo)
                    .then(response => {
                        if (response.data.data.status) {
                            ElMessage.success('修改成功');
                            console.log("Successfully modify medicine data:" + response.data.data.message);
                        } else {
                            console.error("Error modifying medicine data:", response.data.errorCode);
                            ElMessage.error('修改失败：' + response.data.errorCode)
                        }
                    })
                    .catch(error => {
                        console.error("Error modifying medicine data:", error);
                        ElMessage.error('修改失败：' + error)
                    })
            }
        },
        startEdit(fieldKey, editingName){
            this.editingFieldKey = fieldKey
            this.editingName = editingName
            console.log(this.editingFieldKey)
            this.modified = this.medicineInfo[this.editingFieldKey]!=null?this.medicineInfo[this.editingFieldKey].valueOf():null;
            this.centerDialogVisible = true
        },
        endEdit(){
            console.log(this.modified)
            this.medicineInfo[this.editingFieldKey] = this.modified;
            console.log(this.editingFieldKey)
            this.centerDialogVisible = false;
        }
    },
    created() {
        axios
            .post("/api/Administrator/medicine",{medicine_id:this.$route.query.medicine_id})
            .then(response => {
                if (response.data.data.status) {
                    ElMessage.success('获取药品信息成功');
                    console.log("Successfully get medicine data");
                    console.log(response.data.data.medicineDetail);
                    this.medicineInfo = response.data.data.medicineDetail;
                    this.imageUrl=this.medicineInfo.medicine_image;//图片初始化
                    this.is_medical_insurance_medicine=this.medicineInfo.is_medical_insurance_medicine.includes('是');
                    this.is_prescription_medicine=this.medicineInfo.is_prescription_medicine.includes('是');
                } else {
                    console.error("Error getting medicine data:", response.data.errorCode);
                    ElMessage.error('获取失败：' + response.data.errorCode)
                }
            })
            .catch(error => {
                console.error(error);
                ElMessage.error('获取药品信息失败：' + error)
            });
    },

}
</script>
<style scoped>

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
    margin: 10px auto;
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
margin-right: 50px;
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

button.submitButton {
    margin-top: 40px;
    margin-bottom: 20px;
    margin-left: 45%;
    font-family: inherit;
    font-size: 20px;
    background: #019ccb;
    color: white;
    padding: 0.5em 1em;
    padding-left: 0.9em;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
}

button.submitButton span.text {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
}

button.submitButton svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
}

button.submitButton:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
}

button.submitButton:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

button.submitButton:hover span.text {
    transform: translateX(5em);
}

button.submitButton:active {
    transform: scale(0.95);
}
.upload-img{
    width: 90%;
    height:50%;
    border-radius: 10px;
}
.upload-demo-clear{
    margin-top: 10px;
    margin-left: 33%;
}
</style>
