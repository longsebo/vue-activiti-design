<template>
  <el-dialog
    append-to-body
    title="提交服务设置"
    :visible.sync="dialogVisible"
    width="100%"
    height="100%"
    :before-close="onClose"
    >
    <StartEventCommitServiceConf ref="commitServiceConf" 
    ></StartEventCommitServiceConf>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onOk">确 定</el-button>
      <el-button @click="onClose">关闭</el-button>
    </span>
  </el-dialog>

</template>

<script>
  import StartEventCommitServiceConf from './StartEventCommitServiceConf'

  export default {
    name:"StartEventCommitServiceParent",
    props: ['dialogVisible'
    ],
    components:
      {StartEventCommitServiceConf}
    ,
      data(){
        return {
        }

      },

      methods:{
        onOk(){
          var httpRequestConf1 = this.$refs.commitServiceConf.getHttpRequest();
          var httpResponseConf1 = this.$refs.commitServiceConf.getHttpResponse();
          this.$emit('okDialog',httpRequestConf1,httpResponseConf1);
        },
        onClose(){
           //给父组件传参
           this.$emit('closeDialog',false)
        }
      }
    }
</script>

<style>
</style>
