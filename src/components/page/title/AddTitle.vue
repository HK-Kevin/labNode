<template>

    <div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox v-for="(item,index) in type" :key="index" :label="item" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="正文">
                    <div id="editorElem" style="text-align:left;width: 140%"></div>
                </el-form-item>
            </el-form>
        </div>

        <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
    </div>

</template>

<script>
    import E from 'wangeditor'
    export default {
        data: function () {
            return {
                dialogVisible:false,
                type: ['学术', '国际交流', '文体活动'],
                form: {
                    title: '',
                    type: [],
                    content: '',
                    click:0
                },
                editorOption: {
                    // something config
                }
            }
        },
        mounted() {
            this.createEditor()
        },
        methods: {
            createEditor(){
                let editor = new E('#editorElem');
                editor.customConfig.onchange = (html) => {
                    this.form.content = html;
                };
                editor.customConfig.uploadImgServer = 'http://47.94.94.52:714/news/upload' ; // 上传图片到服务器
                editor.customConfig.uploadFileName = 'avator';
                editor.create()
            },
            showDialog(id) {
                this.dialogVisible = true;
            },
            onSubmit() {
                this.$message.success('提交成功！');
            },
            submit(){

                this.$http({
                    url: '/news/add',
                    method: 'post',
                    data: this.form
                }).then(res => {
                    this.$message.success('提交成功！');
                    this.$emit('updateTable');
                    this.dialogVisible = false;
                })
            }
        },
    }
</script>

<style scoped>
    .editor-btn {
        margin-top: 20px;
    }
</style>
