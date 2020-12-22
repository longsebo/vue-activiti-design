<template>
  <div>
  <el-form label-width="120px">
        <el-form-item label="服务名称" required>
          <el-input v-model="serviceName"></el-input>
        </el-form-item>
        <el-form-item label="提交方法" >
          <el-select v-model="method">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="是否可用" >
         <el-select v-model="isUse">
           <el-option label="是" value="1"></el-option>
           <el-option label="否" value="0"></el-option>
         </el-select>
       </el-form-item>

        <el-form-item label="提交服务url" required>
          <el-input v-model="commitService"></el-input>
        </el-form-item>
        <el-form-item label="内容编码" v-show="true">
          <el-input v-model="contentEncode"></el-input>
        </el-form-item>
   </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Parameter" name="parameter">
        <vxe-table
          border
          show-overflow
          ref="xTable"
          max-height="700"
          :data="requestParameterSet"
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
        </el-tab-pane>
        <el-tab-pane label="Body Data" name="bodyData">
          <el-form label-width="120px">
          <el-form-item label="Content Type" >
            <el-select v-model="contentType">
              <el-option label="application/x-www-form-urlencoded" value="application/x-www-form-urlencoded"></el-option>
              <el-option label="application/json" value="application/json"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Body Data" >
          <el-input type="textarea" rows="15"  v-model="bodyData"></el-input>
          </el-form-item>
          </el-form>
        </el-tab-pane>
       </el-tabs>
       <ConfirmDialog  @okDialog="clearConfig" @closeDialog="hiddenDialog" :dialogVisible="showDialog" :title="dialogTitle" :content="dialogContent" :confirmText="confirmText" :cancelText="cancelText" :isShowCancel="isShowCancel"></ConfirmDialog>
  </div>
</template>

<script>
  import store from '../assistComponents/Store'
  import ConfirmDialog from '../../components/ConfirmDialog'
  export default {
    props: [],
    components:{
      ConfirmDialog
    },
    data(){
        return {
          serviceName:'',
          oldServiceName:'',
          bodyData:'',
          contentType:'',
          requestParameterSet:[],
          contentEncode:'',
          commitService:'',
          method:'',
          requestParameterFormat:'parameter',
          isUse:'1',
          activeName:'parameter',
          showDialog:false,
          dialogTitle:'清空配置提示',
          dialogContent:'Parameter和Body Data 页签只能设置一个,另一个自动清空',
          isShowCancel:false,
          confirmText:'确定',
          cancelText:'取消',
          randomNumber:0,
          timer: '',
        }

      },

      methods:{
        handleClick(tab) {
          if (tab.name === 'parameter') {
            this.showDialog =true;
            this.requestParameterFormat='parameter';
          } else if (tab.name === 'bodyData') {
            this.showDialog =true;
            this.requestParameterFormat = 'bodyData';
          }
        },
        getHttpRequest(){
          var httpRequest1={};
          httpRequest1.serviceName = this.serviceName;
          httpRequest1.oldServiceName = this.oldServiceName;
          httpRequest1.bodyData = this.bodyData;
          httpRequest1.contentType = this.contentType;
          httpRequest1.requestParameterSet = this.$refs.xTable.getTableData().fullData;
          httpRequest1.contentEncode = this.contentEncode;
          httpRequest1.commitService = this.commitService;
          httpRequest1.method = this.method;
          httpRequest1.requestParameterFormat = this.requestParameterFormat;
          httpRequest1.isUse = this.isUse;
          return httpRequest1;
        },
        async insertEvent (row) {

          let record = {

          }
          let { row: newRow } = await this.$refs.xTable.insertAt(record, row)
          await this.$refs.xTable.setActiveCell(newRow, 'name')
        },
        clearConfig(){
          if(this.requestParameterFormat==='parameter'){
            //清空body data 页签
            this.bodyData ='';
            this.contentType = '';
            store.httpRequest.bodyData='';
            store.httpRequest.contentType='';
          }else{
            //清空parameter 页签
            this.requestParameterSet=[];
            store.httpRequest.requestParameterSet=[];
          }
          this.showDialog = false;
        },
        hiddenDialog(){
          this.showDialog = false;
        },
        loadData(){
          debugger;
          console.log('loadData');
          if(store.randomNumber!=this.randomNumber){
            this.randomNumber = store.randomNumber;
            this.serviceName = store.httpRequest.serviceName;
            this.oldServiceName = this.serviceName;
            this.bodyData = store.httpRequest.bodyData;
            this.contentType = store.httpRequest.contentType;
            this.requestParameterFormat = store.httpRequest.requestParameterFormat;
            if(!this.requestParameterFormat){
              this.requestParameterFormat='parameter';
            }
            this.isUse = store.httpRequest.isUse;
            if(!this.isUse){
              this.isUse='1';
            }
            this.requestParameterSet = store.httpRequest.requestParameterSet;
            this.contentEncode = store.httpRequest.contentEncode;
            this.commitService = store.httpRequest.commitService;
            this.method = store.httpRequest.method;
            this.activeName = this.requestParameterFormat;
          }
        }
      },
      mounted() {
        console.log('mounted');
        //创建定时任务
        this.timer = setInterval(this.loadData, 100);
      },
      beforeDestroy() {
         console.log('beforeDestroy');
         clearInterval(this.timer);
      }
    }
</script>

<style>
</style>
