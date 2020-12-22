<template>
    <div>
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="常规" name="routine">
        <el-form-item label="编号" required>
            <el-input v-model= "id"></el-input>
        </el-form-item>
        <el-form-item label="名称" required>
            <el-input v-model= "name"></el-input>
        </el-form-item>
        <el-form-item label="文档" v-show="false">
            <el-input type="textarea" v-model="documentation"></el-input>
        </el-form-item>
        <el-form-item label="多实例类型">
            <el-select v-model= "multiinstance_type"> <!--相当于bpmn2.0标准中的isSequential-->
                <el-option label="非多实例" value="None"></el-option>
                <el-option label="同时进行" value="Parallel"></el-option>
                <el-option label="顺序进行" value="Sequential"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="基数 (多实例)" v-show="false"><!--后端暂时没用到-->
            <el-input v-model= "multiinstance_cardinality" type="number"></el-input>
        </el-form-item>
        <el-form-item label="多实例采集变量" >
            <el-input v-model= "multiinstance_collection" ></el-input>
        </el-form-item>
        <el-form-item label="元素的变量(多实例)" >
            <el-input v-model= "multiinstance_variable" ></el-input>
        </el-form-item>
        <el-form-item label="通过权重[1-100]">
            <el-input v-model= "multiinstance_condition1" type="number"></el-input>
        </el-form-item>
        <el-form-item label="展示表单url"  required>
            <el-input v-model= "formkeydefinition" ></el-input>
        </el-form-item>
        <el-form-item label="提交服务" required >
            <el-select v-model="commitService">
            <el-option
              v-for="item in serviceNames"
              :key="item"
              :value="item"
              :label="item">
              </el-option>
            </el-select>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="分配用户" name="user">
        <el-form-item label="主办用户" required>
            <el-input v-model= "assigneeName" ></el-input> <vxe-button icon="fa fa-plus" @click="selectAgentUserEvent()">选择用户</vxe-button>
        </el-form-item>
        <p>候选用户列表</p>
        <vxe-toolbar>
            <template v-slot:buttons>
              <vxe-button icon="fa fa-plus" @click="insertUserEvent()">新增</vxe-button>
              <vxe-button icon="fa fa-plus" @click="insertUserExp()">新增表达式</vxe-button>
              <vxe-button icon="fa fa-sub" @click="deleteUserEvent()">删除选中行</vxe-button>
            </template>
         </vxe-toolbar>
          <vxe-table
                  border
                  show-header-overflow
                  show-overflow
                  highlight-hover-row
                  ref="userTable"
                  :align="allAlign"
                  :data="usersData">
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="id" title="ID" width="180"></vxe-table-column>
                  <vxe-table-column field="name" title="用户名称" width="180"></vxe-table-column>
                  <template v-slot:empty>
                      <span >
                      </span>
                    </template>
            </vxe-table>
             <vxe-modal v-model="showUserEdit" :title="'新增&保存'" width="800" min-width="600" min-height="300" :loading="submitUserLoading" resize destroy-on-close>
                      <template v-slot>
                        <vxe-form :data="formData" :items="formItems" :rules="formRules" title-align="right" title-width="100" @submit="submitUserEvent"></vxe-form>
                      </template>
             </vxe-modal>
      </el-tab-pane>
      <el-tab-pane label="分配角色" name="role">
        <vxe-toolbar>
            <template v-slot:buttons>
              <vxe-button icon="fa fa-plus" @click="insertRoleEvent()">新增</vxe-button>
              <vxe-button icon="fa fa-plus" @click="insertRoleExp()">新增表达式</vxe-button>
              <vxe-button icon="fa fa-sub" @click="deleteRoleEvent()">删除选中行</vxe-button>
            </template>
         </vxe-toolbar>
          <vxe-table
                  border
                  show-header-overflow
                  show-overflow
                  highlight-hover-row
                   ref="roleTable"
                  :align="allAlign"
                  :data="rolesData">
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="id" title="ID" width="180"></vxe-table-column>
                  <vxe-table-column field="name" title="角色名称" width="180" ></vxe-table-column>
                 <template v-slot:empty>
                    <span >
                    </span>
                  </template>
          </vxe-table>
          <vxe-modal v-model="showRoleEdit" :title="'新增&保存'" width="800" min-width="600" min-height="300" :loading="submitRoleLoading" resize destroy-on-close>
                    <template v-slot>
                      <vxe-form :data="formData" :items="formItems" :rules="formRules" title-align="right" title-width="100" @submit="submitRoleEvent"></vxe-form>
                    </template>
           </vxe-modal>
      </el-tab-pane>
      <el-tab-pane label="分配机构" name="organization">
        <vxe-toolbar>
            <template v-slot:buttons>
              <vxe-button icon="fa fa-plus" @click="insertOrganizationEvent2()">新增</vxe-button>
             <vxe-button icon="fa fa-plus" @click="insertOriganizationExp()">新增表达式</vxe-button>
              <vxe-button icon="fa fa-sub" @click="deleteOrganizationEvent()">删除选中行</vxe-button>
            </template>
         </vxe-toolbar>
          <vxe-table
                  border
                  show-header-overflow
                  show-overflow
                  highlight-hover-row
                  ref="organizationTable"
                  :align="allAlign"
                  :data="organizationData">
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="id" title="ID" width="180"></vxe-table-column>
                  <vxe-table-column field="name" title="机构名称" width="180" ></vxe-table-column>
                  <template v-slot:empty>
                                <span >
                                </span>
                              </template>
          </vxe-table>
          <vxe-modal v-model="showOrganizationEdit" :title="'新增&保存'" width="800" min-width="600" min-height="300" :loading="submitOrganizationLoading" resize destroy-on-close>
                     <template v-slot>
                       <vxe-form :data="formData" :items="formItems" :rules="formRules" title-align="right" title-width="100" @submit="submitOrganizationEvent"></vxe-form>
                     </template>
            </vxe-modal>
      </el-tab-pane>
      </el-tabs>
      <ListUserParent refs="listUserParent" @okDialog='insertUser' @closeDialog='hiddenListUser' :dialogVisible="showListUserDialog" :params="params"></ListUserParent>
      <ListRoleParent refs="listRoleParent" @okDialog='insertRole' @closeDialog='hiddenListRole' :dialogVisible="showListRoleDialog" :params="params"></ListRoleParent>
      <ListOrganizationParent refs="listOrganizationParent" @okDialog='insertOrganization' @closeDialog='hiddenListOrganization' :dialogVisible="showListOrganizationDialog" :params="params"></ListOrganizationParent>
    </div>
