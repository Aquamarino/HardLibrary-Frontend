<template>
  <div class="back">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="black"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="3"><router-link to="/login" @change="exit">退出登陆</router-link></el-menu-item>
      <el-menu-item index="2"><router-link to="/adminBookStatus">图书总览</router-link></el-menu-item>
      <el-menu-item index="1"><router-link to="/upload">上传图书</router-link> </el-menu-item>
      <el-menu-item index="4"><router-link to="bookmanagement">管理图书</router-link></el-menu-item>
      <el-menu-item index="5"><router-link to="addAuthority">添加管理员</router-link></el-menu-item>
      <el-menu-item index="6"><router-link to="AdminModify">修改密码</router-link></el-menu-item>
    </el-menu>
    <div class="container">
      <h1>副本信息</h1>

      <el-container>
        <el-main>
          <el-container>
          <el-aside width="300px">
            <img :src="this.$store.state.cover" alt="" class="cover-style" referrerpolicy="no-referrer"/>
          </el-aside>
          <el-container>
          <el-table
            :data="tableData"
            border
            height="400"
            style="width: 100%">
            <el-table-column
              prop="book_id"
              label="副本编号"
              width="200">
            </el-table-column>
            <el-table-column
              prop="borrow_to"
              label="借阅人"
              width="180">
            </el-table-column>
            <el-table-column
              prop="lend_date"
              label="借阅时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="library"
              label="书籍对应图书馆"
              width="180">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="210">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-on:click="handleClick(scope.row)">查看副本历史记录</el-button>
              </template>
            </el-table-column>

          </el-table>

          </el-container>
          </el-container>

        </el-main>
      </el-container>
     <router-link to="copyUpload"><el-button type="primary" class="submit">添加副本</el-button></router-link>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data(){
      return{
        isbn:this.$store.state.isbn,
        input:'',
        tableData:[{
          isbn:'',
          author:'',
          category:'',
          name:'',
          cover:'',
          publish_date:'',
          description:'',
          book_id:'1111111111111_001',
          borrow_to:'',
          lend_date:'',
          lend_library:'',
          lend_librarian:'',
          return_date:'',
          return_librarian:'',
          library:'',
          status:'',
          reserve_by:'',
          reserve_date:'',
        }],
      }
    },
    created() {
      console.log(this.$store.state.isbn);
      axios.post('/checkinstance',{
        isbn:this.$store.state.isbn
      }).then(resp => {
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.tableData = resp.data;
        }
      })
    },
    methods:{
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        localStorage.removeItem('username');
        this.$router.push('/login');
      },
      handleClick(row){
        this.$store.commit('setSearchBookId',row.book_id);
        console.log(this.$store.state.bookId);
        this.$router.replace('/bookmanagement/copyHistoryInfo/copyHistoryInfoRegistered');
      }
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }
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
    width: 60%;
    border-radius: 20px;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 5%;
    margin-left: 18%;
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
    margin-top: 20px;
    margin-left: -10px;
    height: 50px;

  }
  .cover-style{
    width: 80%;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 60px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-header{
    background-color:  #505458;
    color: #ffffff;
    text-align: center;
    line-height: 50px;
    height: 80px;
  }

</style>
