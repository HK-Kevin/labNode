<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> Update</el-breadcrumb-item>

            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="confirmAllDel">批量删除</el-button>
            <el-select v-model="select_cate" multiple placeholder="choose type" class="handle-select mr10"
                       style="width:30%" @change="selectTypeData">
                <el-option v-for="(item,index) in select_data" :key="index" :label="item.label"
                           :value="item.label"></el-option>

            </el-select>
            <el-input v-model="searchData" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="titleData" border style="width: 100%" ref="multipleTable"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="_id" label="id" sortable width="150">
            </el-table-column>
            <el-table-column prop="title" label="title" width="150">
            </el-table-column>
            <el-table-column prop="type" label="type" width="150">
            </el-table-column>
            <el-table-column prop="date" label="date">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)">删除                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @current-change="handlePage"
            layout="prev, pager, next"
            :total="1000">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_data: [{label: '学术'}, {label: '国际交流'}, {label: '文体活动'}],
                select_cate: '',
                select_word: '',
                del_list: [],
                searchData:'',
                is_search: false,
                titleData: [],
                title_page: 1,
                totalPage: 100,
                limit: 3,
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function (d) {
                    let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if (d.name === self.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(self.select_cate) > -1 &&
                            (d.name.indexOf(self.select_word) > -1 ||
                            d.address.indexOf(self.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            handlePage(val){
                this.title_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                let findPageCon = {page: this.title_page, limit: this.limit};
                self.$axios.post('/news/allTitles', findPageCon).then(res => {
                    self.titleData = res.data;
                })

            },//获取数据
            search(){
                if (!this.searchData) {
                    this.$message({
                        message: '请输入查询内容',
                        type: 'warning'
                    });
                    return;
                }
                this.$axios.get(`/news/search?title=${this.searchData}`).then(res => {
                    this.titleData = res.data
                })
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                let id = row._id;
                this.$router.push(`/oneTitle/${id}`)
            },
            handleDelete(index, row) {
                let self = this;
                let deleteId = {id: [row._id]};
                this.$axios.post('/news/deleteTitles', deleteId).then(res => {
                    if (res.data.result) {
                        self.$message.success('删除成功');
                    } else {
                        self.$message.error('删除失败');
                    }
                    self.getData();
                });

                this.$message.error('删除第' + (index + 1) + '行');
            },//单个删除
            confirmAllDel(){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delAll();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },//确认是否删除
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                let arr = [];
                this.del_list.forEach(item => {
                    arr.push(item._id)
                })
                let deleteData = {id: arr};
                this.$axios.post('/news/deleteTitles', deleteData).then(res => {
                    if (res.data.result) {
                        self.$message.success('删除成功');
                    } else {
                        self.$message.error('删除失败');
                    }
                    self.getData();
                });


            }, //删除所有
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            selectTypeData(val){
                if (val.length == 0) {
                    this.getData()
                } else {
                    let searchCon = {page: this.title_page, limit: this.limit, type: val};
                    this.$axios.post('/news/typeTitles', searchCon).then(res => {
                        this.titleData = res.data
                    })
                }

            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
</style>
