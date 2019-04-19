<template>
  <div class="sales-total">
    <!-- 主面板 -->
    <el-card class="box-card">
      <!-- 主面板头 -->
      <div slot="header" class="clearfix">
        <span>销售数据统计</span>
      </div>
      <!-- 主面板内容 -->
      <div class="text item">
        <!-- 上方表单 -->
        <el-form :inline="true" :model="salesTotalForm" class="demo-form-inline" style>
          <!-- 关键字查询 -->
          <!-- <el-form-item label="关键字">
                        <el-input v-model="salesTotalForm.keyword" style='width:300px'></el-input>
                        <span>&nbsp;(商品名称，条形码)</span>
          </el-form-item>-->

          <!-- 时间选择 -->
          <el-form-item label="时间">
            <!-- <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="salesTotalForm.salesDate1" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="width:14px">--</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="salesTotalForm.salesDate2" style="width: 100%;"></el-date-picker>
            </el-col>-->
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <!-- 分类选择 -->
          <el-form-item>
            <el-select
              v-model="salesTotalForm.salesSituation"
              placeholder="---销售情况统计---"
              style="width:150px"
            >
              <el-option label="销售月统计" value="销售月统计"></el-option>
              <el-option label="销售季度统计" value="销售季度统计"></el-option>
              <el-option label="销售年度统计" value="销售年度统计"></el-option>
            </el-select>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" plain @click="onSubmit">提交</el-button>
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
      // 表单数据
      salesTotalForm: {
        salesSituation: "",
        salesDate1: "",
        salesDate2: ""
      },
      value1:[new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
    };
  },
  // created(){
  //   // console.log(this.echarts);
    
  // }
  //  生命周期钩子函数 适合操作dom
  mounted(){
    // 假设从前台发送了请求： 请求此时间段的数据  2019-04-10 2019-04-16
    // 假设这是后台响应回来的事件
    var res={
      categoryName:['2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14', '2019-04-15', '2019-04-16'],
      value: [500, 1500, 3000, 2000, 1250, 460, 5000]
    };
    let { categoryName, value} = res;
    // 调用函数  生成报表   把后端传回数据填进去
    this.salesCharts(categoryName,value);
  },

  methods: {
    // 提交
  onSubmit() {

    },
    // 生成销售报表
  salesCharts(categoryData=[],value=[]){
            // 1.初始化  选中dom容器      let mycharts = this.echarts.init(选中容器的的DOM)
      let myChart = this.echarts.init(document.getElementById('box'))

      // 2.准备配置
      let option ={
        // 提示：  是显示每一个小圆点的对应信息
          tooltip:{
            show:true
          },
          // 图例 
          legend:{
            data:['销量']
          },
          xAxis: {
              type: 'category',
              // data: []
              data:categoryData
          },
          yAxis: {
              type: 'value'
          },
          // 核心配置
          series: [{
             "name":"销量",
              type:'line',
              // data: [],
              data:value
              // type: 'bar' 条形图
          }]
        }
            
      // 3.使用配置生成报表
      myChart.setOption(option)
    }
  }
  
};
</script>

<style lang="less">
@import "./salestotal.less";
</style>


