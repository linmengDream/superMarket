<template>
  <div class="">
    <!-- 主面板 -->
    <el-card class="box-card">
        <!-- 主面板头 -->
        <div slot="header" class="clearfix">
            <span>添加商品</span>
        </div>
        <!-- 主面板内容 -->
        <div class="text item"></div>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.goods-manage{
    // 面板组件
    .el-card{
        // 面板头
        .el-card__header{
            font-size: 20px;
            font-weight: bold;
            background-color: #f1f1f1;
        }
        // 面板内容
        .el-card__body{
            // 表单
            .el-form{
              
            }
        }
    }
}
</style>