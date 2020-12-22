<template>
   <div>
      <vxe-table
              border
              show-header-overflow
              show-overflow
              highlight-hover-row
              :align="allAlign"
              :data="rolesData"
              row-id="id"
              height="480"
              size="medium"
              :loading="loading"
              ref="xTable1"
              >
              <vxe-table-column field="id" type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="id" title="ID" width="200" ></vxe-table-column>
              <vxe-table-column field="name" title="角色名称" width="300" ></vxe-table-column>
       </vxe-table>
      <vxe-pager
          border
          size="medium"
          :loading="loading"
          :current-page="tablePage.pageNo"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange">
       </vxe-pager>
    </div>
</template>

<script>
  import 'bpmn-js/dist/assets/diagram-js.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  import request from '../../util/request.js'
  export default {
      props: ['params'],
      provide: function () {
        return {
           params: this.params
        }
      },
      data(){
        return {
          allAlign: null,
          rolesData: [],
          loading: false,
          tablePage: {
                  pageNo: 1,
                  pageSize: 10,
                  totalResult: 0
            }
        }

      },

      methods:{
        getRoleData() {
          const that = this;
            request({
              url: `/workflow/listRoles/${that.tablePage.pageSize}/${that.tablePage.pageNo}`,
              method: 'get'
            })
            .then(function(res) {

              if(res.data.status == "1") {
                that.rolesData = res.data.list;
                that.tablePage.totalResult = res.data.totalResult
              } else {
                that.$message(res.data.message)
              }

            })
            .catch(function(err) {
              that.$message("查询失败")
            })

        },
        getSelectRecords(){
          //获取选中的行
           let selectRecords = this.$refs.xTable1.getCheckboxRecords()
           return selectRecords;
        },
        onClose(){
           //给父组件传参
           this.$emit('closeDialog',false)

        },
        handlePageChange ({ currentPage, pageSize }) {
            this.tablePage.pageNo = currentPage
            this.tablePage.pageSize = pageSize
            //store.loadingRole ="1";
            this.getUserData()
        }


      },
      props:["params"],
      mounted () {
        this.getRoleData();

        }
    }
</script>

<style>
</style>
