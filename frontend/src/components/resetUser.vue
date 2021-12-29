<template>
  <div class="container">
    <h1>重置用户信用</h1>
    <div style="width: 70%;margin-left: 15%;margin-bottom: 20px">
      <el-input type="text" placeholder="username" v-model="form.username" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" v-on:click="loadData"/>
      </el-input>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name:'infoAppointed',
    data() {
      return {
        username:'',
        tableData: [{
          book_id:'',
          book:'',
          reason: '',
          fine_date:'',
          money:''
        }],
        librarian:this.$store.state.username,
        infoAppointedForm:{
          reserve_by:this.$store.state.username,
          book_id:''
        },
        form: {
          username:""
        }

      }
    },
    methods:{
      loadData(){
        axios.post("/searchFineInfo",{
          username:this.form.username
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableData = resp.data;
          }
        })
      },
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
    width: 50%;
    border-radius: 20px;
    background-clip: padding-box;
    /*margin: 270px auto;*/
    margin-top: 15%;
    margin-left: 20%;
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

