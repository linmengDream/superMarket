<template>
  <div class="system-info">
    <!-- 主面板 -->
    <el-card class="box-card">
      <!-- 主面板头部 -->
      <div slot="header" class="clearfix">
        <span>系统信息</span>
      </div>
      <!-- 主面板内容 -->
      <div class="text item">
        <!-- 上方  两条提示信息 -->
        <el-alert title="商品总数：5，已经销售的总金额：890.00。库存商品总价：1235.82" type="info" show-icon style="color:darkcyan"></el-alert>
        <el-alert title="导入数据" type="info" show-icon style="color:darkcyan"></el-alert>

        <!-- 下方  左右两个分面板 -->
        <!-- 左右布局 -->
        <el-row :gutter="20">
          <!-- 左列 -->
          <el-col :span="12">
            <!--左面板 -->
            <el-card class="box-card">
              <!-- 左面板头部 -->
              <div slot="header" class="clearfix">
                <span>销售排行</span>
              </div>
              <!-- 左面板内容   销售排行 -->
              <div class="text item">

                <el-table ref="salesRankData"
                  :data="salesRankData"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  style="width: 100%"
                >
                    <!-- 排行 -->
                    <el-table-column type="index" label="排行" width="60"></el-table-column>
                    <!-- <el-table-column property="date" label="日期" width="120"></el-table-column> -->
                    <!-- 商品名称 -->
                    <el-table-column property="productName" label="商品名称" width="210"></el-table-column>
                    <!-- 销量 -->
                    <el-table-column property="productSalesNum" label="销量"></el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>

          <!-- 右列 -->
          <el-col :span="12">
            <!--右面板 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>缺货的商品</span>
              </div>
              <div class="text item">
                <el-table ref="outofStockData"
                  :data="outofStockData"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  style="width: 100%"
                >
                    <!-- <el-table-column type="index" label="排行" width="60"></el-table-column> -->
                    <!-- <el-table-column property="date" label="日期" width="120"></el-table-column> -->
                    <!-- 单选框 -->
                    <el-table-column type="selection" width="55"></el-table-column>
                    <!-- 商品名称 -->
                    <el-table-column property="StockProductName" label="商品名称" width="180"></el-table-column>
                    <!-- 库存 -->
                    <el-table-column property="stockNumber" label="库存"></el-table-column>
                    <!-- 操作框 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                        <el-button type="success" plain size="mini" round @click="handleEdit(scope.$index, scope.row)">入库</el-button>
                        </template>
                    </el-table-column>

                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 返回数据
            salesRankData:[
                // 
                {
                    productName:'花露水',
                    productSalesNum:'8'
                },
                {
                    productName:'茅台酒',
                    productSalesNum:'6'
                },
                {
                    productName:'巧乐兹冰淇淋',
                    productSalesNum:'5'
                },
                {
                    productName:'绿箭口香糖',
                    productSalesNum:'2'
                }
            ],
            outofStockData:[
                {
                    StockProductName:'我的香飘飘',
                    stockNumber:'0'
                },
                {
                    StockProductName:'芒果干',
                    stockNumber:'0'
                },

            ],
            currentRow: null,
        }
    },
    methods:{
        handleCurrentChange(val){
            this.currentRow = val;
        },
        handleEdit() { },
    }
};
</script>

<style lang="less">
@import "./systeminfo.less";
</style>


