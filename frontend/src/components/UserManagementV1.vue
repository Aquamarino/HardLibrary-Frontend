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
<!--    </el-menu>-->
    <div class="container">
      <h1>用户信息</h1>
      <h3>用户名：{{this.$store.state.username}} <el-button v-if="!editing" v-on:click="editing=true">编辑</el-button>
                                              <el-button v-if="editing" v-on:click="editing=false; submit()">保存</el-button></h3>
      <h3/>
      <el-container style="height: 50%; border: 1px solid #eee;margin-bottom: 20px;margin-left:10px;width: 100%">
        <el-container>
          <el-card class="box-card">
            <div class="text item">
              性别：<span v-if="!editing">{{this.sex}}</span><el-input v-model="sex" v-if="editing"></el-input>
            </div>
            <div class="text item">
              密码：<span v-if="!editing">{{this.password}}</span><el-input v-model="password" v-if="editing"></el-input>
            </div>
                        <div class="text item">
              年龄：<span v-if="!editing">{{this.age}}</span><el-input v-model="age" v-if="editing"></el-input>
            </div>
                        <div class="text item">
              电话号码：<span v-if="!editing">{{this.telephoneNumber}}</span><el-input v-model="telephoneNumber" v-if="editing"></el-input>
            </div>
                        <div class="text item">
              邮箱： <span v-if="!editing">{{this.email}}</span><el-input v-model="email" v-if="editing"></el-input>
            </div>
                        <div class="text item">
              地址：<span v-if="!editing">{{this.location}}</span><el-input v-model="location" v-if="editing"></el-input>
            </div>
          </el-card>

        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    book:'fineInfo',
    data() {
      return {
        // tableData: [],
        // multipleSelection: [],
        // selection:[],
        username:this.$store.state.username,
        // amount: "",
        // book_id1:"",
        // book1:"",
        // reason1:"",
        // money1:"",
        // book_id2:"",
        // book2:"",
        // reason2:"",
        // money2:"",
        // book_id3:"",
        // book3:"",
        // reason3:"",
        // money3:"",
        // book_id4:"",
        // book4:"",
        // reason4:"",
        // money4:"",
        // book_id5:"",
        // book5:"",
        // reason5:"",
        // money5:"",
        // selected:"",
        // fine_date1:"",
        // fine_date2:"",
        // fine_date3:"",
        // fine_date4:"",
        // fine_date5:"",

          editing: false,

          password : "123456",
          sex : "男",
          age : "20",
          telephoneNumber : "10086",
          email : "10086@qq.com",
          location : "上海",
      }
    },
    methods:{
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        this.$router.push('/login');
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;

      },
      submit(){
        
          axios.post('/modify',{
            password: this.password,
            sex: this.sex,
            age: this.age,
          telephoneNumber: this.telephoneNumber ,
          email: this.email,
          location: this.location,

          }).then(resp => {
                if (resp.status === 200 || resp.status === 201 || resp.data === true){
                  this.$message("success")
                  location.reload();
                }
              })
      },
    },
    created(){
      axios.post('/fineInfo',{
        username:this.$store.state.username
      }).then(resp => {
        console.log(resp.data);
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.password = resp.password;
          this.sex = resp.sex;
          this.age = resp.age;
          this.telephoneNumber = resp.telephoneNumber;
          this.email = resp.email;
          this.location = resp.location;
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
    margin-top: 5%;
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
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
    text-align: left;
    padding-left: 20px;
  }
</style>
