<template>
  <div id="modify">
    <el-form :model="modifyForm" :rules="rules" class="container" label-position="left"
             label-width="0px" v-loading="loading" :ref="modifyForm">
      <h1>修改密码</h1>
      <el-form-item prop="username">
        <label>用户名:
          <el-input readonly id="username" type="text"  style="width: 300px" v-model="modifyForm.username" @change="get_username" placeholder="username"/>
        </label>
      </el-form-item>
      <el-form-item prop="password">
        <label>新的密码:
          <el-input id="password" type="text"  auto-complete="off"  style="width: 300px" v-model="modifyForm.password" placeholder="password"/>
        </label>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" v-on:click="modify(modifyForm)">上传</el-button>
      </el-form-item>
      <el-alert
        v-if="warning"
        title="error"
        type="warning">
      </el-alert>
      <el-alert
        v-if="registerError"
        title="error"
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
  import axios from "axios";

  const checkPassword = (rule,value,cb) =>{
      const username = document.getElementById("username").value;
      const regPassword = /(?!^(\d+|[a-zA-Z]+|[_\-]+)$)^[\w_\-]{6,32}$/;
      const reg = new RegExp(regPassword);
      if (reg.test(value) && value.search(username) === -1){
        return cb()
      }
      cb(new Error('请输入合法的密码'))
    };
  export default {
    name: 'modify',
    data(){
      return{
        modifyForm:{
          username: '',
          password: ''
        },
        warning:false,
        registerError:false,
        wrong:false,
        rules:{
          username:[{ message: '', trigger: 'blur'}, {trigger: 'blur'}],
          password: [{required: true, message: '', trigger: 'blur'}, {validator:checkPassword,trigger: 'blur'}]
        }
      }
    },
    methods:{
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        this.$router.push('/login');
      },
      get_username() {
        document.getElementById('username').innerText = this.$store.state.username;
      },
      modify(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            axios.post('/updateuserinfo', {
                username: this.modifyForm.username,
                password: this.modifyForm.password,
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                if ((resp.status === 200||resp.status===201) && resp.data==='Password changed.') {
                  // 跳转到login
                  localStorage.removeItem('Authorization');
                  this.$router.push('/login');
                } else {
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
      },
    created() {
      this.modifyForm.username = this.$store.state.username;
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }
  #modify{
    background: url("../assets/background/adminLoginBackground2.jpg") repeat center;
    height: 100%;
    width: 100%;
    margin: 0;
    background-size: cover;
    position: absolute;
    padding: 0;
    text-align: center;
  }
  .container{
    width: 500px;
    border-radius: 20px;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 15%;
    margin-left: 35%;
    margin-bottom: 50px;
    /*width: 350px;*/
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
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
    margin-top: 5px;
    margin-left: 50px;
    height: 50px;

  }
</style>
