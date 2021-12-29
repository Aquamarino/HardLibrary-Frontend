<template>
  <div>
    <el-container>
      <el-form :model="infoAppointedForm" :rules="rules" class="register_container" label-position="left"
               label-width="0px" v-loading="loading" :ref="infoAppointedForm">
        <el-main>
          <div style="width: 100%">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="bookId"
              label="已预约书籍isbn"
              width="180">
            </el-table-column>
            <el-table-column
              prop="reserveBy"
              label="预约人"
              width="200">
            </el-table-column>
            <el-table-column
              prop="reserveDate"
              label="预约时间"
              width="200">
            </el-table-column>
            <el-table-column
              prop="takeDate"
              label="取书时间"
              width="180">
            </el-table-column>
          </el-table>
          </div>
        </el-main>
      </el-form>
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
      }
    },

    data() {
      return {
        tableData: [{
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
      axios.post('/userHistoryInfo',{
        type:'appointed'
      }).then(resp => {
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.tableData = resp.data;
        }
      })
    },
  }
</script>
