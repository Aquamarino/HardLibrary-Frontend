<template>
  <div class="container">
    <el-main>
      <el-form :model="infoAppointedForm" :rules="rules" class="register_container" label-position="left"
               label-width="0px"  :ref="infoAppointedForm">
          <el-table
            :header-cell-style="{background:'#545c64',color:'#ffffff'}"
            :data="tableDataAppointed"
            style="width: 100%">
            <el-table-column
              prop="bookId"
              label="已预约书籍编号"
              width="220">
            </el-table-column>
            <el-table-column
              prop="reserveBy"
              label="预约人"
              width="200">
            </el-table-column>
            <el-table-column
              prop="reserveDate"
              label="预约时间"
              width="220">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-on:click="handleClick(infoAppointedForm,scope.row,scope.$index,tableDataAppointed)">取消预约</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            :data="appointedHistory"
            :header-cell-style="{background:'#515f4f',color:'#ffffff'}"
            style="width: 100%">
            <el-table-column
              prop="bookId"
              label="已取预约书籍编号"
              width="220">
            </el-table-column>
            <el-table-column
              prop="reserveBy"
              label="预约人"
              width="200">
            </el-table-column>
            <el-table-column
              prop="reserveDate"
              label="预约时间"
              width="220">
            </el-table-column>
            <el-table-column
              prop="takeDate"
              label="取书时间">
            </el-table-column>
          </el-table>
      </el-form>
    </el-main>
    <el-container @change="getData">
      <el-main>
        <el-table
          :header-cell-style="{background:'#545c64',color:'#ffffff'}"
          :data="tableDataRegistered"
          height="300">
          <el-table-column
            fixed
            prop="bookId"
            label="当前借阅的书籍"
            width="200">
          </el-table-column>
          <el-table-column
            prop="lendDate"
            label="借阅日期"
            width="220">
          </el-table-column>
          <el-table-column
            prop="lendLibrary"
            label="书籍原馆"
            width="200">
          </el-table-column>
          <el-table-column
            prop="lendLibrarian"
            label="借出管理员"
            >
          </el-table-column>

        </el-table>
      </el-main>
    </el-container>
  </div>



</template>

<script>
  import axios from 'axios'
  export default {
    name:'infoAppointed',
    methods: {
      handleClick(formName,row,index,rows) {
        this.infoAppointedForm.book_id = row.bookId;
        this.$refs[formName].validate(valid => {
          if (valid){
            axios.post('/cancel',{
              reserve_by:this.infoAppointedForm.reserve_by,
              book_id:this.infoAppointedForm.book_id
            })
              .then(resp => {
                // 根据后端的返回数据修改
                if ((resp.status === 200 || resp.status === 201) && resp.data === true) {
                  rows.splice(index, 1);
                }
              })
          }
        })
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },

        getData(){

        }
    },

    data() {
      return {
        tableDataAppointed: [{
          bookId:'',
          reserveBy:'',
          reserveDate:'',
          take:''
        }],
        tableDataRegistered:[{

        }],
        appointedHistory:[{
          bookId:'',
          reserveBy:'',
          reserveDate:'',
          take:''
        }],
        librarian:this.$store.state.username,
        infoAppointedForm:{
          reserve_by:this.$store.state.username,
          book_id:''
        }

      }
    },
    created() {
      axios.post('/userinfodisplay',{
        type:'appointed'
      }).then(resp => {
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.tableDataAppointed = resp.data;
        }
      });
      axios.post('/userinfodisplay',{
        type:'registered',
      })
        .then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableDataRegistered = resp.data;
          }
        }),
        axios.post('/userHistoryInfo',{
          type:'appointed'
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.appointedHistory = resp.data;
          }
        })
    },
  }
</script>
<style scoped>

.container{
  width: 90%;
}

</style>
