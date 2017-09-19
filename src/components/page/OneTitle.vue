<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>Add Title</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox v-for="(item,index) in type" :key="index" :label="item" :name="item"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="正文">
                    <div id="editorElem" style="text-align:left;width: 200%"></div>
                </el-form-item>
            </el-form>
        </div>

        <el-button class="editor-btn" type="primary" @click="update">确认更改</el-button>
    </div>
</template>
<script>
    import E from 'wangeditor'
    export default {
        data: function () {
            return {
                editorContent: '',
                type: ['学术', '国际交流', '文体活动'],
                form: {
                    _id:'',
                    title: '',
                    type: [],
                    content: '',
                    click:0
                },
                editorOption: {
                    // something config
                },
                editor:{},
            }
        },
        mounted() {
            let editor = new E('#editorElem');
            editor.customConfig.onchange = (html) => {
                this.form.content = html;
            };
            editor.customConfig.uploadImgServer = 'http://192.168.205.123:714/news/upload' ; // 上传图片到服务器
            editor.customConfig.uploadFileName = 'avator';
            editor.create();
            this.editor = editor;

            },
        created(){
            let idObj = this.$route.params;
            this.$axios.get(`/news/oneTitle?id=${idObj.id}`).then(res => {
                this.form.title =res.data.title;
                this.form._id =res.data._id;
                this.form.type =[res.data.type];
                this.editor.txt.html(res.data.content);
            })
        },
        watch:{

        },
        methods: {
            onSubmit() {
                this.$message.success('提交成功！');
            },
            update(){
                this.$axios.put(`/news/updateTitle`,this.form).then(res => {
                    if(res.data.result){this.$message.success('更新成功！');}
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
