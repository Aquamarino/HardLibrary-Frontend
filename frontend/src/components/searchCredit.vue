<template>
  <div class="container">
    <p style="font-size: 20pt">用户信用记录</p>
    <el-container>
      <el-form :model="form" :rules="rules" class="register_container" label-position="left"
               label-width="0px" v-loading="loading" :ref="form">
        <el-main>
          <div style="width: 50%; margin-bottom: 2%;margin-left: 30%">
            <el-input type="text" placeholder="username" v-model="form.username" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" v-on:click="loadData"/>
            </el-input>
          </div>

          <template style="width: 100%">
            <el-table
              :data="tableData"
              height="200"
              border
              style="width: 100%">
              <el-table-column
                fixed
                prop="username"
                label="用户名"
                width="150">
              </el-table-column>
              <el-table-column
                prop="reason"
                label="信用变更原因"
                width="150">
              </el-table-column>
              <el-table-column
                prop="changes"
                label="信用变更数额"
                width="150">
              </el-table-column>
              <el-table-column
                prop="date"
                label="信用变更时间"
                width="150">
              </el-table-column>
              <el-table-column
                prop="credit"
                label="信用总值"
                width="150">
              </el-table-column>
            </el-table>
          </template>
        </el-main>
        <span v-show="credit !== ''">该用户的信用值：{{credit}} <el-button class="submit" v-on:click="reset()" style="height: 50px;margin-right: 20px" type="text">重置用户信用</el-button></span>
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
        tableData: [],
        librarian:this.$store.state.username,
        infoAppointedForm:{
          reserve_by:this.$store.state.username,
          book_id:''
        },
        form: {
          username:""
        },
        credit : '',

      }
    },
    methods:{
      loadData(){
        axios.post("/creditInfo",{
          username:this.form.username
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableData = resp.data;
          }
        });
        axios.post("/credit", {
          username : this.form.username
        }).then(resp => {
          if (resp.data === "用户不存在"){
            this.$message("查询的用户不存在");
          }else if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.credit = resp.data;
            console.log(this.credit);
          }
        })
      },
      reset(){
        axios.post("/reset",{
          username:this.form.username
        }).then(resp => {
          if (resp.data === true){
            this.$message("已重置用户信用");
          }else {
            this.$message("找不到该用户")
          }
        })
      }
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
    width: 60%;
    height: 70%;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 5%;
    margin-left: 20%;
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

