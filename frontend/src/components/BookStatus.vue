<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item></el-menu-item>
<!--      <el-menu-item index="2" >图书总览</el-menu-item>-->
<!--      <el-menu-item index="4"><router-link to="/info">个人主页</router-link></el-menu-item>-->
<!--      <el-menu-item index="4"><router-link to="/fineInfo">查看罚款</router-link></el-menu-item>-->
<!--      <el-menu-item index="5"><router-link to="/history">查看历史记录</router-link></el-menu-item>-->
      <el-autocomplete
        v-model="input"
        style="width: 300px;position:absolute;margin-top: 10px;right: 8%"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入书名、isbn或作者名"
        @select="((item)=>{handleSelect(item)})">
      </el-autocomplete>
      <el-radio-group v-model="radio" fill="#353a3f" style="position:absolute;margin-top: 10px;right: 31%">
        <el-radio-button label="isbn">ISBN</el-radio-button>
        <el-radio-button label="name">书名</el-radio-button>
        <el-radio-button  label="author">作者</el-radio-button>
      </el-radio-group>
      <el-button icon="el-icon-search" circle
      style="position: absolute;margin-top: 10px;right: 3%"
      @click="Search"
      ></el-button>
   </el-menu>

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
            <el-link type="primary" @click="goBookDetail(book.isbn)">查看详情</el-link></el-footer>
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
          score:'',
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
      axios.get('/book').then(({data}) => {
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
    goBookDetail(bookISBN){
      console.log(bookISBN)
      this.$store.commit('searchInput', bookISBN);
      localStorage.setItem('bookDetail',bookISBN)
      axios.post('/search', {
        type:'isbn',
        content: this.input,
      }).then(resp => {
        if ((resp.status === 201 || resp.status === 200)) {
          console.log(resp.data[0])
          this.$router.push({name:'BookDetail'})
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
                this.$router.push("booksearch");
              }
            }else{
              // alert("resp data error")
            }
          })
          .catch(error => {
            console.log(error)
            // alert('error')
          })
        var searchInput = this.input;
        this.result = this.$store.state.searchInput;
      }else{
        this.$message("请输入内容")
        // alert('请输入内容')
      }

    },
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
