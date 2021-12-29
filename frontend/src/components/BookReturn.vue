<template>
  <div>
    <el-container>

      <el-main>
        <el-form :model="adminReturn" :rules="rules" name="lendBooks" label-position="left"
                 label-width="80px" v-loading="loading" :ref="adminReturn" class="manage-container">
          <h1 class="upload_title" style="align-content: center">{{options}}</h1>
          <el-form-item
            v-for="(domain, index) in adminReturn.isbns"
            :key="domain.key"
            :label="'副本号'"
            :prop="'isbns.'+index+'.value'"
            :rules ="MoreRules.AddISBN">
            <el-input v-model="domain.value" type="text"  auto-complete="off"  style="width: 300px" placeholder="BOOK ID"></el-input>
            <el-button @click.prevent="removeDomain(domain)">删除副本</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="addDomain"
              :disabled="(adminReturn.isbns.length===5)"
            >增加副本</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" v-on:click="upload(adminReturn)">确认</el-button>
          </el-form-item>
          <div style="padding-left: 70%">
<!--          <el-link type="info" @click="$router.push('searchHistory/searchHistoryRegistered')" icon="el-icon-question">图书丢失</el-link>-->
<!--            <el-divider direction="vertical"></el-divider>-->
          <el-link type="info"  icon="el-icon-warning" @click="$router.push({name:'BookCheck'})">
            图书损坏<el-divider direction="vertical"></el-divider>丢失</el-link>
          </div>
        </el-form>
      </el-main>
<!--      <el-main width="500px" style="background-color: rgb(255,255,255);color: #e2e5e8;margin-left: 0">-->
<!--        <el-table-->
<!--          :data="books"-->
<!--          height="100%"-->
<!--          border-->
<!--          style="width: 100%">-->
<!--          <el-table-column-->
<!--            prop="isbn,name"-->
<!--            label="ISBN(副本)"-->
<!--            width="250">-->
<!--            <template slot-scope="scope">-->
<!--              <span>副本号：{{scope.row.isbn}}<br/>书名：<<{{scope.row.name}}>></span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            prop="cover"-->
<!--            label="COVER(预览)"-->
<!--            width="210">-->
<!--            <template slot-scope="scope">-->
<!--              <img  :src="scope.row.cover" alt="" class="cover-show" referrerpolicy="no-referrer">-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </el-main>-->

    </el-container>

  </div>
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
  margin-left:250px ;
  padding:  35px 35px 15px 35px;
  width:700px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #343434;
  border-radius: 15px;
}
.cover-show{
  height:200px
}

</style>

<script>
import axios from 'axios'
export default {
  name: "BookReturn",
  inject:['reload'],
  data() {
    const checkIsbn = (rule, value, cb) => {
      const regIsbn = /^[0-9]{13}-\d{3}$/;
      if (regIsbn.test(value)){
        var count=0
        this.adminReturn.isbns.forEach((item,index) => {
          if (value === item.value) {
            count++
          }
        })
        if(count >1){
          cb(new Error('不要输入相同的副本号'))
        }else{
          return cb();
        }
      }else {
        cb(new Error('请输入合法的副本号'))
      }
    };
    return {
      adminReturn: {
        username:'',
        isbn: '',
        name: '',
        isbns: [{
          value: ''
        }],
      },
      activeName: '1',
      books:[],
      options: '现场还书',
      value: '',
      librarian:this.$store.state.username,
      //library:localStorage.getItem('librarianWorkplace'),
      library:this.$store.state.librarianWorkplace,
      MoreRules:{
        AddISBN: [{required: true, message: '请输入副本号', trigger: 'blur'}, {validator: checkIsbn, trigger: ['blur','change']}]
      },
      rules: {
        //username: [{required: true, message: '学号不能为空', trigger: 'blur'}],
        //isbn: [{required: true, message: '请输入副本号', trigger: 'blur'}, {validator: checkIsbn, trigger: 'blur'}],
        //name: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
      },
      loading: false,
    }
  },
  methods:{
    removeDomain(item) {
      var index = this.adminReturn.isbns.indexOf(item)
      if (index !== -1) {
        this.adminReturn.isbns.splice(index, 1)
      }
    },
    addDomain() {
      this.adminReturn.isbns.push({
        value: '',
        key: Date.now()
      });
    },
    upload(formName){
      var borrowData = new FormData();
      this.adminReturn.isbns.forEach(item =>{
        var id=this.adminReturn.isbns.indexOf(item)+1;
        borrowData.append('book_id'+id,item.value)
      });
      borrowData.append('library',localStorage.getItem('librarianWorkplace'));
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('/recordReturn', {
            library:borrowData.get('library'),
            book_id1:borrowData.get('book_id1'),
            book_id2:borrowData.get('book_id2'),
            book_id3:borrowData.get('book_id3'),
            book_id4:borrowData.get('book_id4'),
            book_id5:borrowData.get('book_id5'),
            librarian:localStorage.getItem('username'),
            }
          )
            .then(resp => {
              // 根据后端的返回数据修改
              if ((resp.status === 200||resp.status===201)&&resp.data===true) {
                this.$message({
                  duration:1000,
                  type: 'success',
                  message: '还书成功'
                });
               this.reload()
              } else {
                // if (resp.data==='false library'){
                //   this.$message({
                //     type: 'info',
                //     message: '错误的图书馆'
                //   });}else if(resp.data ==='false status')
                // {this.$message({
                //     type: 'info',
                //     message: '错误的图书状态'
                //   });}
                // else if(resp.data ===false)
                // {this.$message({
                //     type: 'info',
                //     message: '找不到图书'
                //   });}else{
                //   this.$message({
                //     type: 'info',
                //     message: resp.data
                //   });
                // }
                  this.$message({
                    duration:1000,
                    type: 'warning',
                    message: "还书失败："+resp.data
                  });
              }
            })
            .catch(error => {
              console.log(error);
              // alert('error')
            })
        } else {
          this.$message({
            duration:1000,
            type: 'warning',
            message: "请检查副本号"
          });
        }
      })
    },
  },
  created() {
    var that=this;
    //  获得book 和需要后端controller的getAll
    axios.get('/book').then(function (resp) {
      that.books=resp.data;
    })
  },
};
</script>

