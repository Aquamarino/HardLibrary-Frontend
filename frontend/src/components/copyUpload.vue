<template>
  <div id="base_upload">
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
      <el-menu-item index="4"><router-link to="/adminBookStatus">图书总览</router-link></el-menu-item>
      <el-menu-item index="6"><router-link to="/upload">上传图书</router-link></el-menu-item>
      <el-submenu index="7">
        <template slot="title">图书借还</template>
        <el-menu-item index="7-1" @click="$router.push({name:'BookBorrow'})">现场借书</el-menu-item>
        <el-menu-item index="7-2" @click="$router.push({name:'BookReturn'})">现场还书</el-menu-item>
        <el-menu-item index="7-3" @click="$router.push({name:'BookSubscribe'})">预约取书</el-menu-item>
        <el-menu-item index="7-4" @click="$router.push({name:'BookCheck'})">图书遗失</el-menu-item>
      </el-submenu>
      <el-submenu index="8">
        <template slot="title">系统记录</template>
        <el-menu-item index="8-1" @click="$router.push({name:'copyHistoryInfo'})">副本记录查询</el-menu-item>
        <el-menu-item index="8-2" @click="$router.push({name:'searchHistory'})">用户记录查询</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">超管工作台</template>
        <el-menu-item index="5-1" @click="$router.push({name:'addAuthority'})">添加管理员</el-menu-item>
        <el-menu-item index="5-2" @click="$router.push({name:'UserManagement'})">用户管理</el-menu-item>
      </el-submenu>


    </el-menu>
    <el-form :model="uploadForm" :rules="rules" class="upload_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="uploadForm">
      <h1 class="upload_title" style="align-content: center">上传副本</h1>
      <el-form-item prop="isbn">
        <label>isbn:
          <el-input :disabled="true" id="isbn" type="text"  auto-complete="off"  style="width: 300px" v-model="uploadForm.isbn" @change="getIsbn" placeholder="isbn"/>
        </label>
      </el-form-item>
      <el-form-item prop="quantity">
        <label>数量:
          <el-input id="quantity" type="text"  auto-complete="off" placeholder="quantity" v-model="uploadForm.quantity" style="width: 300px"/></label>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" v-on:click="upload(uploadForm)">上传副本</el-button>
      </el-form-item>
      <el-alert
        v-if="uploadError"
        title="librarian not found"
        type="warning">
      </el-alert>
      <el-alert
        v-if="noIsbn"
        title="no such isbn"
        type="warning">
      </el-alert>
      <el-alert
        v-if="wrong"
        title="wrong error"
        type="warning">
      </el-alert>
    </el-form>


  </div>
</template>

<script>
  import axios from 'axios'


  export default {
    name: 'Upload',
    data(){
      const checkIsbn = (rule, value, cb) => {
        const regIsbn = /^[0-9]{13}$/;
        if (regIsbn.test(value)){
          return cb();
        }
        cb(new Error('请输入合法的Isbn'))
      };
      const checkQuantity = (rule, value, cb) => {
        const regQuantity = /^[0-9]+$/;
        if (regQuantity.test(value)){
          return cb();
        }
        cb(new Error('请输入合法的数量'))
      };
      return{
        uploadForm: {
          isbn: this.$store.state.isbn,
          quantity: '',
          library: ''
        },
        uploadError:false,
        wrong:false,
        noIsbn:false,
        library:localStorage.getItem('librarianWorkplace'),
        librarian : this.$store.state.username,
        rules: {
          isbn: [{required: true, message: '', trigger: 'blur'}, {validator: checkIsbn, trigger: 'blur'}],
          quantity: [{required: true, message: '', trigger: 'blur'}, {validator: checkQuantity, trigger: 'blur'}]
        },
        loading: false
      }
    },
    methods:{
      upload(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            axios.post('/addbookinstance', {
                isbn: this.uploadForm.isbn,
                quantity:this.uploadForm.quantity,
                library: localStorage.getItem('librarianWorkplace')
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                if ((resp.status === 200||resp.status===201)&&resp.data===true) {
                  // 跳转到login
                  this.$router.replace('/adminBookStatus')
                } else {
                  if (resp.data===false)
                    this.uploadError = true;
                  else
                    this.noIsbn = true;
                }
              })
              .catch(error => {
                console.log(error);
                this.uploadError = true;
              })
          } else {
            this.wrong = true;
          }
        })
      },
      log_out(){
        localStorage.removeItem('Authorization');
        this.$router.push("/login");
      },
      getIsbn(){
        document.getElementById('isbn').innerText = this.$store.state.isbn;
      }
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
  }

</script>
<style scoped>
  a{
    text-decoration: none;
  }
  #base_upload{
    background: url("../assets/background/adminLoginBackground2.jpg") repeat center;
    height: 100%;
    width: 100%;
    margin: 0;
    background-size: cover;
    position: absolute;
    padding: 0;
    text-align: center;
  }
  .upload_container{
    width: 600px;
    border-radius: 20px;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 10%;
    margin-left: 30%;
    /*width: 350px;*/
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .upload_title{
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
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
  label{
    display: inline-block;
    width: 35em;
    margin-left: -100px;
    margin-top: 0;
    margin-bottom: 0;
    text-align: right;
    vertical-align: top;
  }
  .upload_container el-input{
    width: 250px;
  }
</style>
