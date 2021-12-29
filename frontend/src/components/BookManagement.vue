<template>
  <body id="paper">
  <div style="text-align: center">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#1D1D1F"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="2">
        <template slot="title">管理员:{{librarian}}</template>
        <el-menu-item index="2-3" @click="$router.push({name:'AdminModify'})">修改密码</el-menu-item>
        <el-menu-item index="2-2" @click="log_out">退出登陆</el-menu-item>
      </el-submenu>
<!--      <el-menu-item index="3" @click="log_out">退出登陆</el-menu-item>-->
<!--      <el-menu-item index="2"><router-link to="/AdminModify">管理员:{{librarian}}</router-link></el-menu-item>-->
      <el-menu-item index="1">分馆：{{libraryName}}</el-menu-item>
      <el-menu-item index="4" @click="$router.push('/adminBookStatus')">图书总览</el-menu-item>
      <el-menu-item index="6"><router-link to="/upload">上传图书</router-link></el-menu-item>
      <el-submenu index="7">
        <template slot="title">图书借还</template>
        <el-menu-item index="7-1" @click="$router.push({name:'BookBorrow'})">现场借书</el-menu-item>
        <el-menu-item index="7-2" @click="$router.push({name:'BookReturn'})">现场还书</el-menu-item>
        <el-menu-item index="7-3" @click="$router.push({name:'BookSubscribe'})">预约取书</el-menu-item>
        <el-menu-item index="7-4" @click="$router.push({name:'BookCheck'})">图书遗失</el-menu-item>
      </el-submenu>
      <el-menu-item index="9" @click="$router.push({name:'searchCredit'})">用户信用管理</el-menu-item>
      <el-submenu index="8">
        <template slot="title">系统记录</template>
        <el-menu-item index="8-1" @click="$router.push({name:'copyHistoryInfo'})">副本记录查询</el-menu-item>
        <el-menu-item index="8-2" @click="$router.push({name:'searchHistory'})">用户记录查询</el-menu-item>
        <el-menu-item index="8-3" @click="$router.push({name:'searchFineInfo'})">罚款记录查询</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">超管工作台</template>
        <el-menu-item index="5-1" @click="$router.push({name:'addAuthority'})">添加管理员</el-menu-item>
        <el-menu-item index="5-2" @click="$router.push({name:'UserManagement'})">用户超期管理</el-menu-item>

      </el-submenu>


    </el-menu>
    <el-container style="height: 600px;text-align: center">

        <router-view v-if="isRouterAlive"></router-view>

    </el-container>
    <el-footer>欢迎来到复旦大学{{libraryName}}图书馆</el-footer>
  </div>
  </body>
</template>
<style scoped>
#paper{
  background: url("../assets/background/adminLoginBackground2.jpg");
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
  margin: 0;
  padding: 0;
}
a{
  text-decoration: none;
  color:#fff;
}

span {
  pointer-events: none;
}

.manage-container {
  margin-left:100px ;
  padding:  35px 0 15px 35px;
  width:500px;
  background: #fff;
}
.el-footer{
  bottom: 0;
  width: 100%;
  position: fixed;
  height: 150px;
  background-color: #2f2f31;
  color: white;
  padding-top: 20px;
  text-align: right;
  letter-spacing: 5px;
}
.el-radio-button__inner, .el-radio-group{
  display: inline-grid;
  padding: 0;
}
.el-radio-button__inner, .el-radio-button{
  display: inline-grid;
  border-radius:0;
  padding-bottom:20px;
}
</style>

<script>
export default {
  name:'BookManagement',
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
      adminBorrow: {
        username:'',
        isbn: '',
        name: '',
        isbns: [{
          value: ''
        }],
      },
      activeName: '1',
      books:[],
      isRouterAlive: true,
      options: 'Borrow',
      value: '',
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
    serviceChange(name){
      this.$router.push({name:'Book'+name});
      console.log(name)
    },
    log_out(){
      localStorage.removeItem('Authorization');
      localStorage.removeItem('username');
      localStorage.removeItem('librarianWorkplace');
      localStorage.removeItem('userAuthority');
      this.$router.push('/adminlogin')
    },
    reload () {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    },
  },
  computed:{
    libraryName:function (){
      var libraryName = this.library;
      switch (libraryName){
        case 'handan':libraryName='邯郸';break
        case 'jiangwan':libraryName='江湾';break
        case 'zhangjiang':libraryName='张江';break
        case 'fenglin':libraryName='枫林';break
        default :break
      }
      return libraryName;
    }
  },
};
</script>
