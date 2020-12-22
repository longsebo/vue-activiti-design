<template>
  <div>
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="请求" name="httprequest">
        <HttpRequestComp v-if="isHttpRequest" ref="requestComp"  />
      </el-tab-pane>
      <el-tab-pane label="请求头" name="httprequestheader">
        <HttpRequestHeaderComp v-if="isHttpRequestHeader" ref="requestHeaderComp"  />
      </el-tab-pane>
      <el-tab-pane label="应答" name="httpresponse">
        <HttpResponseComp v-if="isHttpResponse" ref="responseComp" />
      </el-tab-pane>
     </el-tabs>
   </div>
</template>

<script>
  import HttpRequestComp from './HttpRequestComp.vue'
  import HttpResponseComp from './HttpResponseComp.vue'
  import HttpRequestHeaderComp from './HttpRequestHeaderComp.vue'
  import store from './Store.vue'
  export default {
    name:"StartEventCommitServiceConf",
    props: [
        ],
    components: {
      HttpRequestComp,
      HttpResponseComp,
      HttpRequestHeaderComp
    },
    data() {
      return {
        // 默认第一个Tab
        activeName: 'httprequest',
        isHttpRequest: true,
        isHttpResponse: false,
        isHttpRequestHeader:false
      }
    },
    methods: {
      handleClick(tab) {
        debugger;
        //更新应答
        store.httpResponse = this.getHttpResponse();
        //更新请求
        store.httpRequest = this.getHttpRequest();
        store.httpRequest.requestHeadSet = this.getHttpRequestHeader();
        if (tab.name === 'httprequest') {
          this.isHttpRequest = true;
          this.isHttpResponse = false;
          this.isHttpRequestHeader = false;
        } else if (tab.name === 'httpresponse') {
          this.isHttpRequest = false;
          this.isHttpResponse = true;
          this.isHttpRequestHeader = false;
        } else if(tab.name === 'httprequestheader'){
          this.isHttpRequest = false;
          this.isHttpResponse = false;
          this.isHttpRequestHeader = true;
        }
      },
      getHttpRequest(){
        if(this.$refs.requestComp){
          var httpRequest1 =  this.$refs.requestComp.getHttpRequest();
          httpRequest1.requestHeadSet = store.httpRequest.requestHeadSet;
          return httpRequest1;
        }else{
          return store.httpRequest;
        }
      },
      getHttpRequestHeader(){
        if(this.$refs.requestHeaderComp){
          return this.$refs.requestHeaderComp.getHttpRequestHeader();
        }else{
          return store.httpRequest.requestHeadSet;
        }
      },
      getHttpResponse(){
        if(this.$refs.responseComp){
          return this.$refs.responseComp.getHttpResponse();
        }else{
          return store.httpResponse;
        }
      }
    }
  }

</script>

<style>
</style>
