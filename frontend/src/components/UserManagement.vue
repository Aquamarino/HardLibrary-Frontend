<template>
  <div class="userBox">
  <el-table
    :header-cell-style="{background:'#3a4344',color:'#ffffff'}"
    :data="tableData"
    style="width: 750px">
    <el-table-column
      fixed
      color="red"
      prop="nameToCh"
      label="用户身份"
      width="180">
    </el-table-column>
    <el-table-column
      label="最大借阅副本数量"
      width="170">
      <template slot-scope="scope">
        {{ scope.row.book_number}}
        <el-button type="text" color="#000" @click="openDialog(scope.$index,scope.row,1)">修改</el-button>
        <el-dialog :title="userIs+''+''+'---权限修改'" :visible.sync="dialogFormVisible1" :append-to-body="true" width="60%">
          <el-form :model="userAuthForm">
            <el-form-item label="最大借阅副本数量" label-width="120">
              <el-input-number v-model="userAuthForm.book_number" controls-position="right" :min="0" :max="30" size="small"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="changeUserAuth(userAuthForm)">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </el-table-column>
    <el-table-column
      label="预约超期时长"
      width="200">
      <template slot-scope="scope">
          {{ scope.row. reserveTime.day }}天
          {{ scope.row. reserveTime.hour }}小时
        {{scope.row. reserveTime.minute}}分
        {{scope.row. reserveTime.second}}秒
        <el-button type="text" color="#000" @click="openDialog(scope.$index,scope.row,2)">修改</el-button>

        <el-dialog :title="userIs+''+''+'--权限修改'" :visible.sync="dialogFormVisible2" :append-to-body="true" width="60%">
          <el-form :model="userAuthForm">
            <el-form-item label="预约超期时长" label-width="120">
              <el-input-number v-model="userAuthForm.reserveTime.day" controls-position="right" :min="0" :max="30" size="small"></el-input-number>
              <span>天</span>
              <el-input-number v-model="userAuthForm.reserveTime.hour" controls-position="right" :min="0" :max="23" size="small"></el-input-number>
              <span>小时</span>
              <el-input-number v-model="userAuthForm.reserveTime.minute" controls-position="right" :min="0" :max="59" size="small"></el-input-number>
              <span>分</span>
              <el-input-number v-model="userAuthForm.reserveTime.second" controls-position="right" :min="0" :max="59" size="small"></el-input-number>
              <span>秒</span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="changeUserAuth(userAuthForm)">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </el-table-column>
    <el-table-column
      label="借阅超期时长"
      width="200">
      <template slot-scope="scope">
        <span>{{ scope.row.borrowTime.day }}天
        {{ scope.row.borrowTime.hour }}小时
        {{scope.row.borrowTime.minute}}分
          {{scope.row.borrowTime.second}}秒</span>
        <el-button type="text" color="#000" @click="openDialog(scope.$index,scope.row,3)">修改</el-button>

                <el-dialog :title="userIs+'-权限修改'" :visible.sync="dialogFormVisible3" :append-to-body="true" width="60%">
                  <el-form :model="userAuthForm">
                    <el-form-item label="借阅超期时长" label-width="120">
                      <el-input-number v-model="userAuthForm.borrowTime.day" controls-position="right" :min="0" :max="30" size="small" ></el-input-number>
                      <span>天</span>
                      <el-input-number v-model="userAuthForm.borrowTime.hour" controls-position="right" :min="0" :max="23" size="small"></el-input-number>
                      <span>小时</span>
                      <el-input-number v-model="userAuthForm.borrowTime.minute" controls-position="right" :min="0" :max="59" size="small"></el-input-number>
                      <span>分</span>
                      <el-input-number v-model="userAuthForm.borrowTime.second" controls-position="right" :min="0" :max="59" size="small"></el-input-number>
                      <span>秒</span>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="changeUserAuth(userAuthForm)">确 定</el-button>
                  </div>
                </el-dialog>
      </template>
    </el-table-column>

  </el-table>
    <el-footer style="background-color:#3a4344;color:#ffffff;text-align: right;padding-top: 10px">
      <span class="buttonInfo">预约超期</span>  <el-divider direction="vertical"></el-divider>
      <span class="buttonInfo">借阅超期</span>  <el-divider direction="vertical"></el-divider>
      <span class="buttonInfo">未缴纳罚款 </span>
      <el-button type="info" icon="el-icon-message" style="background-color: #35383b" @click="sendAlarm">批量提醒</el-button>

    </el-footer>
    </div>
</template>
<style>
.el-button--text {
  color: #4797d4;
}
.userBox{
  position: absolute;
  margin-top: 5%;
  left: 50%;
  transform: translateX(-50%);
}
.demo-table-expand {
  font-size: 0;
  display:grid;
}
.demo-table-expand label {
  width: 90px;
  color: #390404;
}
.buttonInfo{
  font-size: 14px;
  padding-right: 5px;
}
/*.demo-table-expand .el-form-item {*/
/*  margin-right: 0;*/
/*  margin-bottom: 0;*/
/*  width: 50%;*/
/*}*/
</style>

