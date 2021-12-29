<template>
  <div class="back">
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
      <h1>用户借阅/预约信息</h1>
      <h3>用户名：{{this.$store.state.username}} </h3>
      <h5>(仅展示历史信息，不展示当前正在借阅和预约的图书信息)</h5>
      <h3></h3>
      <el-container style="height: 400px; border: 1px solid #eee">
        <el-container>
          <div style="width: 80%;padding-top:120px">
            <el-radio-group v-model="options" fill="#333333" border="false" @change="serviceChange">
              <router-link to="historyRegistered"><el-radio-button label="借阅的书" name="infoRegistered"/></router-link>
              <router-link to="historyAppointed"><el-radio-button label="预约的书" name="infoAppointed"/></router-link>
            </el-radio-group>
          </div>
          <router-view/>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  export default {
    name:'info',
    data() {
      return {
        tableData: [],
        librarian:this.$store.state.username,
      }
    },
    methods:{
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        this.$router.push('/login');
      },
      serviceChange(name){
        if (this.options === 'Appointed'){
          this.$router.push("/history/historyAppointed")
        }else {
          this.$router.push("/history/historyRegistered")
        }

      },
      toModify(){
        this.$router.push("/modify")
      }
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
    width: 50%;
    border-radius: 20px;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 5%;
    margin-left: 25%;
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
</style>
