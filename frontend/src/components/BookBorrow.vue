<template>
  <div>
    <el-container>
        <el-main >
            <!--drawer:用户信息表单-->
          <el-drawer
            title="填写用户信息" :visible.sync="dialog" direction="ltr" custom-class="demo-drawer" ref="drawer"
            :destroy-on-close="true" :append-to-body="true">
            <div class="demo-drawer__content">
              <el-form :model="UserForm" :rules="UserFormRules" :ref="UserFormRules">
                <el-form-item prop="username" label="借书人" :label-width="formLabelWidth">
                  <el-input v-model="UserForm.username" autocomplete="off" placeholder="输入学号/工号"></el-input>
                </el-form-item>
                <el-form-item prop="firstTitle" label="身份" :label-width="formLabelWidth" >
                  <el-select  v-model="UserForm.firstTitle" placeholder="选择用户身份">
                    <el-option
                      v-for="item in userTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="checkLibrarian" label="管理员" :label-width="formLabelWidth">
                  <el-input v-model="UserForm.checkLibrarian" autocomplete="off"  placeholder="管理员" :disabled="true"></el-input>
                </el-form-item>
              </el-form>
              <span style="padding: 10px;color: #cd0303">{{errorUser}}</span>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm('UserForm')">取消</el-button>
<!--               <el-button type="primary" v-on:click="userCheck(UserForm)">{{'确 定' }}</el-button>-->
                <el-button type="primary" class="submit" @click="userCheck(UserFormRules)" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
              </div>
            </div>
          </el-drawer>
            <!--借书表单          -->
          <el-form :model="adminBorrow" :rules="MoreRules" name="lendBooks" label-position="left"
                   :validate-on-rule-change="true"
                   label-width="80px" ref="adminBorrow" class="manage-container">
            <h1 class="upload_title" style="align-content: center">现场借书</h1>
            <el-form-item
              v-for="(domain, index) in adminBorrow.isbns"
              :key="domain.key"
              :label="'副本号'"
              :ref="domain.index"
              :prop="'isbns.'+index+'.value'"
              :rules ="MoreRules.AddISBN">
              <el-input v-model="domain.value" type="text"  auto-complete="off"  style="width: 300px" placeholder="BOOK ID"></el-input>
              <el-button @click.prevent="removeDomain(domain)">删除副本</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="addDomain"
                :disabled="(adminBorrow.isbns.length===5)"
              >增加副本</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="submit" v-on:click="upload(adminBorrow)" :plain="true">确认</el-button>
            </el-form-item>
          </el-form>
        </el-main>
