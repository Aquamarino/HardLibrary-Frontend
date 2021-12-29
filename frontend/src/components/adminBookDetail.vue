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
    <el-container>
      <el-aside width="400px">
        <img :src="booksSearch.cover" alt="" class="cover-style" referrerpolicy="no-referrer"/>
        <el-progress type="circle" :percentage="score*10" :format="format"></el-progress>
      </el-aside>
      <el-container>
        <el-header> 《{{booksSearch.name}}》 | {{booksSearch.author}} | 分类：{{booksSearch.category}}</el-header>
        <el-main>{{booksSearch.description}}</el-main>
        <el-footer> ISBN:{{booksSearch.isbn}}</el-footer>
      </el-container>
    </el-container>
    <el-divider/>

    <div class="cmt-list">
      <div class="cmt-item" v-for="(item, i) in cmtlist.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="i">
        <el-card class="box-card">
          <div slot="header" class="clearfix" v-show="item.visible === 'yes'">
            <div class="cmt-item-title">用户：{{ item.username }}
              <time class="time">发表时间：{{ item.date }}</time>
              <div class="cmt-score">打分：{{item.score}}</div>
            </div>
            <div class="cmt-item-body">{{ item.content }}</div>
            <el-button style="float: right; padding: 3px 10px" type="text"
                       @click="hideComment(item,i)">
              隐藏
            </el-button>
            <el-button style="float: right; padding: 3px 10px" type="text"
                       @click="viewMore(item,i)">
              <i class="el-icon-more"></i>
            </el-button>
          </div>
          <div class="cmt-item-title" v-show="item.visible === 'no'">用户：{{ item.username }}
            <time class="time">发表时间：{{ item.date }}</time>
            <div class="cmt-score">打分：{{item.score}}</div>
            <div class="cmt-item-hide-body">{{ item.content }}（已被隐藏）</div>
            <el-button style="float: right; padding: 3px 0" type="text"
                       @click="unHideComment(item,i)">
              取消隐藏
            </el-button>
            <el-button style="float: right; padding: 3px 10px" type="text"
                       @click="viewMore(item,i)">
              <i class="el-icon-more"></i>
            </el-button>
          </div>
          <div v-show="item.inputVisible" style="text-align: right">
<!--            <el-input-->
<!--              type="textarea"-->
<!--              :rows="2"-->
<!--              placeholder="请输入理由"-->
<!--              v-model="item.replyText"-->
<!--              maxlength="140"-->
<!--              show-word-limit>-->
<!--            </el-input>-->
<!--            <el-button type="text" @click="item.inputVisible=false">取消</el-button>-->
<!--            <el-button type="text" @click="postReply(item)">确认</el-button>-->
            <div v-for="(rep, i) in item.replyList" :key="i" class="text item">
              <div class="cmt-item-title" v-show="rep.visible === 'yes'">第{{rep.depth}}楼;用户：{{ rep.username }}
                <time class="time">发表时间：{{ rep.date }}</time>
                <div class="cmt-item-body" >{{ rep.content }}</div>
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="hideComment(rep,i)">
                  隐藏
                </el-button></div>


              <div class="cmt-item-title" v-show="rep.visible === 'no'">第{{rep.depth}}楼;用户：{{ rep.username }}
                <time class="time">发表时间：{{ rep.date }}</time>
                <div class="cmt-item-hide-body">{{ rep.content }}（已被隐藏）</div>
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="unHideComment(rep,i)">
                  取消隐藏
                </el-button>
              </div>

            </div>
          </div>


        </el-card>
        <el-dialog :title="'-权限修改'" :visible.sync="dialogFormVisible" :append-to-body="true" width="60%">
          <el-form :model="hideForm">
            <el-form-item label="隐藏评论" label-width="120">
              {{hideForm.username}}:"{{hideForm.content}}"
                              <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入理由"
                                v-model="hideForm.reason"
                                maxlength="140"
                                show-word-limit>
                              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="postHide(hideForm)">确 定</el-button>
          </div>
        </el-dialog>
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


  </div>
</template>

