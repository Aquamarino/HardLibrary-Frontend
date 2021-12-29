<template>
  <div class="back">
    <div class="container">
        <div style="display: flex">
          <div style="width: 30%;padding-top: 10px">
            <el-radio-group v-model="options" fill="#333333" border="false" @change="serviceChange">
              <el-radio-button label="searchHistoryRegistered" name="infoRegistered" border>借阅</el-radio-button>
              <el-radio-button label="searchHistoryAppointed" name="infoAppointed" border>预约</el-radio-button>
            </el-radio-group>
          </div>
        <h1>查找用户借阅/预约信息</h1>
        </div>
        <div style="margin-left: 50px">        <router-view/>
        </div>

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
      }
    },
    methods:{
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        this.$router.push('/login');
      },
      serviceChange(name){
        if (this.options === 'searchHistoryAppointed'){
          this.$router.push("searchHistoryAppointed")
        }else {
          this.$router.push("searchHistoryRegistered")
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
  /deep/
  .el-radio {
    margin: 0;
  }

  .el-radio__inner, .el-radio-group {
    display: inline-flex;
    padding: 0;
  }

  .el-radio__inner, .el-radio {
    border-radius: 2px;
  }

 .el-radio__input {
    cursor: pointer;
    vertical-align: middle;
    display: none;
  }

  .el-radio.is-bordered {
    padding: 12px 10px 0 10px;
  }

</style>
