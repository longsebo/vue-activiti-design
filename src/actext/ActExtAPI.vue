<template>
     <div>
      <vxe-toolbar>
       <template v-slot:buttons>
         <vxe-button @click="add">新增</vxe-button><vxe-button @click="update">修改</vxe-button><vxe-button @click="delete1">删除</vxe-button>
       </template>
      </vxe-toolbar>
      <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    highlight-hover-row
                    :align="allAlign"
                    :data="tableData"
                    row-id="id"
                    height="480"
                    size="medium"
                    :loading="loading"
                    ref="xTable1"
                    >
              <vxe-table-column field="id" type="radio" width="60"></vxe-table-column>
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="serviceName" title="服务名称" width="200" ></vxe-table-column>
              <vxe-table-column field="method" title="提交方法" ></vxe-table-column>
              <vxe-table-column field="commitService" title="提交服务URL" ></vxe-table-column>
              <vxe-table-column field="isUse" title="是否启用" ></vxe-table-column>
              <vxe-table-column field="createTime" title="创建时间" ></vxe-table-column>
       </vxe-table>
      <vxe-pager
          border
          size="medium"
          :loading="loading"
          :current-page="tablePage.pageNo"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange">
       </vxe-pager>
       <StartEventCommitServiceParent refs="commitServiceParent" @okDialog="saveCommitService" @closeDialog='hiddenCommitService' :dialogVisible="showCommitServiceDialog" ></StartEventCommitServiceParent>
       </div>
</template>

