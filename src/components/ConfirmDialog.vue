<template>
  <el-dialog
      append-to-body
      :title="title"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="onClose">
      {{content }}
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onOk">{{confirmText}}</el-button>
        <el-button @click="onClose" v-if="isShowCancel">{{cancelText}}</el-button>
      </span>
    </el-dialog>

</template>

<script>

  export default {
    name:"ConfirmDialog",
    props: ['dialogVisible', 'title','content','confirmText','cancelText','isShowCancel'],
     data(){
        return {

        }

      },

      methods:{
        onOk(){
          this.$emit('okDialog');
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
