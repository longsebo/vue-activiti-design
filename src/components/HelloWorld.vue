<template>
  <div class="hello">
    <vxe-table :data="tableData">
          <vxe-table-column type="seq" title="Seq" width="60"></vxe-table-column>
          <vxe-table-column field="name" title="Name"></vxe-table-column>
          <vxe-table-column field="sex" title="Sex"></vxe-table-column>
          <vxe-table-column field="address" title="Address"></vxe-table-column>
        </vxe-table>
        <vxe-pager
            border
            size="medium"
            :loading="loading"
            :current-page="tablePage.pageNo"
            :page-size="tablePage.pageSize"
            :total="tablePage.totalResult"
            :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
            >
         </vxe-pager>
  </div>
</template>

<script>
import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

Vue.use(VXETable)
export default {
  name: 'HelloWorld',
  data () {
    return {
    tableData: [
            { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
            { id: 10002, name: 'Test2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
            { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' }
          ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