<script>
import axios from 'axios'
export default {
  inject: ['reload'],
  methods: {
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
      this.dialogFormVisible1 = false;
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
      //this.reload();
    },
    changeUserAuth(userAuthForm) {
      if(this.$store.state.librarianType !== "super"){
        this.$message({
          type: 'warning',
          message: "没有这项权限"
        });
        return;
      }
      var borrowTimeSecond = ((((parseInt(userAuthForm.borrowTime.day) * 24 + parseInt(userAuthForm.borrowTime.hour)) * 60) +
        parseInt(userAuthForm.borrowTime.minute)) * 60 + parseInt(userAuthForm.borrowTime.second))
      var reserveTimeSecond = ((((parseInt(userAuthForm.reserveTime.day) * 24 + parseInt(userAuthForm.reserveTime.hour)) * 60) +
        parseInt(userAuthForm.reserveTime.minute)) * 60 + parseInt(userAuthForm.reserveTime.second))
      switch (this.limitTitle){
        case 'book_number':this.limit=userAuthForm.book_number;break;
        case 'reserve_time':this.limit=reserveTimeSecond;break;
        case 'borrow_time':this.limit=borrowTimeSecond;break;
        default:break;
      }
      axios.post('/config', {
        name: this.userTitle,
        type:this.limitTitle,
        limit:this.limit,
        //librarian: this.librarian,
        //library: localStorage.getItem('librarianWorkplace'),
        }
      ).then(resp => {
        // 根据后端的返回数据修改
        if ((resp.status === 200 || resp.status === 201) && resp.data === true) {
          this.$message({
            type: 'success',
            message: "修改成功"
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
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
    },
    sendAlarm() {
      if(this.$store.state.librarianType !== "super"){
        this.$message({
          type: 'warning',
          message: "没有这项权限"
        });
        return;
      }
      axios.post('/alarm', {
        librarian: this.librarian,
        library: localStorage.getItem('librarianWorkplace'),
      }).then(resp => {
        // 根据后端的返回数据修改
        if ((resp.status === 200 || resp.status === 201) && resp.data === true) {
          this.dialogFormVisible1 = false;
          this.dialogFormVisible2 = false;
          this.dialogFormVisible3 = false;
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
        })
    },
  },
    data() {
      return {
        librarian: this.$store.state.username,
        library: this.$store.state.librarianWorkplace,
        tableData: [
          {
            name: '',
            book_number: '',
            borrowTime: {
              day: '',
              hour: '',
              minute: '',
              second: '',
            },
            reserveTime: {
              day: '',
              hour: '',
              minute: '',
              second: '',
            },
          },
        ],
        changeData:[],
        fineData: [],
        currentIndex: '',
        userTitle: '',
        userIs:'',
        limitTitle:'',
        limit:'',
        search: '',
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        userAuthForm: {
          userType: '',
          bookNumber: '',
          borrowTime: '',
          reserveTime: '',
        },
        // getUserData: [
        //   {
        //     userType: 'teacher',
        //     bookNumber: '11',
        //     borrowTime: {
        //       day: '1',
        //       hour: '10',
        //       minute: '40',
        //       second: '30',
        //     },
        //     reserveTime: {
        //       day: '3',
        //       hour: '5',
        //       minute: '12',
        //       second: '11',
        //     },
        //   },
        //   {
        //     userType: '222',
        //     bookNumber: '15',
        //     borrowTime: {
        //       day: '2',
        //       hour: '14',
        //       minute: '40',
        //       second: '32',
        //     },
        //     reserveTime: {
        //       day: '10',
        //       hour: '5',
        //       minute: '12',
        //       second: '35',
        //     },
        //   },
        //   {
        //     userType: '333',
        //     bookNumber: '5',
        //     borrowTime: {
        //       day: '1',
        //       hour: '12',
        //       minute: '10',
        //       second: '8',
        //     },
        //     reserveTime: {
        //       day: '3',
        //       hour: '5',
        //       minute: '12',
        //       second: '11',
        //     },
        //   },
        // ],
        // getFineData: [{
        //   username: '1233444',
        //   book_id: '1141450984350-001',
        //   money: '20.00',
        //   reason: 'awsl',
        //   fine_date: '2020-09-11',
        //   pay: 'sldikvnsdlcv',
        // },
        //   {
        //     username: '99923412',
        //     book_id: '0000000000222-001',
        //     money: '30.00',
        //     reason: 'awysl',
        //     fine_date: '2019-08-11',
        //     pay: 'ytjythdzdfgvzdfb',
        //   }]
      }
    },
    created: function () {
      //获得后端返回数据
      axios.get('/configInfo',).then(resp => {
      //  console.log(resp.data)
        if(resp.status===201||resp.status===200) {
          this.tableData = resp.data;
          this.tableData.forEach(item=>{
            item.borrowTime=JSON.parse(item.borrow_time)
            item.reserveTime=JSON.parse(item.reserve_time)
            switch (item.name){
              case "Teacher": item.nameToCh="教师";break;
              case "Undergraduate":item.nameToCh="本科生";break;
              case "Postgraduate":item.nameToCh="研究生";break;
              default:break;
            }
          })
        }
    }).catch(error => {
        console.log(error);
      })
    }

}
</script>
