<template>
  <div style="width: 100%">
    <el-container @change="getData">
      <el-main>
        <div style="width: 100%">
          <el-table
            :data="infoAppointedForm"
            height="350">
            <el-table-column
              fixed
              prop="isbn"
              label="ISBN"
              width="350">
            </el-table-column>
            <el-table-column
              prop="name"
              label="书名"
              width="350">
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="comment"-->
<!--              label="评论"-->
<!--              width="300">-->
<!--            </el-table-column>-->
            <el-table-column
              fixed="right"
              label="评价">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-show="scope.row.comment === 'yes' "
                         v-on:click="checkComment(infoAppointedForm,scope.row,scope.$index)"
              >{{checkCommentBtn}}</el-button>
              <el-button type="text" size="small" v-show="scope.row.comment === 'no' "
                         v-on:click="handleComment(infoAppointedForm,scope.row,scope.$index)"
              >{{commentBtn}}</el-button>

              <el-dialog title="打分与评论" :visible.sync="dialogFormVisible1"
                         :append-to-body="true" width="60%">
                <el-form :model="commentForm" :rules="rules" :ref="commentForm">
                  <el-form-item label="打分（0-10分）" label-width="120" prop="score">
                    <el-input-number v-model="commentForm.score" controls-position="right" :min="0" :max="10"
                                     onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                     size="small"></el-input-number>
                  </el-form-item>
                  <el-form-item label="评论" label-width="120" prop="comment">

                    <el-input   type="textarea" maxlength="140"
                                show-word-limit
                                :rows="3" v-model="commentForm.comment" >
                    </el-input>


                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="closeDialog">取 消</el-button>
                  <el-button type="primary" @click="changeUserAuth(commentForm)">确 定</el-button>
                </div>
              </el-dialog>
            </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <div>
      <el-divider/>

      <el-table
        :data="cmtlist"
        height="300"
        border
        style="width: 96%;margin-left: 1%">

        <el-table-column
          prop="isbn"
          label="ISBN">
        </el-table-column>
        <el-table-column
          prop="name"
          label="书名">
        </el-table-column>

        <el-table-column
          prop="username"
          label="用户名">
        </el-table-column>

        <el-table-column
          prop="content"
          label="主楼评论">
          <template slot-scope="scope">
            <div v-show="scope.row.visible === 'yes' || scope.row.username === username">{{scope.row.content}}</div>
            <div v-show="scope.row.visible === 'no' && scope.row.username === username ">（该评论已被你/管理员隐藏）</div>
            <div v-show="scope.row.visible === 'no' && scope.row.username !== username ">该评论已被隐藏</div>
          </template>
        </el-table-column>

        <el-table-column
          prop="score"
          label="评分">
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">展示更多评论</el-button>
            <el-button @click="hide(scope.row)" type="text" size="small" v-show="scope.row.visible === 'yes' && scope.row.username === username ">隐藏评论</el-button>
            <el-button @click="reset(scope.row)" type="text" size="small" v-show="scope.row.visible === 'no' && scope.row.username === username">取消隐藏</el-button>
            <el-dialog
              title="更多评论"
              :visible.sync="dialogVisible"
              width="30%"
              :append-to-body="true"
              :before-close="handleClose">

              <div class="box-card">

                <div slot="header" class="clearfix">
                  <div class="cmt-item-title">用户：{{ mainComment.username }}
                    <time class="time">发表时间：{{ mainComment.date }}</time>
                    <div class="cmt-score">打分：{{mainComment.score}}</div>
                  </div>
                  <div class="cmt-item-body" v-show="mainComment.visible === 'yes' || mainComment.username === username">{{ mainComment.content }}</div>
                  <div v-show="mainComment.visible === 'no' && mainComment.username === username ">(该评论已被你/管理员隐藏)</div>
                  <div v-show="mainComment.visible === 'no' && mainComment.username !== username">该评论已被隐藏</div>
                </div>

                <el-divider/>

                <div v-for="(rep, i) in otherComments" :key="i" class="text item">
                  <div class="cmt-item-title">第{{rep.depth}}楼</div>
                  <div>用户：{{ rep.username }}</div>
                  <div>发表时间：{{ rep.date }}</div>
                  <div class="cmt-item-body" v-show="rep.visible === 'yes' ">评论内容：{{ rep.content }}</div>
                  <div class="cmt-item-body" v-show="rep.visible === 'no' ">该评论已被隐藏</div>
                  <div> <el-button @click="hide(rep)" type="text" size="small" v-show="rep.visible === 'yes' && rep.username === username ">隐藏评论</el-button><el-button @click="reset(rep)" type="text" size="small" v-show="rep.visible === 'no' && rep.username === username">取消隐藏</el-button> </div>
                  <el-divider/>
                </div>
              </div>

            </el-dialog>
          </template>
        </el-table-column>
      </el-table>




      <!--    <mt-button type="danger" size="large" plain @click="loadMore">加载更多</mt-button>-->

    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'userBookComment',
  inject:['reload'],
  data(){
    return {
      username : this.$store.state.username,
      dialogFormVisible1:false,
      dialogVisible : false,
      infoAppointedForm: [{
        id:'',
        bookId:'',
        isbn:'',
        name:'',
        comment:'',
      }],
      checkCommentBtn:'查看详情',
      commentBtn:'评论',
      rules: {
        score: [{required: true, message: '分数不能为空', trigger: 'blur'}],
        comment: [{required: true, message: '评论不能为空', trigger: 'blur'}]
      },
      commentForm:[{
        score:1,
        comment:'',
      }],
      type:'registered',
      count: 0,
      input:'',
      radio: 'isbn',
      score:8.2,
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
      otherComments : [
        {
        id:1,
        isbn:1111111111111,
        comment:'hhhh',
        score:8,
        inputVisible:false,
        replyText:'',
        }
      ],
      mainComment : [
        {

        }
      ],
      cmtlist: [], // 评论数组
      msg: "" ,// 即将发表的评论内容
      timeout :null,
      visibleHide:this.$store.state.userAuthority?1:false,
      tableData: [
        {
        id: '12987122',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        isbn: '1'
      }, {
        id: '12987123',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        isbn: '1'
      }, {
        id: '12987125',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        isbn: '1'
      }, {
        id: '12987126',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        isbn: '1'
      }]
    }
  },
  created() {
    axios.post('/judgeComment',{
      username:this.$store.state.username,
    })
      .then(resp => {
        if (resp.status === 200 || resp.status === 201){
          // console.log(resp.data);
          this.infoAppointedForm = resp.data;
        }
      });
    axios.post('/usercheckcomments',{
      username:this.$store.state.username,
    })
      .then(resp => {
        if (resp.status === 200 || resp.status === 201){
          this.cmtlist = resp.data;
          console.log(this.cmtlist);
        }
      })
  },
  methods:{
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    hide(rep){
      axios.post('/userhidecomments',{
        username : rep.username,
        isbn : rep.isbn,
        depth : rep.depth,
        date : rep.date
      })
      .then(resp => {
        if (resp.status === 200 || resp.status === 201){
          this.$message('隐藏评论成功')
          location.reload(3);
        }else{
          this.$message('不能隐藏其他用户的评论')
        }
      })
      .catch(error => {
        console.log(error);
        this.$message("不能隐藏其他用户的评论");
      })
    },
    reset(rep){
      axios.post('/userunhidecomments',{
        username : rep.username,
        isbn : rep.isbn,
        depth : rep.depth,
        date : rep.date
      })
      .then(resp => {
        if (resp.status === 200 || resp.status === 201){
          if (resp.data === "管理员隐藏的回复你也敢自行取消隐藏？"){
            this.$message("管理员隐藏的回复不能取消隐藏？")
          }else{
            this.$message("取消隐藏成功，请刷新")
            // location.reload(3);
          }
        }
      })
      .catch(error => {
        console.log(error);
        this.$message("不能取消隐藏其他用户的发言")
      })
    },
    handleComment(formName,row,index) {
      this.userTitle = row.name;
      this.infoAppointedForm.isbn = row.isbn;
      this.dialogFormVisible1=true;

      },
    checkComment(formName,row,index) {
      var jumpISBN = row.isbn;

      console.log(jumpISBN)
      /*跳转到isbn的详情页*/
      this.$store.commit('searchInput', jumpISBN);
      localStorage.setItem('bookDetail',jumpISBN)
      axios.post('/search', {
        type:'isbn',
        content: jumpISBN,
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
    closeDialog() {
      this.dialogFormVisible1 = false;

      //this.reload();
    },
    changeUserAuth(commentForm) {
      console.log(commentForm)
      var _isbn = this.infoAppointedForm.isbn;
      this.$refs[commentForm].validate(valid => {
        if(valid) {
          axios.post('/comment', {
            username: this.$store.state.username,
            comment: commentForm.comment,
            score: commentForm.score,
            isbn:_isbn,
          })
            .then(resp => {
              // 根据后端的返回数据修改
              if ((resp.status === 200 || resp.status === 201) && resp.data === true) {
                this.$message({
                  type: 'success',
                  message: "评论成功"
                });
                this.reload();
              } else {

                this.$message({
                  type: 'warning',
                  message: "失败：" + resp.data
                });
              }
            })
            .catch(error => {
              console.log(error);
              this.$message("出错")
              this.reload();
            })
          this.dialogFormVisible1 = false;
        }else{
          this.$message("不能提交空评价");
        }
      })
    },
    getData(){

    },
    format(score) {
      return '模拟'+score/10 + '分';
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
    replayComment(id,i){
      this.cmtlist[i].inputVisible=true;
    },
    postReply(item){
      console.log(item.id);
      console.log(item.replyText);
      console.log(this.booksSearch.isbn);
      axios.post('/replycomments', {
        username:this.$store.state.username,
        isbn:this.booksSearch.isbn,
        commentid:item.id,
        comment: item.replyText,
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
          //alert('error')
          this.$message('error');
        })
    },
    hideComment(id,i){
      console.log(this.visibleHide);
      console.log(id);
    },
    handleClick(row){
      this.dialogVisible = true;
      this.mainComment = row;
      console.log(row);
      axios.post('/checkreplys',{
        comment_id:row.commentId,
        isbn : row.isbn,
      }).then(resp => {
        if (resp.status === 201 || resp.status === 200){
          this.otherComments = resp.data;
        }else if(resp.status === 301 && resp.data === "UserNotExist"){
          this.$message('不可查看更多评论')
        }
      });
      console.log(this.otherComments);
    }
  }
}
</script>


<style scoped>
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

  .box-card {
    width: 90%;
    margin: 0 0;
    background-color: #f0f2f5;
  }
  span {
    pointer-events: none;
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

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .cmt-item-title{
    text-align: left;
    margin-bottom: 5px;
  }
  .cmt-item-body{
    text-align: left;
  }

  .time {
    font-size: 13px;
    color: #999;
  }
  .cmt-score{
    font-size: 20px;
    color: #007092;
    padding: 10px 0 ;
  }
</style>
