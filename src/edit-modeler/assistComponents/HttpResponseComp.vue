<template>
  <div>
    <el-form label-width="120px">
        <el-form-item label="应答测试字段" required>
          <el-radio class="radio" v-model="respondTestField" label="respondText"> 响应文本</el-radio>
          <el-radio class="radio" v-model="respondTestField" label="respondHeader"> 响应头</el-radio>
        </el-form-item>
        <el-form-item label="正确应答匹配字符串" required>
          <el-input v-model="correctAnswerMatches"></el-input>
        </el-form-item>
        <el-form-item label="提取业务主键正则表达式"  v-show="isBusinessKeyRegExp">
          <el-input v-model="businesskeyRegExp"></el-input>
        </el-form-item>
        <el-form-item label="提取响应错误消息正则表达式" required>
          <el-input v-model="respondMessageRegExp"></el-input>
        </el-form-item>
   </el-form>
  </div>
</template>

<script>
  import store from './Store'
  export default {
    props: [],

    data(){
        return {
          respondTestField:'',
          correctAnswerMatches:'',
          businesskeyRegExp:'',
          respondMessageRegExp:'',
          isBusinessKeyRegExp:true,
          randomNumber:0,
          timer: '',
        }

      },

      methods:{
        getHttpResponse(){
          debugger;
          var httpResponse1={};
          httpResponse1.respondTestField = this.respondTestField;
          httpResponse1.correctAnswerMatches = this.correctAnswerMatches;
          httpResponse1.businesskeyRegExp = this.businesskeyRegExp;
          httpResponse1.respondMessageRegExp = this.respondMessageRegExp;
          return httpResponse1;
        },
        loadData(){
          if(store.randomNumber!=this.randomNumber){
            this.randomNumber = store.randomNumber;
            this.respondTestField = store.httpResponse.respondTestField;
            this.correctAnswerMatches = store.httpResponse.correctAnswerMatches;
            this.businesskeyRegExp = store.httpResponse.businesskeyRegExp;
            this.respondMessageRegExp = store.httpResponse.respondMessageRegExp;
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
