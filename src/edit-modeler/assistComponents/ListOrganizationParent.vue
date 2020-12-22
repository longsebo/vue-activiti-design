<template>
  <el-dialog
    append-to-body
    title="机构列表"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="onClose">
    <ListOrganization ref="listOrganization" :params="params"></ListOrganization>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onOk">确 定</el-button>
      <el-button @click="onClose">关闭</el-button>
    </span>
  </el-dialog>

</template>

<script>
  import ListOrganization from './ListOrganization'

  export default {
    props: ['dialogVisible', 'params'],
    components: {
      ListOrganization
    },
      data(){
        return {
          
        }

      },

      methods:{
        onOk(){
          
          let selectRecords = this.$refs.listOrganization.getSelectRecords();
          if(selectRecords.length==0){
            this.$message("请选择机构!");
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