</template>
<script>
const forEach = require('lodash/forEach');
import Vue from 'vue'
import {findObjFromArrayByField,isNeedUpdate} from '../js/util/CommonUtils';
import bpmnHelper from '../js/helper/BpmnHelper';
import {NodeTypeMap,TxTypeMap} from '../../static/js/static';
import ListUserParent from '../assistComponents/ListUserParent.vue'
import ListRoleParent from '../assistComponents/ListRoleParent.vue'
import ListOrganizationParent from '../assistComponents/ListOrganizationParent.vue'
import request from '../../util/request.js';

Vue.component('ListUserParent',ListUserParent)
Vue.component('ListRoleParent',ListRoleParent)
Vue.component('ListOrganizationParent',ListOrganizationParent)
// 用户任务属性组件
export default {
    props:['element'],
    inject: ['bpmnModeler'],
    data(){
        return {
            modeling: null,
            id: this.element.id || '',
            name: '',
            formkeydefinition:'',
            documentation: '',
            multiinstance_type: '',
            multiinstance_collection: '',
            multiinstance_condition1: '',
            multiinstance_cardinality: null,
            multiinstance_variable: null,
            activeName: 'routine',
            commitService:'',
            assigneeId:'',//主办用户id
            assigneeName:'',//主办用户名称

            // 原子节点属性
            allAlign: null,
            usersData: [],//代理用户
            rolesData: [],//代理角色
            organizationData: [],//代理机构
            formData: {
                   id:null,
                   name: null
            },
            formRules: {
                            id: [
                              { required: true, message: '请输入表达式' },
                              { min: 1, max: 100, message: '长度在 1 到 100 个字符' }
                            ],
                            name: [
                              {  message: '可输入表达式备注' }
                            ]
                          },
             formItems: [
                            { field:'id',title: '表达式', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入表达式,格式${xxxx}' } }},
                            { field: 'name', title: '备注', span: 12, itemRender: { name: '$input', props: { placeholder: '可输入表达式备注' } } },
                         { align: 'center', span: 24, titleAlign: 'left', itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: '提交', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] } }
                         ],
            selectRow: null,
            showUserEdit: false,
            showListUserDialog:false,
            showListRoleDialog:false,
            showListOrganizationDialog:false,
            params:'1',
            submitUserLoading:false,
            showRoleEdit: false,
            submitRoleLoading:false,
            showOrganizationEdit: false,
            submitOrganizationLoading:false,
            serviceNames:[]
        }
    },

    methods:{
      handleClick(tab, event) {
            console.log(tab, event);
      },
      isExistsUser(userId){

        let rs = this.$refs.userTable.getTableData().fullData;
        for(var i=0;i<rs.length;i++){
          if(rs[i].id == userId){
            return true;
          }
        }
        return false;
      },
      //插入用户
      insertUser(datas){
        debugger;
        this.showListUserDialog = false;
        if(this.params=='1'){
          let i=0;
          for(i=0;i<datas.length;i++){
            if(!this.isExistsUser(datas[i].id)){
              this.formData ={
                id:datas[i].id,
                name:datas[i].name
              }
              this.$refs.userTable.insert(this.formData);
            }
          }
          //更新模型
          this.modeling.updateProperties(this.element,{
              'activiti:candidateUsers1': JSON.stringify(this.$refs.userTable.getTableData().fullData)
          })
        }else{
           this.assigneeId=datas[0].id,//主办用户id
           this.assigneeName=datas[0].name;
           //更新模型
           this.modeling.updateProperties(this.element,{
               'activiti:assigneeId': this.assigneeId//,
           })
           this.modeling.updateProperties(this.element,{
               'activiti:assigneeName': this.assigneeName//,
           })
        }

      },
      //新增用户表达式
      insertUserExp () {
        this.formData = {
          id:'',
          name: ''
        }

        this.showUserEdit = true
      },
      //隐藏用户界面
      hiddenListUser(){
        this.showListUserDialog = false;
      },
      //显示选择用户界面
      insertUserEvent () {
        this.showListUserDialog = true;
        this.params = '1';
       },
       //删除用户事件
       deleteUserEvent(){
         this.$refs.userTable.removeCheckboxRow();
         //更新模型
         this.modeling.updateProperties(this.element,{
             'activiti:candidateUsers1': JSON.stringify(this.$refs.userTable.getTableData().fullData)
         })
       },
       //提交用户表达式
      submitUserEvent () {
             this.submitUserLoading = true
             setTimeout(() => {
               this.submitUserLoading = false
               this.showUserEdit = false
               if(!this.isExistsUser(this.formData.id)){
                 this.$XModal.message({ message: '新增成功', status: 'success' });
                 this.$refs.userTable.insert(this.formData);
                 //更新模型
                this.modeling.updateProperties(this.element,{
                    'activiti:candidateUsers1': JSON.stringify(this.$refs.userTable.getTableData().fullData)
                })
               }else{
                 this.$XModal.message({ message: '新增失败,表达式已经存在!', status: 'success' })
               }
             }, 100)
      },
      //显示选择主办用户界面
      selectAgentUserEvent () {
         this.showListUserDialog = true;
         this.params = '2';
       },
       //判断角色是否存在
       isExistsRole(roleId){
         let rs = this.$refs.roleTable.getTableData().fullData;
         for(var i=0;i<rs.length;i++){
           if(rs[i].id == roleId){
             return true;
           }
         }
         return false;
       },
       //插入角色
       insertRole(datas){
         this.showListRoleDialog = false;
         let i=0;
         for(i=0;i<datas.length;i++){
           if(!this.isExistsRole(datas[i].id)){
             this.formData ={
               id:datas[i].id,
               name:datas[i].name
             }
             this.$refs.roleTable.insert(this.formData);
           }
         }
          //更新模型
          this.modeling.updateProperties(this.element,{
              'activiti:candidateRoles': JSON.stringify(this.$refs.roleTable.getTableData().fullData)
          })
       },
       //隐藏角色界面
       hiddenListRole(){
         this.showListRoleDialog = false;
       },
       //显示选择角色界面
       insertRoleEvent () {
         this.showListRoleDialog = true;
         //store.loadingRole = '1';
        },
       //删除角色事件
       deleteRoleEvent(){
         this.$refs.roleTable.removeCheckboxRow();
         //更新模型
         this.modeling.updateProperties(this.element,{
             'activiti:candidateRoles': JSON.stringify(this.$refs.roleTable.getTableData().fullData)
         })
       },
       //新增角色表达式
       insertRoleExp () {
         debugger;
         this.formData = {
           id:'',
           name: ''
         }

         this.showRoleEdit = true
       },
        //提交角色表达式
       submitRoleEvent () {
              this.submitRoleLoading = true
              setTimeout(() => {
                this.submitRoleLoading = false
                this.showRoleEdit = false
                if(!this.isExistsRole(this.formData.id)){
                  this.$XModal.message({ message: '新增成功', status: 'success' });
                  this.$refs.roleTable.insert(this.formData);
                 //更新模型
                    this.modeling.updateProperties(this.element,{
                        'activiti:candidateRoles': JSON.stringify(this.$refs.roleTable.getTableData().fullData)
                    })
                }else{
                  this.$XModal.message({ message: '新增失败,表达式已经存在!', status: 'success' })
                }
              }, 100)
       },
       //判断机构是否存在
       isExistsOrganization(organizationId){
         let rs = this.$refs.organizationTable.getTableData().fullData;
         for(var i=0;i<rs.length;i++){
           if(rs[i].id == organizationId){
             return true;
           }
         }
         return false;
       },
        //插入机构
        insertOrganization(datas){
          this.showListOrganizationDialog = false;
          let i=0;
          for(i=0;i<datas.length;i++){
            if(!this.isExistsOrganization(datas[i].id)){
            this.formData ={
              id:datas[i].id,
              name:datas[i].name
            }
            this.$refs.organizationTable.insert(this.formData);
            }
          }
          //更新模型
          this.modeling.updateProperties(this.element,{
              'activiti:candidateOrganizations': JSON.stringify(this.$refs.organizationTable.getTableData().fullData)
          })
        },
        //隐藏机构界面
        hiddenListOrganization(){
          this.showListOrganizationDialog = false;
        },
        //显示选择机构界面
        insertOrganizationEvent2() {
          //store.loadingOrganization = '1';
          // debugger;
          this.showListOrganizationDialog = true;
         },
         //删除机构事件
         deleteOrganizationEvent () {
           this.$refs.organizationTable.removeCheckboxRow();
           //更新模型
           this.modeling.updateProperties(this.element,{
               'activiti:candidateOrganizations': JSON.stringify(this.$refs.organizationTable.getTableData().fullData)
           })
         },
         //新增机构表达式
       insertOriganizationExp () {
         this.formData = {
           id:'',
           name: ''
         }

         this.showOrganizationEdit = true
       },
        //提交机构表达式
       submitOrganizationEvent () {
              this.submitOrganizationLoading = true
              setTimeout(() => {
                this.submitOrganizationLoading = false
                this.showOrganizationEdit = false
                if(!this.isExistsOrganization(this.formData.id)){
                  this.$XModal.message({ message: '新增成功', status: 'success' })
                  this.$refs.organizationTable.insert(this.formData);
                  //更新模型
                  this.modeling.updateProperties(this.element,{
                      'activiti:candidateOrganizations': JSON.stringify(this.$refs.organizationTable.getTableData().fullData)
                  })
                }else{
                  this.$XModal.message({ message: '新增失败,表达式已经存在!', status: 'success' })
                }
              }, 100)
       },
       	  //填充提交服务下拉框
             fillCommitServiceSelect(){
                 const that = this;
                 var condition={};
                 condition.isUse='1';
       
                   request({
                     url: `/actextapi/listName/CREATE_TIME DESC`,
                     method: 'post',
                     data:JSON.stringify(condition)
                   })
                   .then(function(res) {
                     if(res.data.status == "1") {
                       that.serviceNames = res.data.list;
                     } else {
                       that.$message(res.data.message)
                     }
       
                   })
                   .catch(function(err) {
                     that.$message("查询失败")
                   })
             },
    },
    mounted() {
        const bpmnModeler = this.bpmnModeler();
        this.modeling = bpmnModeler.get('modeling');
        this.fillCommitServiceSelect();
    },
    watch:{
        name: {
            handler(newVal, oldVal) {
                this.modeling.updateProperties(this.element,{
                    name: newVal
                });
            }
        },
        formkeydefinition (newVal, oldVal) {
            this.modeling.updateProperties(this.element,{
                'activiti:formkeydefinition': newVal//,

            })
        },
        commitService (newVal, oldVal) {
            this.modeling.updateProperties(this.element,{
                'activiti:commitService': newVal//,
            })
        },
        assigneeName(newVal,oldVal){
            //如果是变量(以${开头),id和名称设置相同
            if(newVal.indexOf("${")==0){
                this.assigneeId = newVal;
            }
            //更新模型
            this.modeling.updateProperties(this.element,{
                'activiti:assigneeId': this.assigneeId//,
            })
            this.modeling.updateProperties(this.element,{
                'activiti:assigneeName': this.assigneeName//,
            })
        },
        //监视元素变化
        element:{
            deep: true,
            immediate: true,
             handler(newVal,oldVal){
                 if(newVal.type == 'bpmn:UserTask') {
                     const bpmnModeler = this.bpmnModeler();
                     const modeling = bpmnModeler.get('modeling');
                     const businessObject = newVal.businessObject;
                     this.name = businessObject.name;
                     this.formKey = businessObject.get('formKey');
                     // 原子
                     const candidateGroupsTemp = businessObject.get('candidateGroups');
                     // 解决后端反显和切换节点反显candidateGroupsTemp类型不一致问题
                    if(candidateGroupsTemp && candidateGroupsTemp.length > 0) {
                        if(Array.isArray(candidateGroupsTemp)) {
                            //切换节点反显
                            this.candidateGroups = businessObject.get('candidateGroups');
                        } else {
                            //后端反显
                            this.candidateGroups = businessObject.get('candidateGroups').split(',');
                        }

                    }

                     this.multiinstance_type = businessObject.get('activiti:multiinstance_type') || 'None';
                     this.multiinstance_condition1 = businessObject.get('activiti:multiinstance_condition1') || '';
                     modeling.updateProperties(newVal,{'activiti:multiinstance_type':this.multiinstance_type});
                     //modeling.updateProperties(newVal,{'multiinstance_condition1':this.multiinstance_condition});
                     //读取用户、角色、机构信息
                     this.organizationData = businessObject.get('activiti:candidateOrganizations') || '';
                     if(this.organizationData==''){
                       this.organizationData =[];
                     }else{
                       this.organizationData = JSON.parse(this.organizationData);
                     }
                     this.rolesData = businessObject.get('activiti:candidateRoles') || '';
                     if(this.rolesData==''){
                       this.rolesData = [];
                     }else{
                       this.rolesData = JSON.parse(this.rolesData);
                     }
                     this.usersData = businessObject.get('activiti:candidateUsers1') || '';
                     if(this.usersData==''){
                       this.usersData=[];
                     }else{
                       this.usersData = JSON.parse(this.usersData);
                     }
                     this.assigneeId = businessObject.get('activiti:assigneeId') || ''
                     this.assigneeName = businessObject.get('activiti:assigneeName') || ''
                     this.formkeydefinition =businessObject.get('activiti:formkeydefinition');
                     this.commitService = businessObject.get('activiti:commitService');
                     this.multiinstance_collection = businessObject.get("activiti:multiinstance_collection");
                     this.multiinstance_variable = businessObject.get("activiti:multiinstance_variable");
                 }
             }
        },
        formKey:{
            handler(newVal,oldVal){
                this.modeling.updateProperties(this.element,{'formKey':newVal});
            }
        },
        multiinstance_type: {
            handler(newVal, oldVal) {
                this.modeling.updateProperties(this.element,{'activiti:multiinstance_type':newVal});
            }
        },
        multiinstance_collection: {
            handler(newVal, oldVal) {
                console.log("multiinstance_collection:"+newVal);
                this.modeling.updateProperties(this.element,{'activiti:multiinstance_collection':newVal});
            }
        },
        multiinstance_variable: {
            handler(newVal, oldVal) {
                console.log("multiinstance_variable:"+newVal);
                this.modeling.updateProperties(this.element,{'activiti:multiinstance_variable':newVal});
            }
        },
        multiinstance_condition1: {
            handler(newVal, oldVal) {
                this.modeling.updateProperties(this.element,{'activiti:multiinstance_condition1':newVal});
            }
        },
        priority: {
            handler(newVal, oldVal) {
                this.modeling.updateProperties(this.element,{'priority':newVal});
            }
        },
        candidateGroups: {
            handler(newVal,oldVal){
                this.modeling.updateProperties(this.element,{'candidateGroups':newVal});

            }
        },

    }

}
</script>
<style>

</style>
