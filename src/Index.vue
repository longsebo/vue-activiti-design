<template>
  <div id="app">
    <h1>流程管理</h1>
    <el-button class="addBtn" icon="el-icon-plus" @click="addProcessModel">新增</el-button>
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
                  <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                  <vxe-table-column field="id" title="流程标识"  width="200"></vxe-table-column>
                  <vxe-table-column field="name" title="流程名称" width="200" ></vxe-table-column>
                  <vxe-table-column field="lastUpdateTime" title="上次更新时间" width="300"></vxe-table-column>
                  <vxe-table-column title="操作">
                    <template v-slot="{ row }">
                      <vxe-button
                        @click="handleEdit(row)">编辑</vxe-button>
                      <!--<vxe-button
                        @click="handleView(row)">查看</vxe-button>-->
                      <vxe-button
                        @click="handleDelete(row)">删除</vxe-button>
                      <vxe-button
                        @click="handleDeploy(row)">部署</vxe-button>
                    </template>
                  </vxe-table-column>
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

    <el-dialog
      title="新增模型"
      :visible.sync="modelVisible"
      width="50%"
      :before-close="handleModelClose">
      <el-form>
        <el-row :gutter="20">

          <el-col :span="6">
            <el-form-item label="标识">
              <el-input v-model="key"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类别">
              <el-input v-model="category"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleModelClose">取 消</el-button>
        <el-button type="primary" @click="handleModelOk">确 定</el-button>
      </span>
    </el-dialog>
    <ProcessDesign :dialogVisible="dialogVisible" :params="params" v-on:handleVisiable="handleVisiable()"></ProcessDesign>
    <ProcessView :dialogViewModelVisible="dialogViewModelVisible" :params="params" v-on:handleViewModelVisiable="handleViewModelVisiable()"></ProcessView>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ProcessDesign from './edit-modeler/ProcessDesign'
import ProcessView from './edit-modeler/ProcessView'
import request from './util/request'
Vue.use(ElementUI)
export default {
  name: 'Index',
  components: {
    ProcessDesign,
    ProcessView
  },
  data () {
    return {
      allAlign: null,
      tableData: [

      ],
      params:{
        row: ''
      },
      modelVisible: false,
      dialogVisible: false,
      dialogViewModelVisible: false,
      key: '',
      name: '',
      category: '',
      visiable:false,
      loading: false,
      tablePage: {
              pageNo: 1,
              pageSize: 10,
              totalResult: 0
        }
    }
  },

  mounted() {
    this.getWorkFlowData();
  },

  methods: {
    addProcessModel() {
      this.modelVisible = true
    },
    handleModelClose() {
      this.modelVisible = false
    },
    handleModelOk() {
      const that = this;
      that.modelVisible = false;
      var test= JSON.stringify({
          key: that.key,
          name: that.name,
          category: that.category
        });
        console.log(test);
      request({
        method: 'post',
        //url: '/workflow/model/insert',
        url:'/repository/models',
        data:test
      })
      .then(function(res) {
        that.key = ''
        that.name = ''
        that.category = ''
        that.$message("新增成功")
      })
      .catch(function(err) {
        that.$message("新增失败")
      });
    },
    async handleEdit (row) {
      const that = this;
      that.params.row = row
      // 到后台请求xml文件
      await request({
        url: `/workflow/model/${row.id}/xml`
      })
      .then(function(res) {
        that.params.bpmnXml = res.data.bpmnXml;
        that.params.name = `${row.name}`;
      })
      .catch(function(err) {
        console.error(err);
        console.log('获取反显流程xml失败');
        // 为了不启动后台，这里提供测试数据
        that.params.bpmnXml = '<?xml version="1.0" encoding="UTF-8"?>'+
'<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:activiti="http://activiti.org/bpmn" id="sample-diagram" targetNamespace="http://activiti.org/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">'+
'  <bpmn2:process id="Process_1" isExecutable="true"  process_id="Process_1">'+
'    <bpmn2:startEvent id="StartEvent_0w9qcue" name="交易开始">'+
'      <bpmn2:outgoing>SequenceFlow_0zyxqaf</bpmn2:outgoing>'+
'    </bpmn2:startEvent>'+
'  </bpmn2:process>'+
'  <bpmndi:BPMNDiagram id="BPMNDiagram_1">'+
'    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">'+
'      <bpmndi:BPMNShape id="StartEvent_0w9qcue_di" bpmnElement="StartEvent_0w9qcue">'+
'        <dc:Bounds x="292" y="62" width="36" height="36" />'+
'        <bpmndi:BPMNLabel>'+
'          <dc:Bounds x="288" y="105" width="45" height="14" />'+
'        </bpmndi:BPMNLabel>'+
'      </bpmndi:BPMNShape>'+
'    </bpmndi:BPMNPlane>'+
'  </bpmndi:BPMNDiagram>'+
'</bpmn2:definitions>';
      })
      // 注意放的位置，避免异步请求导致实际设计器中没有bpmnXml值
      that.dialogVisible = true;
    },
    async handleView (row) {
      const that = this;
      that.params.row = row
      // 到后台请求xml文件
      await request({
        //url: `/workflow/model/${row.id}/xml`
        url:`/repository/models/${row.id}/source`
      })
      .then(function(res) {
        debugger
        that.params.viewBpmnXml = res.data;
      })
      .catch(function(err) {

        console.log('获取反显流程xml失败')
      })
      // 注意放的位置，避免异步请求导致实际设计器中没有bpmnXml值
      that.dialogViewModelVisible = true;
    },
    handleDelete(row) {
      const that = this;
      request({
        //url: '/workflow/deleteModel',
        url: `/repository/models/${row.id}`,
        method: 'delete',
        // params: {
        //   modelId: row.id
        // }
      })
      .then(function(res) {
        that.$message("删除成功")
      })
      .catch(function(err) {
        that.$message("删除失败")
      })
    },

   async handleDeploy(row) {
	  const that = this;
	        request({
	          url: '/workflow/model/deploy',
	          method: 'get',
	          params: {
	            modelId: row.id
	          }
	        })
	        .then(function(res) {
	          debugger
	          if(res.data === 'success') {
	            that.$message("部署成功")
	          } else {
	            that.$message(res.data)
	          }

	        })
	        .catch(function(err) {
	          that.$message("部署失败")
	        })

    },

    handleVisiable() {
      //console.log('handleVisiable:'+visiable);
      this.dialogVisible = false;
    },
    handleViewModelVisiable() {
      this.dialogViewModelVisible = false;
    },
    handlePageChange ({ currentPage, pageSize }) {
        debugger;
        this.tablePage.pageNo = currentPage
        this.tablePage.pageSize = pageSize
        this.getWorkFlowData()
    },
    getWorkFlowData(){
      const that = this;
      request({
        method: 'get',
        //url:'/repository/models'
        url:`/workflow/models/${that.tablePage.pageSize}/${that.tablePage.pageNo}`
      })
      .then(function(res) {
          if(res.data.status == "1") {
              that.tableData = res.data.list;
              that.tablePage.totalResult = res.data.totalResult
            } else {
              that.$message(res.data.message)
            }
      })
      .catch(function(err) {
        that.$message("查询失败")
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.addBtn {
  display: flex;
  text-align:left;
  margin-left: 50px;
}
</style>
