<template>
  <div id="base_register">
    <el-form :model="registerForm" :rules="rules" class="register_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="registerForm">
      <h3 class="register_title">添加管理员</h3>
      <el-form-item prop="username" class="el-form-item" style="border-radius: 15px">
        <el-input id="username" type="text" v-model="registerForm.username" @change = "emailChange"
                  auto-complete="off" placeholder="username" style="margin-top: 10px"/>
      </el-form-item>
      <el-form-item prop="email" class="el-form-item" style="border-radius: 10px">
        <el-input readonly class="email" type="text" v-model="registerForm.email"
                  auto-complete="off" placeholder="email" style="margin-top: 10px"/>
      </el-form-item>
      <el-form-item style="width: 100%;" class="el-form-item">
        <el-button type="primary" class="submit" v-on:click="register(registerForm)">添加管理员</el-button>
      </el-form-item>
      <el-alert
        v-if="notSuper"
        title="Add authorities failed."
        type="warning"
        description="Only Super Librarian can add authorities."
        show-icon>
      </el-alert>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'Register',
    data () {
      const checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      };
      const checkUserName = (rule,value,cb) => {
        const regUserName = /^[0-9]{11}$/;
        if (regUserName.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的用户名'))
      };
      const checkPassword = (rule,value,cb) =>{
        const username = document.getElementById("username").value;
        const regPassword = /(?!^(\d+|[a-zA-Z]+|[_\-]+)$)^[\w_\-]{6,32}$/;
        const reg = new RegExp(regPassword);
        if (reg.test(value) && value.search(username) === -1){
          return cb()
        }
        cb(new Error('请输入合法的密码'))
      };
      return {
        registerForm: {
          radio:'',
          username: '',
          email: '',
          type: 'super'
        },
        notSuper:false,
        rules: {
          // blur 失去鼠标焦点时触发验证
          username: [{required: true, message: '', trigger: 'blur'}, {validator: checkUserName, trigger: 'blur'}],
          password: [{required: true, message: '', trigger: 'blur'}, {validator: checkPassword, trigger: 'blur'}],
          email: [{required: true, message: '', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}],
          type: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}]
        },
        loading: false
      }
    },
    methods: {
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        localStorage.removeItem('username');
        this.$router.push('/login');
      },
      userTypeChange () {
        this.registerForm.type = (this.registerForm.radio === 'Teacher') ? 'Teacher':'Student'
      },
      emailChange(){
        this.registerForm.email = this.registerForm.username + '@fudan.edu.cn';
        const email = document.getElementsByClassName("email");
        email.innerHTML = this.registerForm.email;
      },
      register (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            axios.post('/addlibrarian', {
                //this.$axios.post('/api/register', {
                librarianname: this.registerForm.username,
                email: this.registerForm.email,
                type: this.$store.state.librarianType
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                if (resp.status === 201 && resp.data===true) {
                  // 跳转到login
                  this.$router.replace('/bookmanagement')
                } else {
                  this.notSuper = true;
                }
              })
              .catch(error => {
                console.log(error);
                this.notSuper = true;
              })
          } else {
            this.notSuper = true;
          }
        })
      }
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }
  #base_register{
    /*background: url("../assets/background/loginBackground.jpg") repeat center;*/
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
    width: 350px;
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
    color: #000000;
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
</style>
