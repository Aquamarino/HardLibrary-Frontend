<template>
  <div>
      <el-container>
        <el-aside width="400px">
          <img :src="booksSearch.cover" alt="" class="cover-style" referrerpolicy="no-referrer"/>
          <el-progress type="circle" :percentage="score*10" :format="format"></el-progress>
        </el-aside>
        <el-container>
          <el-header> 《{{booksSearch.name}}》 | {{booksSearch.author}} | 分类：{{booksSearch.category}}</el-header>
          <el-main>{{booksSearch.description}}

          </el-main>
          <el-footer> ISBN:{{booksSearch.isbn}}</el-footer>
        </el-container>
      </el-container>
      <el-divider/>

    <div class="cmt-list">
      <div class="cmt-item" v-for="(item, i) in cmtlist.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="i">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
<!--            <div class="cmt-item-title">第{{item.id}}楼</div>-->
              <div class="cmt-item-title">用户：{{ item.username }}
                <time class="time">发表时间：{{ item.date }}</time>
                <div class="cmt-score">打分：{{item.score}}</div>
              </div>
            <div class="cmt-item-body" v-show="item.visible === 'yes' ">{{ item.content }}</div>
            <div class="cmt-item-hide-body" v-show="item.visible === 'no' ">已隐藏</div>
            <el-button style="float: right; padding: 3px 0" type="text" @click="replayComment(item,i)"><i class="el-icon-more"></i></el-button>
            <div v-show="item.inputVisible" style="text-align: right">
              <div v-for="(rep, i) in item.replyList" :key="i" class="text item">
                <div class="cmt-item-title">第{{rep.depth}}楼;用户：{{ rep.username }}</div>
                <time class="time">发表时间：{{ rep.date }}</time>
                <div class="cmt-item-body">{{ rep.content }}</div>
                <!--            <el-button v-show="visibleHide" style="float: right; padding: 3px 0" type="text"-->
                <!--                       @click="hideComment(rep.id,i)">-->
                <!--              回复-->
                <!--            </el-button>-->
              </div>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="item.replyText"
              maxlength="140"
              show-word-limit>
            </el-input>
              <el-button type="text" @click="item.inputVisible=false">取消</el-button>
            <el-button type="text" @click="postReply(item)">确认</el-button>
            </div>
          </div>

        </el-card>

      </div>
      <div class="block">
        <!--分页功能-->
        <el-pagination
          @size-change="handleSizeChange"
          :current-page.sync="currentPage"
          :page-size="pagesize"
          :page-sizes="[1, 2, 3, 4]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cmtlist.length">
        </el-pagination>
      </div>
  </div>


<!--    <mt-button type="danger" size="large" plain @click="loadMore">加载更多</mt-button>-->

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Book',
  inject:['reload'],
  data() {
    return {
      count: 0,
      input:'',
      radio: 'isbn',
      currentPage:1, //初始页
      pagesize: 4,    //每页的数据量
      replyText:'',
      booksSearch:[
        {
          cover:'',
          name: '',
          author: '',
          category: '',
          description: '',
          isbn: '',

          checked:true,
        }
      ],
      page: 1, // 默认展示第一页的评论
      cmtlist: [{}],
      msg: "" ,// 即将发表的评论内容
      timeout :null,
      visibleHide:this.$store.state.userAuthority?1:false,
    }
  },
  created() {
    var _book = localStorage.getItem('bookDetail');
    var commentlist;
    console.log("详情:")
    console.log(this.$store.state.searchInput)
    axios.post('/search', {
      type:'isbn',
      content:_book,
    }).then(resp => {
      if ((resp.status === 201 || resp.status === 200)) {
        localStorage.setItem('bookDetail',_book)
        this.booksSearch = resp.data[0];
        console.log( this.booksSearch)
      }
    })
      .catch(error => {
        console.log(error)
        // alert('error')
      })
    axios.post('/usercheckbookcomments', {
      isbn:_book,
    }).then(resp => {
      if ((resp.status === 201 || resp.status === 200)) {
        commentlist = resp.data;
        for(var i= 0;i<commentlist.length;i++) {
          commentlist[i].replyText = '';
          commentlist[i].inputVisible = false;
          commentlist[i].replyList=[];
        }
        this.cmtlist = commentlist;
        console.log( this.cmtlist)
      }
    })
      .catch(error => {
        console.log(error)
        // alert('error')
      })
  },
  methods:{
    format(score) {
      if(this.score && this.score !==-1)
        return this.score + '分';
      else
        return '暂无评分';
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
    replayComment(item,i){
      console.log("回复：")
      console.log(item)

      axios.post('/checkreplys', {
        comment_id:item.commentId,
        isbn:this.booksSearch.isbn,
      }).then(resp => {
        if ((resp.status === 201 || resp.status === 200)) {
          console.log(resp.data)
          item.inputVisible=true;
          item.replyList = resp.data;
        }
      })
        .catch(error => {
          console.log(error)
          // alert('error')
        })
    },
    postReply(item){
      // console.log(item.id);
      // console.log(item.replyText);
      // console.log(this.booksSearch.isbn);
      axios.post('/replycomments', {
        username:this.$store.state.username,
        isbn:this.booksSearch.isbn,
        commentid:item.commentId,
        comment: item.replyText,
      })
        .then(resp => {
          if ((resp.status === 201 || resp.status === 200)) {
            this.$message({
              duration:1000,
              type: 'success',
              message: resp.data,
            });
            this.reload();
          }else{
            this.$message({
              duration:1000,
              type: 'warning',
              message: resp.data,
            });
          }
        })
        .catch(error => {
          console.log(error)
          //alert('error')
          this.$message('error');
        })
    },
    hideComment(id,i){
      console.log(this.visibleHide);
      console.log(id);
    },
  },
  computed:{
    score:function (){
      return this.booksSearch.average_score;
    }
  },
}

</script>

<style scoped>
a{
  text-decoration: none;
}

.text {
  font-size: 14px;
  text-align: left;
}

.item {
  margin-bottom: 18px;
  text-align: left;
}
.cmt-item-title{
  text-align: left;
  margin-bottom: 5px;
}
.cmt-item-body{
  text-align: left;
}
.clearfix{

}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 90%;
  margin: 0 5%;
  background-color: #f0f2f5;

}
.time {
  font-size: 13px;
  color: #999;
  padding-left: 70%;
}
.cmt-score{
  font-size: 20px;
  color: #007092;
  padding: 10px 0 ;
}
.cmt-item-hide-body{
  background-color: #eadcdc;
  border: brown 2px;
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
