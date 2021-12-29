<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="3" @click="exit">退出登陆</el-menu-item>
      <el-menu-item index="2"><router-link to="bookstatus">图书总览</router-link></el-menu-item>
      <el-menu-item index="1"><router-link to="upload">上传图书</router-link> </el-menu-item>
      <el-menu-item index="4"><router-link to="AdminModify">修改密码</router-link></el-menu-item>
      <el-radio-group v-model="radio" fill="#353a3f" style="position:absolute;margin-top: 10px;right: 31%">
        <el-radio-button label="isbn">ISBN</el-radio-button>
        <el-radio-button label="name">书名</el-radio-button>
        <el-radio-button  label="author">作者</el-radio-button>
      </el-radio-group>
      <el-autocomplete
        v-model="input"
        style="width: 300px;position:absolute;margin-top: 10px;right: 8%"
        :fetch-suggestions="querySearchAsync"
        placeholder="搜索图书..."
        @select="((item)=>{handleSelect(item)})">
      </el-autocomplete>
      <el-button icon="el-icon-search" circle style="position: absolute;margin-top: 10px;right: 3%" :plain="true" @click="Search"
      ></el-button>
    </el-menu>
    <el-alert
      v-if="warning"
      title="resp data error"
      type="warning">
    </el-alert>

    <el-divider><i class="el-icon-s-platform"></i><span >LAST SEARCH  :{{result}}</span></el-divider>
    <tr v-for="(book,index) in booksSearch.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key = 'index'>
      <el-container >
        <el-aside width="300px">
          <img :src="book.cover" alt="" class="cover-style" referrerpolicy="no-referrer"/>
        </el-aside>
        <el-container>
          <el-header> 《{{book.name}}》 | {{book.author}} | LIBRARY:{{book.library}}</el-header>
          <el-main>{{book.description}}</el-main>
          <el-footer> BOOK ID:{{book.book_id}}
            <!--            <input type="checkbox"-->
            <!--                   v-model="checks"-->
            <!--                   :id="book.book_id"-->
            <!--                   :value="book.book_id"-->
            <!--                   :disabled="checks.length>=2 && checked === false">-->
            <!--            <label :for="book.book_id">预约</label>-->
            <!--            <i class="el-icon-edit"></i>-->
            <el-button type="text" :disabled="book.status!=='available'" @click="open(book)" >预约</el-button>
          </el-footer>
        </el-container>
      </el-container>
      <el-divider/>
    </tr>
    <div class="block">
      <!--分页功能-->
      <el-pagination
        @size-change="handleSizeChange"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        :page-sizes="[1, 2, 3, 4]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="booksSearch.length">
      </el-pagination>
    </div>
  </div>


</template>

<script>
  import axios from 'axios'
  export default {
    inject:['reload'],
    name: 'BookSearch',

    data() {
      return {
        checks:[],
        result:this.$store.state.searchInput,
        //result:'',
        input:'',
        radio: 'isbn',
        currentPage:1, //初始页
        pagesize: 4,    //每页的数据量
        booksSearch:JSON.parse(this.$store.state.searchResult),
        rules: {
          input: [{required: true, message: '搜索内容不能为空', trigger: 'blur'}],
        },
        timeout :null,
        warning:false
      }
    },
    methods:{
      current_change(){  //改变当前页
        this.currentPage = currentPage;
        console.log(this.currentPage);//点击第几页
        this.lineCrodList();
      },
      handleSizeChange (size) {
        // 每页显示的数量是选择器选中的值size
        this.pagesize = size;
        console.log(this.pageSize);//每页下拉显示数据
        this.lineCrodList();
      },
      selectClick(book,index) {
        if (!book.isShow) {   // 判断是否有isShow属性
          this.$set(book, 'isShow', false)  // 没有则为当前对象设置该属性为false
          book.isShow = !book.isShow
        } else {
          book.isShow = !book.isShow
        }
      },
      exit() {
        //退出登录，清空token
        localStorage.removeItem('Authorization');
        localStorage.removeItem('username');
        this.$router.push('/login');
      },
      querySearchAsync(queryString, callback) {
        var bookList = [{
          value:'',
          author:'',
          name:'',
        }];
        axios.get('http://localhost:8080/book').then(({data}) => {
          this.books = data;
          for(let bookItem of this.books){
            switch (this.radio){
              case 'isbn':bookItem.value =bookItem.isbn;break
              case 'author':bookItem.value =bookItem.author;break
              case 'name':
              default:bookItem.value =bookItem.name;break
            }
          }
          bookList=data;
          let result = queryString ? bookList.filter(this.createStateFilter(queryString)) : bookList;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            callback(result);
          }, 1000 * Math.random());
        }).catch((error) => {
          console.log(error)
        })
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
      handleSelect(item) {
        console.log(item);
      },
      open(book) {
        this.$confirm('是否预约这本书?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () =>{
          var bookOne = book.book_id;
          axios.post('/reserve',{
            book_id:bookOne,
            username:this.$store.state.username
          }).then(resp=>{
            console.log("--" + resp.data)
            if ((resp.status === 200||resp.status===201)&&resp.data===true) {
              this.$message({
                message: "预约成功",
                type: "success",
              });
              this.$router.push('/info/infoAppointed')//到个人主页预约页面
            }else{
              this.reload()
            }
          }).catch(error=>{
            this.$message({
              type: 'info',
              message: 'ERROR:无法预约'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '再想想'
          });
        });
      },
      Search(){
        if(this.input !== '') {
          axios.post('/search', {
            type: this.radio,
            content: this.input
          })
            .then(resp => {
              if ((resp.status === 201 || resp.status === 200)) {
                if(resp.data ==='nothing'){
                  this.$message({message: '找不到相关书籍！'})
                  this.booksSearch = []
                } else {
                  this.$store.commit('searchResult', resp.data);
                  this.booksSearch = resp.data;
                  console.log("data2:" + this.$store.state.searchResult)
                }
              }else{
                this.warning = true;
              }
            })
            .catch(error => {
              console.log(error)
              this.warning = true;
            })
          var searchInput = this.input;
          console.log(searchInput)
          this.$store.commit('searchInput', searchInput);
          this.result = this.$store.state.searchInput;
        }else{
          this.$message('请输入内容');
        }
      },
    },
    mounted() {
      if(!this.$store.state.searchResult) {
        this.$router.push("/bookstatus");
      }
    },

  }

</script>

<style scoped>
  a{
    text-decoration: none;
  }

  span {
    pointer-events: none;
  }
  .el-menu{
    width: 100vw;
  }
  .el-container{
    width: 100vw;
  }
  .el-header{
    background-color:  #505458;
    color: #ffffff;
    text-align: center;
    line-height: 50px;
    height: 80px;
  }

  .el-aside {
    background-color: #faf9f9;
    color: #fffff7;
    text-align: center;
    padding-top: 5%;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 300px;
    text-align: justify;
    line-height: 30px;
  }
  .el-footer{
    background-color: #e3e4e7;
    text-align: left;
    height: 60px;
    line-height: 50px;
  }
  .cover-style{
    width: 80%;
  }

  .el-
  .el-button{
    background-color: #ffffff;
    color: #333;
    line-height: 60px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 60px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

</style>
