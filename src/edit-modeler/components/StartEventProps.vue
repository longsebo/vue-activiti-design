<template>
    <div>
        <el-form-item label="编号" v-show="false">
            <el-input v-model="id"></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="获取业务主键服务" >
            <el-select v-model="commitService">
              <el-option
                v-for="item in serviceNames"
                :key="item"
                :value="item"
                :label="item">
                </el-option>
              </el-select>

        </el-form-item>
        <el-form-item label="描述" >
            <el-input type="textarea" v-model="documentation"></el-input>
        </el-form-item>
        <el-form-item label="发起人" >
            <el-input v-model="initatorName"></el-input>
            <vxe-button icon="fa fa-plus" @click="selectinitatorEvent()">选择用户</vxe-button>
        </el-form-item>
       <ListUserParent refs="listUserParent" @okDialog='insertUser' @closeDialog='hiddenListUser' :dialogVisible="showListUserDialog" :params="params"></ListUserParent>
    </div>

</template>
<script>

import bpmnHelper from '../js/helper/BpmnHelper';
import request from '../../util/request.js';
export default {
    props: ['element'],
    inject: ['bpmnModeler'],
    data(){
        return {
            modeling: null,
            id : this.element.id || '',
            name: '',
            documentation:'',
            initator: '',
            initatorName: '',//保存发起用户名称
            // formkeydefinition:'',
            commitService:'',
            showListUserDialog:false,
            params:'2',
            serviceNames:[]
        }
    },
	methods:{
      //显示选择主办用户界面
      selectinitatorEvent () {
         this.showListUserDialog = true;
         this.params = '2';
       },
       //隐藏用户界面
       hiddenListUser(){
         this.showListUserDialog = false;
       },
       //插入用户
       insertUser(datas){

                  this.initator=datas[0].id,//主办用户id
                  this.initatorName=datas[0].name;
                  //更新模型
                  this.modeling.updateProperties(this.element,{
                      'activiti:initator': this.initator//,
                  })
                  this.modeling.updateProperties(this.element,{
                      'activiti:initatorName': this.initatorName//,
                  })
                  this.showListUserDialog = false;

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
      }
    },
    mounted() {
        const bpmnModeler = this.bpmnModeler();
        this.modeling = bpmnModeler.get('modeling');
        this.fillCommitServiceSelect();
    },
    watch: {
        id (newVal, oldVal) {
            this.modeling.updateProperties(this.element,{
                id: newVal
            })
        },
        name (newVal, oldVal) {

            this.modeling.updateProperties(this.element,{
                name: newVal//,
               // documentation:'test'
            })
            //console.log('enter name change');
        },
        documentation (newVal, oldVal) {

            this.modeling.updateProperties(this.element,{
                'activiti:documentation': newVal//,

            })
            console.log('enter desc1 change');
        },
        initatorName (newVal, oldVal) {
            debugger;
            //如果是变量(以${开头),id和名称设置相同
            if(newVal){
              if(newVal.indexOf("${")==0){
                  this.initator = newVal;
              }
              //更新模型
              this.modeling.updateProperties(this.element,{
                  'activiti:initator': this.initator//,
              })
            }
            this.modeling.updateProperties(this.element,{
                'activiti:initatorName': this.initatorName//,
            })
            //console.log('enter initator change');
        },
        commitService (newVal, oldVal) {

            this.modeling.updateProperties(this.element,{
                'activiti:commitService': newVal//,

            })

        },
        element: {
            deep: true,
            immediate: true,
            handler(newVal, oldVal) {
                if(newVal.type === 'bpmn:StartEvent') { // 防止修改其他子组件的属性
                    const businessObject = newVal.businessObject;
                    this.name = businessObject.get('name');
                    this.documentation =businessObject.get('activiti:documentation');
                    this.initator =businessObject.get('activiti:initator');
                    this.initatorName =businessObject.get('activiti:initatorName');
                    this.commitService = businessObject.get('activiti:commitService');
                }

            },

        },
    }
}
</script>
<style>

</style>
