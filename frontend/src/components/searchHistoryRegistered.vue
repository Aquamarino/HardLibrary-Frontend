<template>
  <div>
    <h5>（仅可以通过搜索用户名来展示用户的历史借阅信息，当前借阅记录不显示在其中）</h5>
    <el-container @change="getData">
      <el-main>
        <el-form :model="form" :rules="rules" class="register_container" label-position="left"
                 label-width="0px" v-loading="loading" :ref="form">
        <div style="width: 50%;margin-left: 50%;margin-bottom: 20px">
          <el-input placeholder="username" v-model="form.username" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" v-on:click="loadData"/>
          </el-input>
        </div>
        <div style="width: 100%">
          <el-table
            :data="tableData"
            width="200"
            height="250">
            <el-table-column
              fixed
              prop="bookId"
              label="书籍编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="lendDate"
              label="借阅日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="lendLibrary"
              label="书籍原馆"
              width="100">
            </el-table-column>
            <el-table-column
              prop="lendLibrarian"
              label="借出管理员"
              width="110">
            </el-table-column>
            <el-table-column
              prop="returnDate"
              label="归还时间"
              width="110">
            </el-table-column>
            <el-table-column
              prop="returnLibrarian"
              label="归还管理员"
              width="110">
            </el-table-column>
            <el-table-column
              prop="returnLibrary"
              label="归还所在馆"
              width="110">
            </el-table-column>
<!--            <el-table-column label="操作">-->
<!--              <template slot-scope="scope">-->
<!--                &lt;!&ndash; 点击编辑进入编辑页面进行编辑表格数据 &ndash;&gt;-->
<!--                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">遗失登记</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
          </el-table>
        </div>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name:'infoRegistered',
    data(){
      return {
        username:'',
        tableData: [{
          id:'',
          bookId:'',
          lendDate:'',
          borrowedTo:'',
          lendLibrary:'',
          lendLibrarian:'',
          returnDate:'',
          returnLibrary:'',
          returnLibrarian:'',
        }],
        type:'registered',
        form:{
          username:'',
          type:"registered"
        }
      }
    },
    methods:{
      loadData(){
        console.log("registered");
        console.log(this.username);
        axios.post("/adminHistoryInfo",{
          type:this.form.type,
          username:this.form.username
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableData = resp.data;
          }
        })
      },
      handleEdit(index, row){
        console.log(row.lendDate)

  }
    }
  }
</script>
