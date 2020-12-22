<template>
  <div>
    <vxe-table
      border
      show-overflow
      ref="xTable"
      max-height="700"
      :data="requestHeadSet"
      :edit-config="{trigger: 'click', mode: 'cell', icon: 'fa fa-pencil'}">
      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="名称" sortable :edit-render="{name: 'input'}"></vxe-table-column>
      <vxe-table-column field="value" title="值" :edit-render="{name: 'input'}"></vxe-table-column>
    </vxe-table>
    <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus" @click="insertEvent(-1)">新增</vxe-button>
        <vxe-button icon="fa fa-delete" @click="$refs.xTable.removeCheckboxRow()">删除</vxe-button>
      </template>
    </vxe-toolbar>
  </div>
</template>

<script>
  import store from '../assistComponents/Store'
  export default {
      props: [],
      data(){
          return {
            requestHeadSet:[],
            randomNumber:0,
            timer: '',
          }

        },

        methods:{
            getHttpRequestHeader(){
              return this.$refs.xTable.getTableData().fullData;
            },
            async insertEvent (row) {
            let record = {
            }
            let { row: newRow } = await this.$refs.xTable.insertAt(record, row)
            await this.$refs.xTable.setActiveCell(newRow, 'name')
          },
          loadData(){
            if(store.randomNumber!=this.randomNumber){
              this.randomNumber = store.randomNumber;
              this.requestHeadSet = store.httpRequest.requestHeadSet;
            }
          }
        },
        mounted() {
           //创建定时任务
           this.timer = setInterval(this.loadData, 100);
        },
        beforeDestroy() {
           clearInterval(this.timer);
        }
      }

</script>

<style>
</style>
