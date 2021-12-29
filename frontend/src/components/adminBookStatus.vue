<template>
  <div>
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
      <el-menu-item index="9" @click="$router.push({name:'searchCredit'})">用户信用管理</el-menu-item>
      <el-submenu index="8">
        <template slot="title">系统记录</template>
        <el-menu-item index="8-1" @click="$router.push({name:'copyHistoryInfo'})">副本记录查询</el-menu-item>
        <el-menu-item index="8-2" @click="$router.push({name:'searchHistory'})">用户记录查询</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">超管工作台</template>
        <el-menu-item index="5-1" @click="$router.push({name:'addAuthority'})">添加管理员</el-menu-item>
        <el-menu-item index="5-2" @click="$router.push({name:'UserManagement'})">用户管理</el-menu-item>
        <el-menu-item index="5-3" @click="$router.push({name:'resetUser'})">重置用户信用</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-alert
      v-if="warning"
      title="resp data error"
      type="warning">
    </el-alert>
    <el-alert
      v-if="information"
      title="resp data error"
      type="info">
    </el-alert>
    <tr v-for="(book,index) in books.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key = 'index'>
      <!--for循环展示所有书籍-->
      <el-container>
        <el-aside width="300px">
          <!--          <img :src="book.cover" alt=""/>-->
          <img :src="book.cover" alt="" class="cover-style" referrerpolicy="no-referrer"/>
          <el-rate
            v-model="book.average_score/2"
            disabled
            show-score
            text-color="#ff9900"
            :score-template="book.average_score===-1.0?'暂无评分':JSON.stringify(book.average_score)">
          </el-rate>
        </el-aside>
        <el-container>
          <el-header> 《{{book.name}}》 | {{book.author}} | 分类：{{book.category}}</el-header>
          <el-main>{{book.description}}</el-main>
          <el-footer> ISBN:{{book.isbn}}
            <el-link type="primary"  @click="getISBN(book.isbn,book.cover)"> 查看副本 </el-link>
            <el-link type="primary" @click="goBookDetail(book.isbn)">查看详情</el-link>

<!--            <div><i class="el-icon-reading">{{book.average_score}}</i></div>-->

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
        :total="books.length">
      </el-pagination>
    </div>
  </div>


</template>

<script>
  import axios from 'axios'
  export default {
    name: 'Book',
    data() {
      return {
        input:'',
        radio: 'isbn',
        currentPage:1, //初始页
        pagesize: 4,    //每页的数据量
        books:[
          {
            name: '',
            author: '',
            category: '',
            description: '',
            isbn: '',
            cover:'',
            average_score:'',
          }
        ],
        booksSearch:[
          {
            name: '',
            author: '',
            category: '',
            description: '',
            isbn: '',
            cover:'',
            checked:true,
          }
        ],
        timeout :null,
        warning:false,
        information:false,
        librarian:this.$store.state.username,
        library:localStorage.getItem('librarianWorkplace')
      }
    },
    created() {
      var that=this;
      //  获得book 和需要后端controller的getAll
      axios.get('/book').then(function (resp) {
        that.books=resp.data;
      })
    },
    methods:{
      getISBN(isbn,cover){
        this.$store.commit('setSearchIsbn', isbn);
        console.log(this.$store.state.isbn);
        this.$store.commit('setSearchCover',cover);
        console.log(this.$store.state.cover);
        this.$router.push('/copyInfo')
      },
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
      log_out(){
        localStorage.removeItem('Authorization');
        localStorage.removeItem('username');
        localStorage.removeItem('librarianWorkplace');
        localStorage.removeItem('userAuthority');
        this.$router.push('/adminlogin')
      },
      querySearchAsync(queryString, callback) {
        var bookList = [{
          value:'',
          author:'',
          name:'',
        }];
        axios.get('/book').then(({data}) => {
          // this.books = data;
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
      goBookDetail(bookISBN){
        console.log(bookISBN)
        this.$store.commit('searchInput', bookISBN);
        localStorage.setItem('bookDetail',bookISBN)
        axios.post('/search', {
          type:'isbn',
          content: this.$store.state.searchInput,
        }).then(resp => {
          if ((resp.status === 201 || resp.status === 200)) {
            console.log(resp.data[0])
            this.$router.push({name:'adminBookDetail'})
          }
        })
          .catch(error => {
            console.log(error)
            // alert('error')
          })
      },
      Search(){
        if(this.input !== '') {
          this.$store.commit('searchInput', this.input);
          console.log(this.radio,this.input)
          axios.post('/search', {
            type: this.radio,
            content: this.input
          })
            .then(resp => {
              if ((resp.status === 201 || resp.status === 200)) {
                if(resp.data ==='nothing'){
                  this.$message({message: '找不到相关书籍！'})
                  this.$store.commit('searchResult', '')
                } else{
                  this.$store.commit('searchResult', resp.data);
                  this.booksSearch = resp.data;
                  console.log("data:" + this.$store.state.searchResult)
                  this.$router.push("/adminBookSearch");
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
          this.result = this.$store.state.searchInput;
        }else{
          this.information = true;
        }

      },
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