<!--      <el-main width="550px" style="background-color: rgb(44,44,50);color: #e2e5e8;padding: 40px">-->
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
#paper{
 background-color: transparent;
}
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
  name: "BookBorrow",
  inject:['reload'],
  data() {
    var isSelect = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    var checkIsbn = (rule, value, cb) => {
      const regIsbn = /^[0-9]{13}-\d{3}$/;
      if (regIsbn.test(value)){
        var count=0
        this.adminBorrow.isbns.forEach((item,index) => {
         // console.log("id:::"+index)
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
      UserForm: {
        username: '',
        checkLibrarian: localStorage.getItem('username'),
        firstTitle:'',
      },
      errorUser:'',
      formLabelWidth: '80px',
      timer: null,
      dialog:false,
      adminBorrow: {
        username:'',
        isbn: '',
        name: '',
        isbns: [{
          value: ''
        }],
      },
      userTypes: [{
        value: 'Teacher',
        label: '老师'
      }, {
        value: 'Postgraduate',
        label: '研究生'
      }, {
        value: 'Undergraduate',
        label: '本科生'
      }],
      activeName: '1',
      books:[],
      options: '现场借书',
      value: '',
      librarian:this.$store.state.username,
      library:localStorage.getItem('librarianWorkplace'),
      //library:this.$store.state.librarianWorkplace,
      MoreRules:{
        AddISBN: [{required: true, message: '请输入副本号', trigger: 'blur'}, {validator: checkIsbn, trigger: ['blur','change']}]
      },
      // rules: {
      //   //username: [{required: true, message: '学号不能为空', trigger: 'blur'}],
      //   //isbn: [{required: true, message: '请输入副本号', trigger: 'blur'}, {validator: checkIsbn, trigger: 'blur'}],
      //   //name: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
      // },
      UserFormRules:{
        username: [{required: true , message: '学号/工号不能为空', trigger: ['blur']}],
        checkLibrarian: [{required: true, message: '管理员账号不能为空', trigger: ['blur']}],
        firstTitle:[{required: true , message: '身份不能为空',trigger: 'change',validator: isSelect}],
      },
      loading: false,
    }
  },
  mounted() {
    this.sidebarItem = this.$route.name;
  },
  methods:{
    removeDomain(item) {
      var index = this.adminBorrow.isbns.indexOf(item)
      if (index !== -1) {
        this.adminBorrow.isbns.splice(index, 1)
      }
    },
    addDomain() {
      this.adminBorrow.isbns.push({
        value: '',
        key: Date.now()
      });
    },
    serviceChange(name){//跳转路由
      this.$router.push({name:'Book'+name});
    },


    cancelForm(formName) {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
      //this.reload();
    },
    upload(formName1){
      var borrowData = new FormData();
      this.adminBorrow.isbns.forEach(item =>{
        var id=this.adminBorrow.isbns.indexOf(item)+1;
        borrowData.append('book_id'+id,item.value)
      });
      borrowData.append('library',localStorage.getItem('librarianWorkplace'))

      this.$refs['adminBorrow'].validate(valid => {
        if (valid) {
          axios.post('/recordBorrow1', {
            book_id1: borrowData.get('book_id1'),
            book_id2:borrowData.get('book_id2'),
            book_id3:borrowData.get('book_id3'),
            book_id4:borrowData.get('book_id4'),
            book_id5:borrowData.get('book_id5'),
            library:borrowData.get('library'),
            librarian:localStorage.getItem('username'),
            // borrowData,
            }
          ).then(resp => {
              // 根据后端的返回数据修改
              if ((resp.status === 200||resp.status===201)&&resp.data===true) {
                this.dialog =true;//如果返回的信息正确就打开用户表单
              } else {
                //   if (resp.data==='false library')
                //     this.$message({
                //       type: 'info',
                //       message: '错误的图书馆：本馆没有这本书'
                //     });
                //   if(resp.data ==='false status')
                //     this.$message({
                //       type: 'info',
                //       message: '这本书已经被预约或取走了'
                //     });
                //   if(resp.data ===false)
                //     this.$message({
                //       type: 'info',
                //       message: '找不到图书'
                //     });
                // }
                    this.$message({
                      duration:1000,
                      type: 'warning',
                      message: "借书失败："+resp.data
                    });
              }
            })
            .catch(error => {
              console.log(error);
              this.$message("出错")
              // alert('error')
            })
        } else {
          console.log(this.$refs[formName1])
          console.log("__"+this.UserForm.username);
          this.$message({
            duration:1000,
            type: 'info',
            message: '请检查副本号'
          });
        }
      })
    },
    userCheck(formName){
      const _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post('/recordBorrow2', {
            type: this.UserForm.firstTitle,
            username: this.UserForm.username,
            librarian: this.UserForm.checkLibrarian,
          })
            .then(resp => {//根据返回信息
              if ((resp.status === 201 || resp.status === 200)) {
                console.log(resp.data)
                if(resp.data===true) {
                  this.$message({
                    duration:1000,
                    type: 'success',
                    message: '借书成功！'
                  });
                  this.dialog = false
                  this.reload()
              } else {
                  this.$message({
                    duration:1000,
                    type: 'warning',
                    message:resp.data,
                  });
                if(resp.data ==="false user")
                  this.errorUser ='借阅人或管理员信息错误';
                else if(resp.data ==='false number')
                  this.errorUser ='取书额度已用完';
              }
            }})
            .catch(error => {
              console.log(error)
              // alert('error')
            })
        }else {
          this.$message('填写信息不完整');
        }
      })
    }
  },

};
</script>

