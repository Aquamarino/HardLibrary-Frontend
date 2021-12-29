<template>
  <div>
<!--    <el-menu-->
<!--      class="el-menu-demo"-->
<!--      mode="horizontal"-->
<!--      background-color="#545c64"-->
<!--      text-color="#fff"-->
<!--      active-text-color="#ffd04b">-->
<!--      <el-menu-item index="3"><router-link to="/login" @change="exit">退出登陆</router-link></el-menu-item>-->
<!--      <el-menu-item index="2"><router-link to="/bookstatus">图书总览</router-link></el-menu-item>-->
<!--      <el-menu-item index="1"><router-link to="/info">个人主页</router-link></el-menu-item>-->
<!--      <el-menu-item index="4"><router-link to="/fineInfo">查看罚款</router-link></el-menu-item>-->
<!--      <el-menu-item index="5"><router-link to="/history">查看历史记录</router-link></el-menu-item>-->
<!--      <el-menu-item index="6"><router-link to="/userCredit">查看信用记录</router-link> </el-menu-item>-->
<!--    </el-menu>-->
    <div class="container">
<!--        <h1>查看用户信用记录</h1>-->
      <span>{{username}} 的信用值：{{credit}} </span>
      <el-container>
        <el-form :model="form" :rules="rules" class="register_container" label-position="left"
                 label-width="0px" v-loading="loading" :ref="form">
          <el-main>
            <div style="width: 100%">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  fixed
                  prop="username"
                  label="用户名"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="reason"
                  label="信用变更原因"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="changes"
                  label="信用变更数额"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="信用变更时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="credit"
                  label="当前信用值"
                  width="180">
                </el-table-column>
              </el-table>
            </div>
          </el-main>
        </el-form>
      </el-container>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'userCredit',
    data(){
      return{
        username: this.$store.state.username,
        tableData: [],
        form:{
          username:this.$store.state.username
        },
        credit : ''
      }
    },
    created() {
      axios.post("/creditInfo",{
        username:this.$store.state.username
      }).then(resp => {
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.tableData = resp.data;
        }
      });
      axios.post("/credit", {
        username : this.$store.state.username
      }).then(resp => {
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.credit = resp.data;
        }
      })

    }
  }
</script>

<style scoped>
  .back{
    background: url("../assets/background/adminLoginBackground2.jpg");
    height: 100%;
    width: 100%;
    margin: 0;
    background-size: cover;
    position: fixed;
    padding: 0;
  }
  .container{
    width: 100%;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    /*margin-top: 25%;*/
    /*margin-left: 25%;*/
    /*margin-bottom: 50px;*/
    /*width: 350px;*/
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  a{
    text-decoration: none;
  }
</style>
