<template>
  <body id="paper2">
  <el-form :model="loginForm" :rules="rules" :ref="loginForm" class="login-container2" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">管理员</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username"
                auto-complete="off" placeholder="admin username"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="admin password"></el-input>
    </el-form-item>
    <el-form-item prop="firstTitle">
    <el-select style="padding-bottom: 14px;width:350px" v-model="loginForm.firstTitle" placeholder="choose branch library">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
      </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 35%;background: #505458;border: none" v-on:click="login(loginForm)">登录</el-button>
    </el-form-item>
    <div><router-link to="login"  class="back">>>>用户登录</router-link></div>
  </el-form>

  </body>
</template>

<script>
import {mapMutations} from "vuex";
import axios from 'axios'
export default{
  name: 'AdminLogin',
  data () {
    var isSelect = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("不能为空"));
        } else {
          callback();
        }
      };
    return {
      rules: {
        username: [{required: true, message: '账号不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
        firstTitle:[{required: true, message: '校区不能为空',trigger: 'change',validator: isSelect}],
      },
      options: [{
        value: 'handan',
        label: '邯郸'
      }, {
        value: 'jiangwan',
        label: '江湾'
      }, {
        value: 'zhangjiang',
        label: '张江'
      }, {
        value: 'fenglin',
        label: '枫林'
      },],
      value: '',
      checked: true,
      loginForm: {
        username: '',
        password: '',
        firstTitle: '',
      },
      loading: false
    }
  },
  methods: {
    ...mapMutations(['adminLogin']),
    login (formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          const _this = this;
          axios.post('/librarianlogin', {
            username: this.loginForm.username,
            password: this.loginForm.password,
            library:this.loginForm.firstTitle,
          })
            .then(resp => {
              console.log(resp.data)
              if ((resp.status === 201 || resp.status === 200) && resp.data !== false && resp.data!=="false password") {
                _this.userToken = resp.data.Authorization;
                _this.userType = resp.data.type;
                // 将管理员信息和token保存到vuex中
                _this.adminLogin(
                  {Authorization:_this.userToken,
                  username: this.loginForm.username,
                    librarianWorkplace:this.loginForm.firstTitle
                  });
                this.$store.commit('setUserAuthority', "Librarian");
                this.$store.commit('setType', _this.userType);
                // console.log("用户（普通人or管理员）："+this.$store.state.userAuthority)
                localStorage.setItem('librarianWorkplace',this.loginForm.firstTitle)
                // console.log("图书馆:"+_this.$store.state.librarianWorkplace)
                // console.log("管理员类型："+_this.$store.state.librarianType)
                this.$router.replace('/bookmanagement')
              } else {
                this.$message({
                  type: 'warning',
                  message: '管理员用户名或密码错误'
                });
              }
            })
            .catch(error => {
              console.log(error)
              this.$message("登录错误")
              // alert('login error')
            })
        }else {
          this.$message("提交错误")
          //alert("wrong submit")
        }
      })
    }
    },

  }

</script>
<style scoped>
#paper2 {
  background: url("../assets/background/adminLoginBackground2.jpg") no-repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
body{
  margin: 0;
}
.login-container2 {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 190px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #000000;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #343434;
}
.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #ffffff;
}
.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
.back{
  text-decoration:none;
  color: #ffffff;
  font-weight:bold ;
}
.back:hover{
  color: #667c7f;
}
</style>
