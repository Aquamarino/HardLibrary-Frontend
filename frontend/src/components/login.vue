<template>
  <body id="paper">
  <el-form :model="loginForm" :rules="rules" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username"
                auto-complete="off" placeholder="username"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="password"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 35%;background: #505458;border: none" v-on:click="login">登录</el-button>
      <router-link to="register">
        <el-button type="primary" style="width: 35%;background: #505458;border: none">注册</el-button>
      </router-link>
    </el-form-item>
    <div><router-link to="AdminLogin"  class="adminLink">>>>管理员登录</router-link></div>
  </el-form>
  </body>
</template>

<script>
  import {mapMutations} from "vuex";
  import axios from 'axios'
export default{
  username: 'login',
  data () {
    return {
      rules: {
        username: [{required: true, message: '账号不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      },
      checked: true,
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    login () {
      const _this = this;
      axios.post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(resp => {
                  if ((resp.status === 201||resp.status === 200) && resp.data!==false && resp.data!=='false password') {
                    _this.userToken =resp.data;
                    // 将用户token保存到vuex中
                    _this.changeLogin({
                      Authorization:_this.userToken,
                      username: this.loginForm.username,
                    });
                    //console.log("username is:"+localStorage.getItem('username'));
                    this.$router.replace( '/homepage')
                  } else{
                    this.$message(
                      "用户名或密码错误！"
                    )
                  }
                })
          .catch(error => {
                  console.log(error)
                  // alert('login error')
                  this.$message(
              "登录出错！"
            )
                })
    }
  }
}
</script>
<style scoped>
#paper {
  background: url("../assets/background/loginBackground.jpg") no-repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
body{
  margin: 0;
}
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 190px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
.adminLink{
  text-decoration:none;
  color: #575757;
  font-weight:bold ;
}
.adminLink:hover{
  color: #667c7f;
  font-weight:bold ;
}
</style>
