<template>
  <div>
        <el-form-item label="流程编号" >
          <el-input v-model="id" ></el-input>
        </el-form-item>
        <el-form-item label="流程名称" required>
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="作者" v-show="true">
          <el-input v-model="process_author"></el-input>
        </el-form-item>
        <el-form-item>
            <el-checkbox v-model="isExecutable" >是否可执行</el-checkbox>
        </el-form-item>
        <el-form-item label="描述" v-show="true">
          <el-input type="textarea" v-model="documentation"></el-input>  <!-- documentation   ? -->
        </el-form-item>
  </div>
</template>
<script>
import bpmnHelper from '../js/helper/BpmnHelper';
import elementHelper from '../js/helper/ElementHelper';
export default {
  //依赖注入
  props: ['element'],
  inject: ['bpmnModeler', 'params'],
  data () {
    return {
      modeling: null,
      id: '',
      name:  '',
      documentation: '',
      process_author:'',
      isExecutable:true
    }
  },
  methods: {
        getModeling(){
          if(this.modeling){
            return this.modeling;
          }else{
            var bpmnModeler = this.bpmnModeler();
            if(bpmnModeler){
               this.modeling = bpmnModeler.get('modeling');
               return this.modeling;
             }else{
               return null;
             }
          }
        }
  },
  mounted() {
  },
  watch: {
    id (newVal, oldVal) {
      if(this.getModeling()){
        this.modeling.updateProperties(this.element,{'id':newVal});
        this.modeling.updateProperties(this.element,{'process_id':newVal});
      }
    },
    name(newVal, oldVal){
      if(this.getModeling()){
        this.modeling.updateProperties(this.element,{'name':newVal});
      }
    },
    isExecutable(newVal, oldVal){
      if(this.getModeling()){
        this.modeling.updateProperties(this.element,{'isExecutable':newVal});
      }
    },
    documentation(newVal, oldVal){
        if(this.getModeling()){
          this.modeling.updateProperties(this.element,{'activiti:documentation':newVal});
        }
    },
    process_author(newVal, oldVal){
      if(this.getModeling()){
      this.modeling.updateProperties(this.element,{'process_author':newVal});
      }
    },
    // 监控element值，当发生改变时获取响应的属性
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal) {
          const bpmnModeler = this.bpmnModeler();
          this.id = newVal.businessObject.get('id');
          this.name = newVal.businessObject.get('name');
          this.documentation = newVal.businessObject.get('activiti:documentation');
          this.process_author = newVal.businessObject.get('process_author');
          this.isExecutable = newVal.businessObject.get('isExecutable');
        }
      }
    }
  }
}
</script>