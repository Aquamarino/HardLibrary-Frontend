<template>
  <div class="back">
<!--    <div class="container">-->
<!--      <h1>用户信息</h1>-->
<!--      <h3>用户名：{{librarian}}<el-button  @click="$router.push({name:'modify'})">修改密码</el-button></h3>-->
<!--      <h5>(仅展示当前正在借阅/预约的图书信息)</h5>-->
<!--      <h3></h3>-->
<!--      <el-container style="height: 400px; border: 1px solid #eee">-->
<!--        <el-container>-->
<!--          <div style="width: 110px;padding-top:120px">-->
<!--            <el-radio-group v-model="options" fill="#333333" border="false" @change="serviceChange">-->
<!--              <router-link to="infoRegistered"><el-radio-button label="借阅的书" name="infoRegistered"/></router-link>-->
<!--              <router-link to="infoAppointed"><el-radio-button label="预约的书" name="infoAppointed"/></router-link>-->
<!--            </el-radio-group>-->
<!--          </div>-->
<!--          <router-view/>-->
<!--        </el-container>-->
<!--      </el-container>-->
<!--    </div>-->
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="300px" style="background-color:#e7ebee">
       <h4>用户名：{{librarian}}</h4>
        <el-button  @click="$router.push({name:'modify'})">修改密码</el-button>
        <el-menu>
            <el-menu-item-group>
              <!-- <el-menu-item index="1" @click="$router.push({name:'fineInfo'})">查看罚款</el-menu-item> -->
              <!-- <el-menu-item index="4" @click="$router.push({name:'infoAppointed'})">借取/预约记录</el-menu-item> -->
              <!-- <el-menu-item index="5" @click="$router.push({name:'historyRegistered'})">历史借阅记录</el-menu-item> -->
              <!-- <el-menu-item index="6" @click="$router.push({name:'userBookComment'})">评论记录</el-menu-item> -->
              <!-- <el-menu-item index="7" @click="$router.push({name:'userCredit'})">信用流水</el-menu-item> -->

              <el-menu-item index="1" @click="$router.push({name:'UserManagementv1'})">查看资料</el-menu-item>


<!--              <el-submenu index="2">-->
<!--                <template slot="title"><i class="el-icon-menu"></i>历史记录</template>-->
<!--                <el-menu-item-group>-->
<!--                  <el-menu-item index="2-2"  @click="$router.push({name:'history'})">借阅/预约历史记录</el-menu-item>-->
<!--                </el-menu-item-group>-->
<!--              </el-submenu>-->
              <el-menu-item index="3" @click="log_out">退出登陆</el-menu-item>
            </el-menu-item-group>
        </el-menu>
      </el-aside>



        <router-view v-if="isRouterAlive"></router-view>
<!--        <el-main>-->
<!--              <div class="container">-->
<!--                <h5>(仅展示当前正在借阅/预约的图书信息)</h5>-->
<!--                <h3></h3>-->
<!--                <el-container style="height: 400px; border: 1px solid #eee">-->
<!--                  <el-container>-->
<!--                    <div style="width: 110px;padding-top:120px">-->
<!--                      <el-radio-group v-model="options" fill="#333333" border="false" @change="serviceChange">-->
<!--                        <router-link to="infoRegistered"><el-radio-button label="借阅的书" name="infoRegistered"/></router-link>-->
<!--                        <router-link to="infoAppointed"><el-radio-button label="预约的书" name="infoAppointed"/></router-link>-->
<!--                      </el-radio-group>-->
<!--                    </div>-->
<!--                    <router-view/>-->
<!--                  </el-container>-->
<!--                </el-container>-->
<!--              </div>-->
<!--        </el-main>-->

    </el-container>
  </div>

</template>

<script>
  export default {
    name:'info',
    provide(){
      return{
        reload:this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
        tableData: [],
        librarian:this.$store.state.username,
      }
    },
    methods:{
      reload () {
        this.isRouterAlive = false;            //先关闭，
        this.$nextTick(function () {
          this.isRouterAlive = true;         //再打开
        })
      },
      log_out(){
        localStorage.removeItem('Authorization');
        localStorage.removeItem('username');
        this.$router.push('/login')
      },
      serviceChange(name){
        if (this.options === "infoAppointed"){
          this.$router.push("/info/infoAppointed")
        }else {
          this.$router.push("/info/infoRegistered")
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
  /*.container{*/
  /*  width: 100%;*/
  /*  border-radius: 20px;*/
  /*  background-clip: padding-box;*/
  /*  !*margin: 270px auto;*!*/
  /*  margin-top: 5%;*/
  /*  margin-left: 25%;*/
  /*  margin-bottom: 50px;*/
  /*  !*width: 350px;*!*/
  /*  padding: 35px 35px 15px 35px;*/
  /*  background: #fff;*/
  /*  border: 1px solid #eaeaea;*/
  /*  box-shadow: 0 0 25px #cac6c6;*/
  /*}*/
  a{
    text-decoration: none;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