<script>
import axios from 'axios'
export default {
  inject:['reload'],
  name: 'adminBookDetail',
  data() {
    return {
      count: 0,
      input:'',
      radio: 'isbn',
      currentPage:1, //初始页
      pagesize: 4,    //每页的数据量
      replyText:'',
      dialogFormVisible:false,
      booksSearch:
        {
          cover:'',
          name: '',
          author: '',
          category: '',
          description: '',
          isbn: '',
          checked:true,
        },
      hideForm:{
        depth:'',
        date:'',
        username:'',
        isbn:'',
        reason:'',
      },
      page: 1, // 默认展示第一页的评论
      cmtlist:[{}],
      msg: "" ,// 即将发表的评论内容
      timeout :null,
      visibleHide:this.$store.state.userAuthority?1:false,
      librarian:this.$store.state.username,
      library:localStorage.getItem('librarianWorkplace'),
    }
  },
  created() {
    var _book = localStorage.getItem('bookDetail');
    console.log(_book)
    var commentlist;
    axios.post('/search', {
      type:'isbn',
      content:_book,
    }).then(resp => {
      if ((resp.status === 201 || resp.status === 200)) {
        localStorage.setItem('bookDetail',_book)
        this.booksSearch = resp.data[0];
        console.log("详情::")
        console.log( this.booksSearch)
      }
    })
      .catch(error => {
        console.log(error)
        // alert('error')
      })
    axios.post('/admincheckbookcomments', {
      isbn:_book,
    }).then(resp => {
      if ((resp.status === 201 || resp.status === 200)) {
        commentlist = resp.data;
        for(var i= 0;i<commentlist.length;i++) {
          commentlist[i].replyText = '';
          commentlist[i].inputVisible = false;
          commentlist[i].replyList=[{}];
        }
       this.cmtlist = commentlist;
        console.log("cmt")
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
    log_out(){
      localStorage.removeItem('Authorization');
      localStorage.removeItem('username');
      localStorage.removeItem('librarianWorkplace');
      localStorage.removeItem('userAuthority');
      this.$router.push('/adminlogin')
    },
    handleSelect(item) {
      console.log(item);
    },
    openDialog(index, row,n) {
      this.userTitle = row.name;
      this.userIs = row.nameToCh;
      switch (n){case 1:this.dialogFormVisible1=true;this.limitTitle='book_number';break;
        case 2:this.dialogFormVisible2=true;this.limitTitle='reserve_time';break;
        case 3:this.dialogFormVisible3=true;this.limitTitle='borrow_time';break;
        default:break;}
      this.userAuthForm = JSON.parse(JSON.stringify(this.tableData[index]));
      console.log(this.userAuthForm )
    },
    closeDialog() {
      this.dialogFormVisible = false;
      //this.reload();
    },
    postReply(item){
      console.log(item.id);
      console.log(item.comment);
      console.log(item.replyText);
      axios.post('/hideComment', {
        depth:item.depth,
        reason:item.replyText,
        date:item.date,
        username:item.username,
        isbn:this.booksSearch.isbn,})
        .then(resp => {
          if ((resp.status === 201 || resp.status === 200) && resp.data ===true) {

            item.inputVisible = false;
            this.$message({
              duration:1000,
              type: 'success',
              message: '隐藏成功'
            });
            this.reload();
          }else{
            this.$message({
              duration:1000,
              type: 'warning',
              message: '隐藏失败'
            });
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    postHide(hideForm){
      console.log(hideForm);
      axios.post('/hideComment', {
        depth:hideForm.depth,
        reason:hideForm.reason,
        date:hideForm.date,
        username:hideForm.username,
        isbn:this.booksSearch.isbn,})
        .then(resp => {
          if ((resp.status === 201 || resp.status === 200) && resp.data ===true) {

            this.dialogFormVisible = false;
            this.$message({
              duration:1000,
              type: 'success',
              message: '隐藏成功'
            });
            this.reload();
          }else{
            this.$message({
              duration:1000,
              type: 'warning',
              message: '隐藏失败'
            });
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    viewMore(item,i){
        item.inputVisible = true;
      axios.post('/checkreplys', {
        comment_id:item.commentId,
        isbn:this.booksSearch.isbn,
      }).then(resp => {
        if ((resp.status === 201 || resp.status === 200)) {
          console.log(resp.data)
          item.replyList = resp.data;
          console.log(item.replyList);
        }
      })
        .catch(error => {
          console.log(error)
          // alert('error')
        })
    },
    hideComment(item,i){
      this.dialogFormVisible = true;
      this.hideForm = JSON.parse(JSON.stringify(item));
      axios.post('/checkreplys', {
        comment_id:item.commentId,
        isbn:this.booksSearch.isbn,
      }).then(resp => {
        if ((resp.status === 201 || resp.status === 200)) {
          console.log(resp.data)
          item.replyList = resp.data;
          console.log(item.replyList);
        }
      })
        .catch(error => {
          console.log(error)
          // alert('error')
        })
    },
    unHideComment(item,i){
      //item.inputVisible = true;
      axios.post('/unhideComment', {
        depth:item.depth,
        date:item.date,
        username:item.username,
        isbn:this.booksSearch.isbn,
      })
        .then(resp => {
          if ((resp.status === 201 || resp.status === 200) && resp.data ===true) {
            this.$message({
              duration:1000,
              type: 'success',
              message: '取消隐藏成功'
            });
            this.reload();
          }else{
            this.$message({
              duration:1000,
              type: 'warning',
              message: '取消隐藏失败'
            });
          }
        })
        .catch(error => {
          console.log(error)
        })
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
    },
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
.cmt-item-hide-body{
  background-color: #eadcdc;
  border: brown 2px;
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
