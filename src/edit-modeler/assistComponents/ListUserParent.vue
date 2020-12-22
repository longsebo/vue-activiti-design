<template>
  <el-dialog
    append-to-body
    title="用户列表"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="onClose">
    <ListUser ref="listUser" :params="params"></ListUser>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onOk">确 定</el-button>
      <el-button @click="onClose">关闭</el-button>
    </span>
  </el-dialog>

</template>

<script>
  import ListUser from './ListUser'

  export default {
    props: ['dialogVisible', 'params'],
    components: {
      ListUser
    },
      data(){
        return {

        }

      },

      methods:{
        onOk(){

          let selectRecords = this.$refs.listUser.getSelectRecords();
          if(selectRecords.length==0){
            this.$message("请选择用户!");
            return;
          }
          //如果主办用户只能选一个
          if(this.params=='2' && selectRecords.length>1){
            this.$message("用户只能选一个!");
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
