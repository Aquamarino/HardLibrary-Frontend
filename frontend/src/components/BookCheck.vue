<template>
  <div>
    <el-container>
      <el-main>
        <el-form :model="damagedBooks" :rules="rules" name="checkBooks" label-position="left"
                 label-width="80px" v-loading="loading" :ref="damagedBooks" class="manage-container">
          <h1 class="upload_title" style="align-content: center">{{title}}</h1>
          <el-form-item
            v-for="(domain, index) in damagedBooks.isbns"
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
              :disabled="(damagedBooks.isbns.length===5)"
            >增加副本</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" @click="upload(damagedBooks)">确认</el-button>
          </el-form-item>
          <div style="width: 200px">
          <el-radio-group v-model="options" fill="#333333" border="false" @change="serviceChange">
            <el-radio-button label="damaged" border>损坏</el-radio-button>
            <el-radio-button label="lost" border>丢失</el-radio-button>
          </el-radio-group>
          </div>
<!--          <div style="padding-left: 85%">-->
<!--            <el-link type="info"-->
<!--                     @click="$router.push('searchHistory/searchHistoryRegistered')"-->
<!--                     icon="el-icon-question">-->
<!--              忘记哪本书？-->
<!--            </el-link>-->
<!--          </div>-->
        </el-form>
      </el-main>
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
  name: "BookCheck",
  inject:['reload'],
  data() {
    const checkIsbn = (rule, value, cb) => {
      const regIsbn = /^[0-9]{13}-\d{3}$/;
      if (regIsbn.test(value)){
        var count=0
        this.damagedBooks.isbns.forEach((item,index) => {
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
      damagedBooks: {
        username:'',
        isbn: '',
        name: '',
        isbns: [{
          value: ''
        }],
      },
      activeName: '1',
      books:[],
      options: 'damaged',
      title:'图书损坏登记',
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
      var index = this.damagedBooks.isbns.indexOf(item)
      if (index !== -1) {
        this.damagedBooks.isbns.splice(index, 1)
      }
    },
    addDomain() {
      this.damagedBooks.isbns.push({
        value: '',
        key: Date.now()
      });
    },
    serviceChange(){
      console.log(this.options)
      this.title=this.options==='damaged'?'图书损坏登记':'图书丢失登记'
    },
    upload(formName){
      var borrowData = new FormData();
      this.damagedBooks.isbns.forEach(item =>{
        var id=this.damagedBooks.isbns.indexOf(item)+1;
        borrowData.append('book_id'+id,item.value)
      });
      borrowData.append('library',localStorage.getItem('librarianWorkplace'));
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('/fine', {//接口？
              type:this.options,
              library:borrowData.get('library'),
              librarian:this.$store.state.username,
              book_id1:borrowData.get('book_id1'),
              book_id2:borrowData.get('book_id2'),
              book_id3:borrowData.get('book_id3'),
              book_id4:borrowData.get('book_id4'),
              book_id5:borrowData.get('book_id5'),
            }
          )
            .then(resp => {
              // 根据后端的返回数据修改
              if ((resp.status === 200||resp.status===201)&&resp.data===true) {
                this.$message({
                  type: 'success',
                  message: '登记成功'
                });
                this.reload()
              } else {
                this.$message({
                  type: 'warning',
                  message: "登记失败："+resp.data
                });
              }
            })
            .catch(error => {
              console.log(error);
              // alert('error')
            })
        } else {
          this.$message({
            type: 'warning',
            message: "请检查副本号"
          });
        }
      })
    },
  },
};
</script>

