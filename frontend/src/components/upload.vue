<template>
  <div id="base_upload">
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
      <el-menu-item index="4" @click="$router.push('/adminBookStatus')">图书总览</el-menu-item>
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
        <el-menu-item index="8-3" @click="$router.push({name:'searchFineInfo'})">罚款记录查询</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">超管工作台</template>
        <el-menu-item index="5-1" @click="$router.push({name:'addAuthority'})">添加管理员</el-menu-item>
        <el-menu-item index="5-2" @click="$router.push({name:'UserManagement'})">用户超期管理</el-menu-item>

      </el-submenu>


    </el-menu>
    <el-form :model="uploadForm" :rules="rules" class="upload_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="uploadForm">
      <h1 class="upload_title" style="align-content: center">上传图书</h1>
      <el-form-item prop="cover">
        <!--        <div>-->
        <!--          <div v-if="allowAddImg" v-model="uploadForm.cover">-->
        <!--            <input type="file" accept="image/*" multiple="multiple" @change="changeImg($event)">-->
        <!--            <div class="filter"></div>-->
        <!--          </div>-->
        <!--          <div class="img_box" v-for="(item,index) in imgArr" :key="index">-->
        <!--            <div class="img_show_box">-->
        <!--              < img :src="item" alt="">-->
        <!--              <i class="img_delete" @click="deleteImg(index)">delete</i>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <label>封面url:
          <el-input id="cover" type="text" auto-complete="off" style="width: 300px" v-model="uploadForm.cover" placeholder="cover" @change="displayPhoto"/>
          <img v-if="display_photo" :src="uploadForm.cover" alt="" referrerpolicy="no-referrer" style="height: 200px;width: 300px;margin-left: -100px">
        </label>
      </el-form-item>
      <el-form-item prop="isbn">
        <label>isbn:
          <el-input id="isbn" type="text"  auto-complete="off"  style="width: 300px" v-model="uploadForm.isbn" placeholder="isbn" @change="saveIsbn"/>
        </label>
      </el-form-item>
      <el-form-item prop="category">
        <label>分类:
          <el-input id="category" type="text"  auto-complete="off" placeholder="category" v-model="uploadForm.category" style="width: 300px"/></label>
      </el-form-item>
      <el-form-item prop="name">
        <label>书名:
          <el-input id="name" type="text"  auto-complete="off" placeholder="name" style="width: 300px" v-model="uploadForm.name"/></label>
      </el-form-item>
      <el-form-item prop="author">
        <label>作者:
          <el-input id="author" type="text"  auto-complete="off" placeholder="author" style="width: 300px" v-model="uploadForm.author"/></label>
      </el-form-item>
      <el-form-item prop="publish_date">
        <label>发行日期:
          <el-input id="publish_date" type="text"  auto-complete="off" placeholder="publish date" style="width: 300px" v-model="uploadForm.publish_date" /></label>
      </el-form-item>
      <el-form-item prop="description">
        <label>介绍:
          <el-input id="description" type="text"  auto-complete="off" placeholder="description" style="width: 300px;margin-bottom: 0" v-model="uploadForm.description"/></label>
      </el-form-item>
      <el-form-item prop="price">
        <label>价格（人民币）:
          <el-input id="price" type="text"  auto-complete="off" placeholder="price" style="width: 300px;margin-bottom: 0" v-model="uploadForm.price"/></label>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" v-on:click="upload(uploadForm)">上传</el-button>
      </el-form-item>
      <el-alert
        v-if="exist"
        title="book exist"
        type="warning">
      </el-alert>
      <el-alert
        v-if="uploadError"
        title="upload error"
        type="warning">
      </el-alert>
      <el-alert
      v-if="wrong"
      title="wrong error"
      type="warning">
    </el-alert>


    </el-form>


  </div>
</template>

