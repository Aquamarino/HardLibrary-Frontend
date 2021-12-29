<template>
  <div class="back">
    <div class="container">
      <div style="display: flex">
        <div style="width: 30%;padding-top: 10px">
        <el-radio-group v-model="options" fill="#333333" border="false" @change="serviceChange">
          <el-radio-button label="copyHistoryInfoRegistered" border name="InfoRegistered">借阅</el-radio-button>
          <el-radio-button label="copyHistoryInfoAppointed" border name="InfoAppointed">预约</el-radio-button>
        </el-radio-group>
      </div>
      <h1 style="padding-left: 30%">副本借阅/预约历史记录</h1>
        </div>
      <el-container style="height: 400px; border: 1px solid #eee">

        <div style="margin-left: 50px">  <router-view/></div>
      </el-container>

    </div>

  </div>
</template>

<script>
  export default {
    name:'info',
    data() {
      return {
        options:this.$router.currentRoute.name,
        tableData: [],
        librarian:this.$store.state.username,
        currentRouter:this.$router.currentRoute.name,
      }
    },
    methods:{
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        this.$router.push('/login');
      },
      serviceChange(name){
        console.log(this.options)
        if (this.options === 'copyHistoryInfoAppointed'){
          this.$router.push("copyHistoryInfoAppointed")
        }else {
          this.$router.push("copyHistoryInfoRegistered")
        }

      },
      toModify(){
        this.$router.push("/modify")
      }
    },
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
    width: 70%;
    border-radius: 20px;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 5%;
    margin-left: 15%;
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
  .el-radio{
    margin: 0;
  }
  .el-radio__inner, .el-radio-group{
    display: inline-flex;
    padding: 0;
  }
  .el-radio__inner, .el-radio{
    border-radius:2px;
  }
  .el-radio__inner,.el-radio__input{
    cursor: pointer;
    /*vertical-align: middle;*/
    display: none;
  }
  .el-radio.is-bordered{
    padding: 12px 10px 0 10px;
  }
</style>
