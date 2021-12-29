<template>
  <div>
    <el-container @change="getData">
      <el-main>
        <div style="width: 100%">
        <el-table
          :data="tableData"
          height="450">
          <el-table-column
            fixed
            prop="bookId"
            label="书籍编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="lendDate"
            label="借阅日期"
            width="180">
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
          <el-table-column
            prop="returnDate"
            label="归还时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="returnLibrarian"
            label="归还管理员"
            width="110">
          </el-table-column>
          <el-table-column
            prop="returnLibrary"
            label="归还所在馆"
            width="100">
          </el-table-column>

        </el-table>
        </div>
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
          id:'',
          bookId:'',
          lendDate:'',
          borrowedTo:'',
          lendLibrary:'',
          lendLibrarian:'',
          returnDate:'',
          returnLibrary:'',
          returnLibrarian:'',
        }],
        type:'registered'
      }
    },
    created() {
      axios.post('/userHistoryInfo',{
        type:'registered'
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
