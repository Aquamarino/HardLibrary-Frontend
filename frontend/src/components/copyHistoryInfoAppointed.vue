<template>
  <div>
    <h5>（仅可以通过搜索副本编号来展示副本的历史预约信息，当前预约记录不显示在其中）</h5>
    <el-container>
      <el-form :model="infoAppointedForm" :rules="rules" class="register_container" label-position="left"
               label-width="0px" v-loading="loading" :ref="infoAppointedForm">
        <el-main>
          <div style="width: 50%;margin-left: 25%;margin-bottom: 20px">
            <el-input type="text" placeholder="book_id" v-model="infoAppointedForm.username" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" v-on:click="loadData"/>
            </el-input>
          </div>
          <div style="width: 100%">
            <el-table
              :data="tableData"
              border
              style="width: 100%">
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
      },
      loadData(){
        axios.post('/bookHistoryinfo',{
          type:'appointed',
          book_id: this.infoAppointedForm.username
        }).then(resp => {
          if (resp.status === 200 || resp.status === 201){
            console.log(resp.data);
            this.tableData = resp.data;
          }
        })
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
          book_id:'',
          type:"appointed"
        }

      }
    },
  }
</script>
<style>

</style>
