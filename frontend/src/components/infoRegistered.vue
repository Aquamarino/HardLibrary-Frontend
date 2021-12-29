<template>
  <div>
    <el-container @change="getData">
      <el-main>
        <el-table
          :data="tableData"
          width="200"
          height="250">
          <el-table-column
            fixed
            prop="bookId"
            label="书籍编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="lendDate"
            label="借阅日期"
            width="100">
          </el-table-column>
          <el-table-column
            prop="lendLibrary"
            label="书籍原馆"
            width="100">
          </el-table-column>
          <el-table-column
            prop="lendLibrarian"
            label="借出管理员"
            width="110">
          </el-table-column>

        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name:'infoRegistered',
    data(){
      return {
        tableData: [{
        }],
        type:'registered'
      }
    },
    created() {
      console.log('registered');
      axios.post('/userinfodisplay',{
        type:'registered',
      })
      .then(resp => {
        if (resp.status === 200 || resp.status === 201){
          console.log(resp.data);
          this.tableData = resp.data;
        }
      })
    },
    methods:{
      getData(){

      }
    }
  }
</script>
