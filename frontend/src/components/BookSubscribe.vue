<template>
    <el-container>
      <el-main>
        <el-form :model="adminSubscribe" :rules="rules" name="lendBooks" label-position="left"
                 label-width="80px" v-loading="loading" :ref="adminSubscribe" class="manage-container">
          <h1 class="upload_title" style="align-content: center">预约取书</h1>
          <el-form-item prop="userMsg" label="学/工号">
            <el-input type="text" v-model="adminSubscribe.userMsg" style="width: 300px" auto-complete="off" placeholder="请输入学号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" v-on:click="Subscribe1(adminSubscribe)">确认</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <el-main width="550px" style="background:transparent;color: #e2e5e8">
        <el-table
          :data="books"
          height="450"
          border
          @selection-change="selectionLineChangeHandle"
          style="width: 100%;border-radius:10px;margin-bottom: 20px">
          <!--用户选择书籍-->
          <el-table-column width="85" label="CHOOSE" type="selection"></el-table-column>

          <el-table-column
            prop="isbn,name"
            label="ISBN(副本)"
            width="220">
            <template slot-scope="scope">
              <span>副本号：{{scope.row.book_id}}<br/>书名：<<{{scope.row.name}}>></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cover"
            label="COVER(预览)"
            width="210">
            <template slot-scope="scope">
              <img  :src="scope.row.cover" alt="" class="cover-show" referrerpolicy="no-referrer">
            </template>
          </el-table-column>
        </el-table>

        <el-button type="goon"  @click="fromCommit" :disabled="this.listSelections.length===0">取书</el-button>

      </el-main>
    </el-container>
</template>

<style scoped>
a{
  text-decoration: none;
}
span {
  pointer-events: none;
}
.el-radio-button-style{
  background-color: black;
}
.manage-container {
  margin-left:40px ;
  padding:  35px 35px 15px 35px;
  width:500px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #343434;
  border-radius: 15px;
}
.cover-show{
  height:200px
}
.el-button--goon.is-active,
.el-button--goon:active {
  background: #2f3334;
  border-color: #516666;
  color: #fff;
}
.el-button--goon:focus,
.el-button--goon:hover {
  background: #3d3e40;
  border-color: #647170;
  color: #fff;
}
.el-button--goon:disabled{
  background-color: #929796;
  color: #bfbaba;
}
.el-button--goon {
  background-color: #4f5353;
  border-color: #4F5353;
  color: #fff;
}



</style>

<script>
import axios from 'axios'
export default {
  name: "BookSubscribe",
  inject:['reload'],
  data() {
    const checkIsbn = (rule, value, cb) => {
      const regIsbn = /^[0-9]{13}-\d{3}$/;
      if (regIsbn.test(value)){
        return cb();
      }
      cb(new Error('请输入合法的Isbn'))
    };
    return {
      adminSubscribe: {
        userMsg:'',
        isbn: '',
        name: '',
        isbns: [{
          value: ''
        }],
      },
      activeName: '1',
      books:[],
      options: '现场借书',
      value: '',
      librarian:this.$store.state.username,
      library:localStorage.getItem('librarianWorkplace'),
      //library:this.$store.state.librarianWorkplace,
      listSelections: [],
      MoreRules:{
        AddISBN: [{required: true, message: '请输入副本号', trigger: 'blur'}, {validator: checkIsbn, trigger: 'blur'}]
      },
      rules: {
        userMsg: [{required: true, message: '学号不能为空', trigger: 'blur'}],
      },
      loading: false,
    }
  },
  methods:{
    removeDomain(item) {
      var index = this.adminSubscribe.isbns.indexOf(item)
      if (index !== -1) {
        this.adminSubscribe.isbns.splice(index, 1)
      }
    },
    addDomain() {
      this.adminSubscribe.isbns.push({
        value: '',
        key: Date.now()
      });
    },
    serviceChange(name){
      this.$router.push({name:'Book'+name});
    },

    selectionLineChangeHandle (val) {
      this.listSelections = val
    },
    fromCommit  () {
      var Data = new FormData();
       console.log(this.listSelections);
       for(var i = 0; i< this.listSelections.length; i++){
         var id=i+1;
         Data.append('book_id'+id,this.listSelections[i].book_id)
         console.log('id:'+this.listSelections[i].book_id)
       }
       //Data.append('library',localStorage.getItem('librarianWorkplace'))
      axios.post('/take2', {
        book_id1: Data.get('book_id1'),
        book_id2:Data.get('book_id2'),
        book_id3:Data.get('book_id3'),
        book_id4:Data.get('book_id4'),
        book_id5:Data.get('book_id5'),
        library:localStorage.getItem('librarianWorkplace'),
        librarian:localStorage.getItem('username')
      }).then(resp => {
          // 根据后端的返回数据修改
          if ((resp.status === 200||resp.status===201)) {
            if (resp.data === true) {
              this.$message({
                type: 'success',
                message: '取书成功'
              });
              this.reload();
            } else if(resp.data === 'false number'){
              this.$message({
                type: 'warning',
                message: '取书数量已达到上限'
              });
          }else if(resp.data === 'false status'){
              this.$message({
                type: 'warning',
                message: '您已经取过了'
              });
            }
          }else{
            this.$message({
              type: 'error',
              message: resp.data
            });
          }
    }).catch(error=>{
      // alert(error)
      })
          },
    Subscribe1(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('/take1', {
            username:this.adminSubscribe.userMsg,
            library:localStorage.getItem('librarianWorkplace'),
            }
          )
            .then(resp => {
              // 根据后端的返回数据修改
              console.log("用户图书list："+resp.data)
              if ((resp.status === 200||resp.status===201)&&resp.data!==false) {
                if (resp.data==='nothing'||JSON.stringify(resp.data)==="[]"){
                  this.$message({
                    duration:1000,
                    type: 'info',
                    message: '没有合适的图书'
                  });
                  this.books =[]
                }else{
                  this.books =resp.data
                }
              } else {
                  this.books =resp.data
              }
            })
            .catch(error => {
              console.log(error);
              // alert(' error')
            })
        } else {
          this.$message({
            duration:1000,
            type: 'warning',
            message: '请输入合法的学号/工号'
          });
        }
      })
    },
  },
  // created() {
  //   var that=this;
  //   //  获得book 和需要后端controller的getAll
  //   axios.get('http://localhost:8080/book').then(function (resp) {
  //     that.books=resp.data;
  //   })
  // },
};
</script>

