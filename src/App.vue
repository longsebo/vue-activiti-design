<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import request from './util/request'
Vue.use(ElementUI)
export default {
  name: 'App',

  mounted() {
     var baseUrl = "8081";
     var pos = window.location.href.indexOf(baseUrl);
     if(pos>=0){
       var relaPath = window.location.href.substr(pos+baseUrl.length);
       console.log('relaPath:'+relaPath);
       this.$router.push(relaPath); // 动态跳转
     }
  },


}
</script>

<style>

</style>
