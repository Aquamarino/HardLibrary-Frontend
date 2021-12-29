<template>
  <div class="container">
    <h3>用户罚款记录</h3>
    <el-container>
      <el-form :model="form" :rules="rules" class="register_container" label-position="left"
               label-width="0px" v-loading="loading" :ref="form">
        <el-main>
          <div style="width: 50%;margin-bottom: 20px">
            <el-input type="text" placeholder="username" v-model="form.username" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" v-on:click="loadData"/>
            </el-input>
          </div>
          <div style="width: 80%">
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="book_id"
                label="book_id"
                width="160">
              </el-table-column>
              <el-table-column
                prop="book"
                label="书名"
                width="160">
              </el-table-column>
              <el-table-column
                prop="reason"
                label="罚款原因"
                width="200">
              </el-table-column>
              <el-table-column
                prop="fine_date"
                label="罚款时间"
                width="200">
              </el-table-column>
              <el-table-column
                prop="money"
                label="罚款金额"
                width="200"
                show-overflow-tooltip>
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
    data() {
      return {
        username:'',
        tableData: [{
          book_id:'',
          book:'',
          reason: '',
          fine_date:'',
          money:''
        }],
        librarian:this.$store.state.username,
        infoAppointedForm:{
          reserve_by:this.$store.state.username,
          book_id:''
        },
        form: {
          username:""
        }

      }
    },
    methods:{
      loadData(){
        axios.post("/searchFineInfo",{
          username:this.form.username
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableData = resp.data;
          }
        })
      },
    }
  }
</script>

<style scoped>
  .back{
    height: 100%;
    width: 100%;
    margin: 0;
    background-size: cover;
    position: fixed;
    padding: 0;
  }
  .container{
    width: 50%;
    border-radius: 20px;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 15%;
    margin-left: 25%;
    margin-bottom: 50px;
    /*width: 350px;*/
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  a{
    text-decoration: none;
  }
  /deep/
  .el-radio {
    margin: 0;
  }

  .el-radio__inner, .el-radio-group {
    display: inline-flex;
    padding: 0;
  }

  .el-radio__inner, .el-radio {
    border-radius: 2px;
  }

  .el-radio__input {
    cursor: pointer;
    vertical-align: middle;
    display: none;
  }

  .el-radio.is-bordered {
    padding: 12px 10px 0 10px;
  }

</style>

