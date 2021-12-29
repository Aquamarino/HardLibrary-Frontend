<template>
  <div>
    <h5>（仅可以通过搜索副本编号来展示副本的历史借阅信息，当前借阅记录不显示在其中）</h5>
    <el-container>
      <el-form :model="form" :rules="rules" class="register_container" label-position="left"
               label-width="0px" v-loading="loading" :ref="form">
      <el-main>
        <div style="width: 50%;margin-left: 25%;margin-bottom: 20px">
          <el-input id="book" type="text" placeholder="book_id" v-model="form.username" class="input-with-select" auto-complete="off">
            <el-button slot="append" icon="el-icon-search" v-on:click="loadData"/>
          </el-input>
        </div>
        <div style="width: 100%;margin-top: 30px;margin-left: -30px">
          <el-table
            :data="tableData"
            style="width: 920px"
            >
            <el-table-column
              fixed
              prop="bookId"
              label="书籍编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="borrowedTo"
              label="借阅人"
              width="150">
            </el-table-column>
            <el-table-column
              prop="lendDate"
              label="借阅日期"
              width="150">
            </el-table-column>
            <el-table-column
              prop="lendLibrary"
              label="书籍原馆"
              width="100">
            </el-table-column>
            <el-table-column
              prop="lendLibrarian"
              label="借出管理员"
              width="150">
            </el-table-column>
            <el-table-column
              prop="returnDate"
              label="归还时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="returnLibrarian"
              label="归还管理员"
              width="150">
            </el-table-column>
            <el-table-column
              prop="lendLibrary"
              label="归还所在馆"
              width="150">
            </el-table-column>

          </el-table>
        </div>
      </el-main>
      </el-form>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name:'infoRegistered',
    data(){
      return {
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
          type:"registered",
          username:""
        }
      }
    },
    created() {
      console.log("当前查看的副本的bookid是：");
      console.log(this.$store.state.bookId);
      // document.getElementById('book').innerText = this.$store.state.bookId;
    //  this.form.username = this.$store.state.bookId;
    },
    methods:{
      getData(){
        axios.post("/info",{
          type:'registered',
          book_id:this.form.username,
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableData = resp.data;
          }
        })
      },
      loadData(){
        axios.post('/bookHistoryinfo',{
          type:'registered',
          book_id: this.form.username
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableData = resp.data;
          }
        })
      },
      loadBookId(){
        console.log("当前查看的副本的bookid是：");
        console.log(this.$store.state.bookId);
     //   document.getElementById('book').innerText = this.$store.state.bookId;
    //    this.form.username = this.$store.state.bookId;
      }
    },
  }
</script>
