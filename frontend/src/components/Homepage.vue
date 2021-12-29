<template>
  <body id="paper">
  <div style="text-align: center">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
<!--      <el-submenu index="2">-->
<!--        <template slot="title">欢迎您:{{username}}</template>-->
<!--        <el-menu-item index="2-3" @click="$router.push({name:'modify'})">修改密码</el-menu-item>-->
<!--        <el-menu-item index="2-2" @click="log_out">退出登陆</el-menu-item>-->
<!--      </el-submenu>-->
      <el-menu-item index="3" @click="log_out">退出登陆</el-menu-item>
      <el-menu-item index="4"  @click="$router.push({name:'BookStatus'})">图书总览</el-menu-item>
      <el-menu-item index="6"  @click="$router.push({name:'info'})">个人主页</el-menu-item>
<!--        <el-menu-item index="5" @click="$router.push({name:'fineInfo'})">查看罚款</el-menu-item>-->
<!--      <el-menu-item index="8" @click="$router.push({name:'history'})">历史记录</el-menu-item>-->


    </el-menu>
    <el-container style="text-align: center">
      <router-view v-if="isRouterAlive"></router-view>
    </el-container>
  </div>
  </body>
</template>
<style scoped>
a{
  text-decoration: none;
}
#paper{
  /*background: url("../assets/background/loginBackground.jpg") ;*/
  /*height: 100%;*/
  width: 100vm;
  background-size: cover;
  margin: 0;
  padding: 0;
}
span {
  pointer-events: none;
}
.el-menu{
  width: 100vw;
}
.el-container{
  width: 100vw;
}
.el-header{
  background-color:  #505458;
  color: #ffffff;
  text-align: center;
  line-height: 50px;
  height: 80px;
}

.el-aside {
  background-color: #faf9f9;
  color: #fffff7;
  text-align: center;
  padding-top: 5%;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  height: 300px;
  text-align: justify;
  line-height: 30px;
}
.el-footer{
  background-color: #e3e4e7;
  text-align: left;
  height: 60px;
  line-height: 50px;
}
.cover-style{
  width: 80%;
}
.el-
.el-button{
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 60px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>

<script>
export default {
  name:'Homepage',
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    const checkIsbn = (rule, value, cb) => {
      const regIsbn = /^[0-9]{13}$/;
      if (regIsbn.test(value)){
        return cb();
      }
      cb(new Error('请输入合法的Isbn'))
    };
    return {

      activeName: '1',
      books:[],
      isRouterAlive: true,
      options: 'Borrow',
      value: '',
      username:localStorage.getItem('username'),
      librarian:this.$store.state.username,
      library:localStorage.getItem('librarianWorkplace'),
      //library:this.$store.state.librarianWorkplace,
      MoreRules:{
        AddISBN: [{required: true, message: '请输入副本号', trigger: 'blur'}, {validator: checkIsbn, trigger: 'blur'}]
      },
      loading: false,
    }
  },
  methods:{

    log_out(){
      localStorage.removeItem('Authorization');
      localStorage.removeItem('username');
      this.$router.push('/login')
    },
    reload () {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    },
  },
};
</script>
