<template>
  <div id="base_register">
    <el-form :model="registerForm" :rules="rules" class="register_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="registerForm">
      <h3 class="register_title">注册</h3>
      <el-form-item prop="username" class="el-form-item" style="border-radius: 15px">
        <el-input id="username" type="text" v-model="registerForm.username" @change = "emailChange"
                  auto-complete="off" placeholder="username" style="margin-top: 10px"/>
      </el-form-item>
      <el-form-item prop="password" class="el-form-item" style="border-radius: 10px">
        <el-input type="password" v-model="registerForm.password"
                  auto-complete="off" placeholder="password" onkeyup="" style="margin-top: 10px"/>
      </el-form-item>
      <el-form-item prop="email" class="el-form-item" style="border-radius: 10px">
        <div>
          <el-input placeholder="email" v-model="registerForm.email" class="input-with-select" style="margin-top: 10px;margin-bottom: 10px">
            <el-button slot="append" v-on:click="verify()">验证</el-button>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item prop="userType" class="el-form-item" style="border-radius: 10px">
        <el-radio-group v-model="registerForm.radio" @change="userTypeChange">
          <el-radio label="Teacher" border>教师</el-radio>
          <el-radio label="Undergraduate" border>本科生</el-radio>
          <el-radio label="Postgraduate" border>研究生</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="verification" class="el-form-item" style="border-radius: 10px" v-if="verify_if">
        <div>
          <el-input placeholder="验证码" v-model="registerForm.verification" class="input-with-select">
            <el-button slot="append" v-on:click="registration(registerForm)">注册</el-button>
          </el-input>
        </div>
      </el-form-item>
      <div><router-link to="login"  class="adminLink">>>>登陆</router-link></div>
<!--      <el-form-item style="width: 100%" class="el-form-item">-->
<!--        <el-button type="primary" class="submit" v-on:click="registration(registerForm)">register</el-button>-->
<!--      </el-form-item>-->
      <el-alert
        v-if="warning"
        title="username existed"
        type="warning">
      </el-alert>
      <el-alert
        v-if="registerError"
        title="register error"
        type="warning">
      </el-alert>
      <el-alert
        v-if="wrong"
        title="wrong submit"
        type="warning">
      </el-alert>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Register',
  data() {
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    };
    const checkUserName = (rule, value, cb) => {
      const regUserName = /^[0-9]{11}$/;
      if (regUserName.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的用户名'))
    };
    const checkPassword = (rule, value, cb) => {
      const username = document.getElementById("username").value;
      const regPassword = /(?!^(\d+|[a-zA-Z]+|[_\-]+)$)^[\w_\-]{6,32}$/;
      const reg = new RegExp(regPassword);
      if (reg.test(value) && value.search(username) === -1) {
        return cb()
      }
      cb(new Error('请输入合法的密码'))
    };
    return {
      registerForm: {
        radio: '',
        username: '',
        password: '',
        email: '',
        type: '',
        verification: '',
      },
      warning: false,
      registerError: false,
      wrong: false,
      verify_if:false,
      rules: {
        // blur 失去鼠标焦点时触发验证
        username: [{required: true, message: '', trigger: 'blur'}, {validator: checkUserName, trigger: 'blur'}],
        password: [{required: true, message: '', trigger: 'blur'}, {validator: checkPassword, trigger: 'blur'}],
        email: [{required: true, message: '', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}],
        type: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
        verification: [{message: '', trigger: 'blur'}, {trigger: 'blur'}]
      },
      loading: false
    }
  },
  methods: {
    userTypeChange() {
      if (this.registerForm.radio === 'Teacher') {
        this.registerForm.type = 'Teacher';
      } else if (this.registerForm.radio === 'Postgraduate') {
        this.registerForm.type = 'Postgraduate';
      } else {
        this.registerForm.type = 'Undergraduate';
      }
    },
    emailChange() {
      this.registerForm.email = this.registerForm.username + '@fudan.edu.cn';
      const email = document.getElementsByClassName("email");
      email.innerHTML = this.registerForm.email;
    },
    verify() {
      if (this.registerForm.username === '' || this.registerForm.password === '' || this.registerForm.email === '' || this.registerForm.type === '') {
        this.$message("请先输入完整信息");
      }else {
        axios.post('/verify',{
          username:this.registerForm.username,
          password:this.registerForm.password,
          email:this.registerForm.email,
          type:this.registerForm.type
        }).then(resp =>{
          if (resp.data === "true"||resp.data===true){
            this.$message("邮件已成功发送，请获取验证码");
            this.verify_if = true;
          }else {
            this.$message("请输入正确的学号和邮箱");
          }
        })
      }
    },
    registration(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('/register', {
              username: this.registerForm.username,
              password: this.registerForm.password,
              email: this.registerForm.email,
              type: this.registerForm.type,
              verification:this.registerForm.verification
            }
          )
            .then(resp => {
              // 根据后端的返回数据修改
              console.log(resp.data);
              if (resp.status === 201 && resp.data === true) {
                // 跳转到login
                this.$router.replace('/login')
              } else if (this.data === "验证码错误"){
                this.$message("验证码错误");
              }
              else {
                this.warning = true;
              }
            })
            .catch(error => {
              console.log(error);
              this.registerError = true;
            })
        } else {
          this.wrong = true;
        }
      })
    }
  }
}
</script>

<style scoped>
#base_register{
  background: url("../assets/background/loginBackground.jpg") repeat center;
  height: 100%;
  width: 100%;
  margin: 0;
  background-size: cover;
  position: fixed;
  padding: 0;
}
.register_container{
  border-radius: 20px;
  background-clip: padding-box;
  margin: 200px auto 270px;
  width: 400px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.register_title{
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.el-form-item{
  margin: 10px;
  border-radius: 30px;
}
.submit{
  width: 300px;
  padding:8px;
  background-color: aliceblue;
  color: black;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px; /* future proofing */
  text-align: center;
  vertical-align: middle;
  border: 1px solid transparent;
  font-weight: 900;
  font-size:125%;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: -10px;
  height: 50px;

}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.adminLink{
  text-decoration:none;
  color: #575757;
  font-weight:bold ;
}
</style>
