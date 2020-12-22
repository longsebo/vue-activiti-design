<template>
  <el-dialog
    append-to-body
    title="角色列表"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="onClose">
    <ListRole ref="listRole" :params="params"></ListRole>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onOk">确 定</el-button>
      <el-button @click="onClose">关闭</el-button>
    </span>
  </el-dialog>

</template>

<script>
  import ListRole from './ListRole'

  export default {
    props: ['dialogVisible', 'params'],
    components: {
      ListRole
    },
      data(){
        return {
         
        }

      },

      methods:{
        onOk(){
       
          let selectRecords = this.$refs.listRole.getSelectRecords();
          if(selectRecords.length==0){
            this.$message("请选择角色!");
            return;
          }
          this.$emit('okDialog',selectRecords);
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
