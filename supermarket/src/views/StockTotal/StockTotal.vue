<template>
  <div class="stock-total">
    <!-- 主面板 -->
    <el-card class="box-card">
      <!-- 主面板头 -->
      <div slot="header" class="clearfix">
        <span>销售数据统计</span>
      </div>
      <!-- 主面板内容 -->
      <div class="text item">
        <!-- 头部表单 -->
        <el-form :inline="true" :model="stockTotalForm" class="demo-form-inline">
          <!-- 时间选择 -->
          <el-form-item label="时间">
            <el-date-picker
              v-model="value4"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" plain @click="onSearch">提交</el-button>
          </el-form-item>
        </el-form>
         <!-- 下方echarts 销售统计图 -->
        <div id="box" style="height:400px"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stockTotalForm: {
        stockDate1: "",
        stockDate2: ""
      },
       value4:[new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
    };
  },
   //  生命周期钩子函数 适合操作dom
  mounted(){
      // 1.初始化  选中dom容器      let mycharts = this.echarts.init(选中容器的的DOM)
      let myChart = this.echarts.init(document.getElementById('box'))

      // 2.准备配置
      let option ={
        // 提示：  是显示每一个小圆点的对应信息
          tooltip:{
            show:true
          },
          // 图例
          // lenged:{
          //   data:['日期']??????
          // },
          xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          // 核心配置
          series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type:'line'
              // type: 'bar' 条形图
          }]
        }
            
      // 3.使用配置生成报表
      myChart.setOption(option)

    },
  methods: {
    onSearch() {}
  }
};
</script>

<style lang="less">
@import "./stocktotal.less";
</style>


