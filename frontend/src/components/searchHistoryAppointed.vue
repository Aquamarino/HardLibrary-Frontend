<template>
  <div>
    <h5>（仅可以通过搜索用户名来展示用户的历史预约信息，当前预约记录不显示在其中）</h5>
    <el-container>
      <el-form :model="form" :rules="rules" class="register_container" label-position="left"
               label-width="0px" v-loading="loading" :ref="form">
        <el-main>
          <div style="width: 50%;margin-left: 25%;margin-bottom: 20px">
            <el-input type="text" placeholder="username" v-model="form.username" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" v-on:click="loadData"/>
            </el-input>
          </div>
          <div style="width: 100%">
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="bookId"
                label="已预约书籍isbn"
                width="180">
              </el-table-column>
              <el-table-column
                prop="reserveBy"
                label="预约人"
                width="200">
              </el-table-column>
              <el-table-column
                prop="reserveDate"
                label="预约时间"
                width="200">
              </el-table-column>
              <el-table-column
                prop="takeDate"
                label="取书时间"
                width="180">
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
    name:'infoAppointed',
    methods: {
      handleClick(formName,row,index,rows) {
        this.infoAppointedForm.book_id = row.bookId;
        this.$refs[formName].validate(valid => {
          if (valid){
            axios.post('/cancel',{
              reserve_by:this.infoAppointedForm.reserve_by,
              book_id:this.infoAppointedForm.book_id
            })
              .then(resp => {
                // 根据后端的返回数据修改
                if ((resp.status === 200 || resp.status === 201) && resp.data === true) {
                  rows.splice(index, 1);
                }
              })
          }
        })
      },
      loadData(){
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
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    },

    data() {
      return {
        username:'',
        tableData: [{
          bookId:'',
          reserveBy:'',
          reserveDate:'',
          take:''
        }],
        librarian:this.$store.state.username,
        infoAppointedForm:{
          reserve_by:this.$store.state.username,
          book_id:''
        },
        form: {
          type:"appointed",
          username:""
        }

      }
    },
  }
</script>