<script>
  import axios from 'axios'


  export default {
    name: 'Upload',
    data(){
      const checkIsbn = (rule, value, cb) => {
        const regIsbn = /^[0-9]{13}$/;
        if (regIsbn.test(value)){
          return cb();
        }
        cb(new Error('请输入合法的Isbn'))
      };
      const checkDate = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const reg = /^\d{4}-\d{1,2}-\d{1,2}$/;
        const regDate = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
        if(reg.test(value) && regDate.test(value)){
          // 合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的时间'))
      };
      const checkPrice = (rule,value,cb) =>{
        const reg = /^\d+\.+\d{2}$/;
        if (reg.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的价格'))
      };
      return{
        uploadForm: {
          cover: '',
          isbn: '',
          category: '',
          name: '',
          author: '',
          publish_date: '',
          description: '',
          price:''
        },
        imgData:'',
        imgArr:[],
        imgSrc:'',
        allowAddImg:true,
        display_photo:false,
        exist:false,
        uploadError:false,
        wrong:false,
        library:localStorage.getItem('librarianWorkplace'),
        rules: {
          cover: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
          isbn: [{required: true, message: '', trigger: 'blur'}, {validator: checkIsbn, trigger: 'blur'}],
          category: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
          name: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
          author: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
          publish_date: [{required: true, message: '', trigger: 'blur'}, {validator: checkDate, trigger: 'blur'}],
          description: [{required: true, message: '', trigger: 'blur'}, {trigger: 'blur'}],
          price: [{required: true, message: '', trigger: 'blur'}, {validator:checkPrice,trigger: 'blur'}],
        },
        loading: false,
        librarian : this.$store.state.username
      }
    },
    methods:{
      upload(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            axios.post('/upload', {
                cover: this.uploadForm.cover,
                isbn: this.uploadForm.isbn,
                category: this.uploadForm.category,
                name: this.uploadForm.name,
                author: this.uploadForm.author,
                publish_date: this.uploadForm.publish_date,
                description: this.uploadForm.description,
                price:this.uploadForm.price
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                if ((resp.status === 200||resp.status===201)&&resp.data===true) {
                  this.$store.commit('setSearchIsbn', this.uploadForm.isbn);
                  console.log(this.$store.state.isbn);
                  // 跳转到login
                  this.$router.replace('/copyUpload')
                } else {
                  if (resp.data===false)
                    this.exist = true;
                  else
                    this.uploadError = true;
                }
              })
              .catch(error => {
                console.log(error);
                this.uploadError = true;
              })
            // .catch(error => {
            //   console.log(error);
            //   alert(error.toString())
            // })
          } else {
            this.wrong = true;
          }
        })
      },
      // changeImg: function(e) {
      //   const _this = this;
      //   const imgLimit = 1024;
      //   const files = e.target.files;
      //   const image = new Image();
      //   if(files.length>0){
      //     let dd = 0;
      //     const timer = setInterval(function () {
      //       //确保传输的文件是图片格式
      //       if (files.item(dd).type !== 'image/png' && files.item(dd).type !== 'image/jpeg' && files.item(dd).type !== 'image/gif') {
      //         return false;
      //       }
      //       if (files.item(dd).size > imgLimit * 102400) {
      //       } else {
      //         image.src = window.URL.createObjectURL(files.item(dd));
      //         image.onload = function () {
      //           // 压缩图片的长和宽
      //           const w = 200;
      //           const h = 100;
      //           // 默认图片质量为0.7，quality值越小，所绘制出的图像越模糊
      //           const quality = 0.8;
      //           //生成canvas
      //           const canvas = document.createElement('canvas');
      //           const ctx = canvas.getContext('2d');
      //           // 创建属性节点并赋值
      //           const atw = document.createAttribute("width");
      //           atw.nodeValue = w;
      //           const ath = document.createAttribute("height");
      //           ath.nodeValue = h;
      //           canvas.setAttributeNode(atw);
      //           canvas.setAttributeNode(ath);
      //           ctx.drawImage(image, 0, 0, w, h);
      //           const ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();//图片格式
      //           const base64 = canvas.toDataURL("image/" + ext, quality);
      //           _this.uploadForm.cover = base64;
      //           // 回调函数返回base64的值
      //           if (_this.imgArr.length <= 0) {
      //             _this.imgArr.unshift('');
      //             _this.imgArr.splice(0, 1, base64);//替换数组数据的方法，此处不能使用：this.imgArr[index] = url;
      //             if (_this.imgArr.length >= 1) {
      //               _this.allowAddImg = false;
      //             }
      //           }
      //         }
      //       }
      //
      //       if (dd < files.length - 1) {
      //         dd++;
      //       } else {
      //         clearInterval(timer);
      //       }
      //     }, 1000);
      //   }
      // },
      // deleteImg: function(index){
      //   this.imgArr.splice(index,1);
      //   if(this.imgArr.length<5){
      //     this.allowAddImg = true;
      //   }
      // },
      displayPhoto(){
        this.display_photo = (this.uploadForm.cover !== "");
      },
      log_out(){
        localStorage.removeItem('Authorization');
        this.$router.push("/login");
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
      }
    },
  }

</script>
<style scoped>
a{
  text-decoration: none;
}
#base_upload{
  background: url("../assets/background/black.jpeg") repeat center;
  height: 200%;
  width: 100%;
  margin: 0;
  background-size: cover;
  position: absolute;
  padding: 0;
  text-align: center;
}
.upload_container{
  width: 800px;
  border-radius: 20px;
  background-clip: padding-box;
  /*margin: 270px auto;*/
  margin-top: 30px;
  margin-left: 18%;
  /*width: 350px;*/
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.upload_title{
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
.submit{
  width: 300px;
  padding:8px;
  background-color: aliceblue;
  color: black;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px; /* future proofing */
  text-align: center;
  vertical-align: middle;
  border: 1px solid transparent;
  font-weight: 900;
  font-size:125%;
  margin-bottom: 20px;
  margin-top: 5px;
  margin-left: 50px;
  height: 50px;

}
label{
  display: inline-block;
  width: 35em;
  margin-left: -100px;
  margin-top: 0;
  margin-bottom: 0;
  text-align: right;
  vertical-align: top;
}
.upload_container el-input{
  width: 250px;
}
</style>
