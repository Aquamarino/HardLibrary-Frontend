<template>
  <div class="hello">
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <el-button @click="exit">去登录</el-button>
    <h3>{{message}}</h3>
    <h5>在同一台电脑上请不要登录两次</h5>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: '欢迎登陆图书馆系统',
        message:'超级管理员用户名：17302112011\n密码：abcd12345'
      }
    },
    methods: {
      exit() {
        localStorage.removeItem('Authorization');
        localStorage.removeItem('username');
        localStorage.removeItem('librarianWorkplace');
        localStorage.removeItem('userAuthority');
        this.$router.push('/login');
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .hello{
    text-align: center;
  }
</style>
