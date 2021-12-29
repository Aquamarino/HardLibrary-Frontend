<template>
  <div>
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
      <h1>罚款信息</h1>
      <h3>用户名：{{this.$store.state.username}} <el-button v-on:click="repay()">还款</el-button></h3>
      <h3/>
      <el-container style="height: 50%; border: 1px solid #eee;margin-bottom: 20px;margin-left:10px;width: 100%">
        <el-container>
          <!-- <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            height="370"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="book_id"
              label="book_id"
              width="160">
            </el-table-column>
            <el-table-column
              prop="book"
              label="书名"
              width="160">
            </el-table-column>
            <el-table-column
              prop="reason"
              label="罚款原因"
              width="200">
            </el-table-column>
            <el-table-column
              prop="fine_date"
              label="罚款原因"
              width="200">
            </el-table-column>
            <el-table-column
              prop="money"
              label="罚款金额"
              width="200"
              show-overflow-tooltip>
            </el-table-column>
          </el-table> -->

          <el-descriptions title="垂直带边框列表" direction="vertical" :column="4" border>
            <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
            <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
            <el-descriptions-item label="居住地" :span="2">苏州市</el-descriptions-item>
            <el-descriptions-item label="备注">
              <el-tag size="small">学校</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
          </el-descriptions>

        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    book:'fineInfo',
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        selection:[],
        username:this.$store.state.username,
        amount: "",
        book_id1:"",
        book1:"",
        reason1:"",
        money1:"",
        book_id2:"",
        book2:"",
        reason2:"",
        money2:"",
        book_id3:"",
        book3:"",
        reason3:"",
        money3:"",
        book_id4:"",
        book4:"",
        reason4:"",
        money4:"",
        book_id5:"",
        book5:"",
        reason5:"",
        money5:"",
        selected:"",
        fine_date1:"",
        fine_date2:"",
        fine_date3:"",
        fine_date4:"",
        fine_date5:"",
      }
    },
    methods:{
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        this.$router.push('/login');
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;

      },
      repay(){
        this.selected = 0;
        this.multipleSelection.forEach(item => {
          this.selected += 1;
        });
        if (this.selected > 5){
          this.$message("最多选择5条罚款记录");
        }else if (this.selected === 0){
          this.$message("请先选择需要还款的罚款记录");
        } else {
          this.amount = 0.0;
          this.multipleSelection.forEach(item =>{
            console.log(parseFloat(item.money));
            this.amount += parseFloat(item.money)
          });
          console.log(this.multipleSelection);
          for (let i = 0; i < this.selected ; i++){
            if (i === 0){
              this.book_id1 = this.multipleSelection[0].book_id;
              this.book1 = this.multipleSelection[0].book;
              this.reason1 = this.multipleSelection[0].reason;
              this.money1 = this.multipleSelection[0].money;
              this.fine_date1 = this.multipleSelection[0].fine_date;
            }else if (i === 1){
              this.book_id2 = this.multipleSelection[1].book_id;
              this.book2 = this.multipleSelection[1].book;
              this.reason2 = this.multipleSelection[1].reason;
              this.money2 = this.multipleSelection[1].money;
              this.fine_date2 = this.multipleSelection[1].fine_date;
            }else if (i === 2){
              this.book_id3 = this.multipleSelection[2].book_id;
              this.book3 = this.multipleSelection[2].book;
              this.reason3 = this.multipleSelection[2].reason;
              this.money3 = this.multipleSelection[2].money;
              this.fine_date3 = this.multipleSelection[2].fine_date;
            } else if (i === 3){
              this.book_id4 = this.multipleSelection[3].book_id;
              this.book4 = this.multipleSelection[3].book;
              this.reason4 = this.multipleSelection[3].reason;
              this.money4 = this.multipleSelection[3].money;
              this.fine_date4 = this.multipleSelection[3].fine_date;
            }else if (i === 4){
              this.book_id5 = this.multipleSelection[4].book_id;
              this.book5 = this.multipleSelection[4].book;
              this.reason5 = this.multipleSelection[4].reason;
              this.money5 = this.multipleSelection[4].money;
              this.fine_date5 = this.multipleSelection[4].fine_date;
            }
          }
          axios.post('/payment',{
            invoke_id:"se2021_15",
            uid:this.$store.state.username,
            amount:this.amount
          }).then(resp => {
            if (resp.data.msg === "<具体错误原因>"){
              this.$message("<具体错误原因>");
            }else if (resp.data.msg === "failed, the balance is not enough"){
              this.$message("failed, the balance is not enough");
            }else if (resp.data.msg === "success"){
              this.$message("success");
              axios.post('/notification',{
                book_id1:this.book_id1,
                reason1:this.reason1,
                money1:this.money1,
                book_id2:this.book_id2,
                reason2:this.reason2,
                money2:this.money2,
                book_id3:this.book_id3,
                reason3:this.reason3,
                money3:this.money3,
                book_id4:this.book_id4,
                reason4:this.reason4,
                money4:this.money4,
                book_id5:this.book_id5,
                reason5:this.reason5,
                money5:this.money5,
                user:this.$store.state.username,
                fine_date1:this.fine_date1,
                fine_date2:this.fine_date2,
                fine_date3:this.fine_date3,
                fine_date4:this.fine_date4,
                fine_date5:this.fine_date5,
              }).then(resp => {
                if (resp.status === 200 || resp.status === 201 || resp.data === true){
                  this.$message("success")
                  location.reload();
                }
              })
            }else if (resp.msg === "ooooops, there's some exception did't expect. please tell the TA what data you sent."){
              this.$message("ooooops, there's some exception did't expect. please tell the TA what data you sent.");
            }
          })
        }
      },
    },
    created(){
      axios.post('/fineInfo',{
        username:this.$store.state.username
      }).then(resp => {
        console.log(resp.data);
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.tableData = resp.data;
        }
      })
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
    width: 100%;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 5%;
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