<script>
  import Vue from 'vue'
  import StartEventCommitServiceParent from '../edit-modeler/assistComponents/StartEventCommitServiceParent.vue'
  import 'bpmn-js/dist/assets/diagram-js.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
  import request from '../util/request.js'
  import store from '../edit-modeler/assistComponents/Store'
  import format from '../util/format.js'
  import randomNumber from '../util/random.js'

  Vue.component('StartEventCommitServiceParent',StartEventCommitServiceParent)

  export default {
      data(){
        return {
          allAlign: null,
          tableData: [],
          loading: false,
          tablePage: {
                  pageNo: 1,
                  pageSize: 10,
                  totalResult: 0
          },
          showCommitServiceDialog:false,
          insertOrUpdate:false
        }

      },

      methods:{
        gettableData() {
          const that = this;

            request({
              url: `/actextapi/list/${that.tablePage.pageSize}/${that.tablePage.pageNo}/CREATE_TIME DESC`,
              method: 'get'
            })
            .then(function(res) {

              if(res.data.status == "1") {
                that.tableData = res.data.list;
                var i=0;
                for( i=0;i<that.tableData.length;i++){
                  that.tableData[i].createTime = format.format(that.tableData[i].createTime,'YYYY-MM-DD HH:mm:ss');
                }
                that.tablePage.totalResult = res.data.totalResult
              } else {
                that.$message(res.data.message)
              }

            })
            .catch(function(err) {
              that.$message("查询失败")
            })

        },
        getSelectRecords(){
          //获取选中的行
           let selectRecords = this.$refs.xTable1.getRadioRecord();
           return selectRecords;
        },

        handlePageChange ({ currentPage, pageSize }) {
            this.tablePage.pageNo = currentPage
            this.tablePage.pageSize = pageSize
            //store.loadingOrganization ="1";
            this.gettableData()
        },
      //保存提交服务配置
      saveCommitService(httpReqpuestConf,httpResponseConf){
        var actExtAPIVo={};
        const that =this;
        //组装请求
        actExtAPIVo.serviceName = httpReqpuestConf.serviceName;
        actExtAPIVo.oldServiceName = httpReqpuestConf.oldServiceName;
        actExtAPIVo.commitService = httpReqpuestConf.commitService;
        actExtAPIVo.method = httpReqpuestConf.method ;
        actExtAPIVo.contentEncode = httpReqpuestConf.contentEncode ;
        actExtAPIVo.requestParameterFormat = httpReqpuestConf.requestParameterFormat ;
        actExtAPIVo.requestParameterSet = JSON.stringify(httpReqpuestConf.requestParameterSet) ;
        actExtAPIVo.bodyData = httpReqpuestConf.bodyData ;
        actExtAPIVo.contentType = httpReqpuestConf.contentType;
        actExtAPIVo.requestHeadSet = JSON.stringify(httpReqpuestConf.requestHeadSet);
        actExtAPIVo.isUse = httpReqpuestConf.isUse;
        //组装应答
        actExtAPIVo.respondTestField = httpResponseConf.respondTestField  ;
        actExtAPIVo.correctAnswerMatches = httpResponseConf.correctAnswerMatches ;
        actExtAPIVo.businesskeyRegExp = httpResponseConf.businesskeyRegExp  ;
        actExtAPIVo.respondMessageRegExp = httpResponseConf.respondMessageRegExp   ;
        this.showCommitServiceDialog = false;
        var url1;
        if(this.insertOrUpdate){
          url1 = `/actextapi/insert`;
        }else{
          url1 = `/actextapi/update`;
        }
        request({
               url: url1,
               method: 'post',
               data:JSON.stringify(actExtAPIVo),
               //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(res) {
               debugger;
               if(res.data.status=='1') {
                 that.$message(res.data.message);
                 //刷新页面
                 //this.gettableData();
               } else {
                 console.log(res);
                 that.$message(res.data.message)
               }

             })
             .catch(function(err) {
               console.log(err);
               that.$message("提交失败")
             })

      },
      //隐藏提交服务配置对话框
      hiddenCommitService(){
        this.showCommitServiceDialog = false;
      },
      add(){
        this.insertOrUpdate = true;
        //组装请求
        store.httpRequest.serviceName ='';
        store.httpRequest.oldServiceName='';
        store.httpRequest.commitService = '';
        store.httpRequest.method = '';
        store.httpRequest.contentEncode = '';
        store.httpRequest.requestParameterFormat = '';
        store.httpRequest.requestParameterSet = [];
        store.httpRequest.bodyData = '';
        store.httpRequest.contentType = '';
        store.httpRequest.requestHeadSet = [];
        store.httpRequest.isUse='1';
        //组装应答
        store.httpResponse.respondTestField = '' ;
        store.httpResponse.correctAnswerMatches = '' ;
        store.httpResponse.businesskeyRegExp = '' ;
        store.httpResponse.respondMessageRegExp ='';
        //更新随机数，表示更新界面
        store.randomNumber = randomNumber.getRandomInt(1,10000);
        this.showCommitServiceDialog = true;
      },
      update(){
        //debugger;
        this.insertOrUpdate = false;
        //获取选择记录
        var selectRecord = this.getSelectRecords();
        if(!selectRecord){
          this.$message({message:"请选择修改接口!"});
          return;
        }
        //组装请求
        store.httpRequest.serviceName = selectRecord.serviceName;
        store.httpRequest.oldServiceName = selectRecord.serviceName;
        store.httpRequest.commitService = selectRecord.commitService;
        store.httpRequest.method = selectRecord.method;
        store.httpRequest.contentEncode = selectRecord.contentEncode;
        store.httpRequest.requestParameterFormat = selectRecord.requestParameterFormat;
        store.httpRequest.requestParameterSet = JSON.parse(selectRecord.requestParameterSet);
        store.httpRequest.bodyData = selectRecord.bodyData;
        store.httpRequest.contentType = selectRecord.contentType;
        store.httpRequest.isUse = selectRecord.isUse;
        store.httpRequest.requestHeadSet = JSON.parse(selectRecord.requestHeadSet);
        //组装应答
        store.httpResponse.respondTestField = selectRecord.respondTestField ;
        store.httpResponse.correctAnswerMatches = selectRecord.correctAnswerMatches ;
        store.httpResponse.businesskeyRegExp = selectRecord.businesskeyRegExp ;
        store.httpResponse.respondMessageRegExp = selectRecord.respondMessageRegExp ;
        debugger;
        //更新随机数，表示更新界面
        store.randomNumber = randomNumber.getRandomInt(1,10000);
        this.showCommitServiceDialog = true;
      },
      delete1(){
        const that =this;
        //获取选择记录
        var selectRecord = this.getSelectRecords();
        if(!selectRecord){
          this.$message({message:"请选择删除接口!"});
          return;
        }
        //执行删除
        request({
               url: `/actextapi/delete/${selectRecord.serviceName}`,
               method: 'post',
               headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(res) {
               debugger;
               if(res.data.status=='1') {
                 that.$message(res.data.message)
               } else {
                 console.log(res);
                 that.$message(res.data.message)
               }

             })
             .catch(function(err) {
               console.log(err);
               that.$message("删除失败")
             })
      }
      },
      mounted () {
        this.gettableData();

        }
    }
</script>

<style>
</style>
