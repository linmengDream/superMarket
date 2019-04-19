<template>
  <div class="goods-manage">
    <!-- 主面板 -->
    <el-card class="box-card">
      <!-- 主面板头 -->
      <div slot="header" class="clearfix">
        <span>商品管理</span>
      </div>
      <!-- 主面板内容 -->
      <div class="text item">
        <!-- 上方表单 -->
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <!-- 分类选择 -->
            <el-form-item prop="goodsClass">
                <el-select v-model="searchForm.goodsClass" placeholder="-----------选择分类----------">
                    <el-option label="全部" value="全部"></el-option>
                    <el-option label="日常用品" value="日常用品"></el-option>
                    <el-option label="个人用品" value="个人用品"></el-option>
                    <el-option label="厨房用品" value="厨房用品"></el-option>
                    <el-option label="家居用品" value="家居用品"></el-option>
                </el-select>
            </el-form-item>
            <!-- 关键字查询 -->
            <el-form-item label="关键字">
                <el-input v-model="searchForm.keyword" style='width:300px'></el-input>
                <span>&nbsp;(商品名称，条形码)</span>
            </el-form-item>
            <!-- <el-form-item label="(商品名称，条形码)"></el-form-item> -->

            <!-- 查询按钮 -->
            <el-form-item>
                <el-button size="small" type="primary" plain icon="el-icon-search" @click="onSearch">查询</el-button>
            </el-form-item>
        </el-form>

        <!-- 下方表格 -->
        <el-table
          ref="goodsTableData"
          :data="goodsTableData"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          style="width: 100%"
         >
          <!-- 单选框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 商品条形码 -->
          <el-table-column prop="goods_barcode" label="商品条形码"></el-table-column>
          <!-- 商品名称 -->
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
           <!-- 所属分类 -->
          <el-table-column prop="goods_class" label="所属分类"></el-table-column>
           <!-- 售价 -->
          <el-table-column prop="goods_price" label="售价(元)"></el-table-column>
          <!-- 促销价 -->
          <!-- <el-table-column prop="goodsPromotionPrice" label="促销价(元)"></el-table-column> -->
          <!-- 市场价 -->
          <el-table-column prop="market_price" label="市场价(元)"></el-table-column>
          <!-- 库存 -->
          <el-table-column prop="stock_number" label="库存"></el-table-column>
          <!-- 库存总金额 -->
          <!-- <el-table-column prop="InventorySale" label="库存总额(元)"></el-table-column> -->
          <!-- 管理 -->
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i>修改
              </el-button>
              <el-button size="mini" type="info" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>


        <!-- 弹出的模态框表单 -->
        <el-dialog width="400px" title="修改商品信息" :visible.sync="dialogFormVisible">
          <!-- 修改表单 -->
          <el-form :model="goodsEditForm" :rules="rules" ref="goodsEditForm">
            <!-- 商品名称 -->
            <el-form-item label="商品名称" prop="goodsName" :label-width="formLabelWidth" style="width:317px">
              <el-input v-model="goodsEditForm.goodsName" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 售价(元) -->
            <el-form-item label="售价(元)" prop="goodsPrice" :label-width="formLabelWidth" style="width:317px">
              <el-input v-model="goodsEditForm.goodsPrice" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 所属分类 -->
            <el-form-item label="所属分类" prop="goodsClass"   :label-width="formLabelWidth">
              <el-select v-model="goodsEditForm.goodsClass" placeholder="请选择分类">
                <el-option label="生活用品" value="生活用品"></el-option>
                <el-option label="个人用品" value="个人用品"></el-option>
                <el-option label="厨房用品" value="厨房用品"></el-option>
                <el-option label="家居用品" value="家居用品"></el-option>
              </el-select>
            </el-form-item>

          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </div>

      </el-dialog>


        <!-- 分页组件 -->
        <div style="margin-top:30px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1,3,5,10,20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            >
          </el-pagination>
        </div>

        <!-- 批量删除&取消选择 -->
        <div style="margin-top: 20px">
          <el-button type="info" plain slot="reference" @click="batchDel">批量删除</el-button>
          <el-button type="primary" plain @click="cancelSelect">取消选择</el-button>
        </div>
        
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 数字类型的验证 自定义
        const numberTypeCheck = (rule, value, callback) =>{
            if(value === ''){
                callback(new Error('验证码不能为空'))
            }else if(!parseInt(value)){
                callback(new Error('请输入数字'))
            }else{
                callback()
            }
        }
    return {
        // 搜索表单数据
        searchForm: {
            goodsClass: '',
            keyword: ''
        },
        // 表格 数据
        goodsTableData:[
        ],
        // 模态框
        goodsEditForm:{
          goodsName:'',
          goodsPrice:'',
          goodsClass:''
        },
        currentPage:1,
        pageSize:3,
        total: 11,
        selectedId:[],

        dialogFormVisible:false, //模态框的显示和隐藏
        formLabelWidth:'100px',  //模态框的标签的长度

        editId:'',   //点击修改处的id
        rules:{    //修改表单 模态框的验证规则
          goodsName:[
              {required:true, message:'请输入商品名称，不能为空',trigger:'blur'},
              {min:2,max:8,message:'长度在 2 到 8 个字符',trigger:'blur'}
          ],
          // 产品价格
          goodsPrice:[
              {required:true,validator:numberTypeCheck,trigger:'blur'}
          ],
        }
    };
  },
  methods: {
    // 模糊查询 
    onSearch() {
      // 调用分页函数
      this.getGoodsListByPage()

      // 收集查询参数
      // let params = {
      //   goodsClass:this.searchForm.goodsClass,
      //   keyword:this.searchForm.keyword
      // }
      // console.log(params);
      // 发送请求
      // this.request.get('/goods/search',params)
      //   .then( res =>{
      //     // console.log(res);
      //     // 接收后端响应的查询结果 赋值给表格
      //     this.goodsTableData=res;
      //   })
      //   .catch( err =>{
      //     console.log('失败',err)
      //   })
      
    },

    /* // 查询goods列表
    getGoodsList(){
          // 请求数据
              this.request.get('/goods/goodslist')
              .then ( res =>{
                  // console.log(res);
                  this.goodsTableData = res;
                  
              })
              .catch( errv =>{
                  console.log(err);
                  
              })
    }, */


    // 分页查询数据列表
    getGoodsListByPage(){
      // 收集参数
      let params={
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        goodsClass:this.searchForm.goodsClass,
        keyword:this.searchForm.keyword
      }
      // request
      this.request.get('/goods/getgoodslistbypage',params)
      .then( res =>{
        //  console.log(res);
        // 接收
        let {total, data} =res;
        this.total =total;
        this.goodsTableData=data;

        // 如果这一页没有数据了   或者已经在第一页了
          if(!data.length && this.currentPage !==1 ){
            // 回到上一页
            this.currentPage -=1;
            // 调用自己
            this.getAccountListByPage();
          }
      })
      .catch( err =>{
        console.log('失败',err);
        
      })
    },



    // 单个修改 功能
    handleEdit(id){


      // 点击修改按钮  让模态框显示
      this.dialogFormVisible=true;
      // 把要修改的id保存起来，下一步模态框修改时好用
      this.editId = id;

      // 传id到后台查询
      this.request.get('/goods/goodsedit',{id})
        .then( res =>{
          // console.log(res);
          // 接收参数  数据回填  因为是数组，所以不用解构，解构只对对象有效
          this.goodsEditForm.goodsName = res[0].goods_name;
          this.goodsEditForm.goodsPrice = res[0].goods_price;
          this.goodsEditForm.goodsClass = res[0].goods_class;
        })
        .catch( err =>{
          console.log('失败',err); 
        })
    },

    // 模态框修改
    saveEdit(){
      // 获取整个表单进行验证
      this.$refs.goodsEditForm.validate(valid =>{
        if(valid){
          // 关闭模态框
          this.dialogFormVisible=false;

          // 收集新的数据
          let params={
            goodsName:this.goodsEditForm.goodsName,
            goodsPrice:this.goodsEditForm.goodsPrice,
            goodsClass:this.goodsEditForm.goodsClass,
            editId:this.editId
          }

          // 发送请求
          this.request.post('/goods/saveeditgoods',params)
            .then( res =>{
              // console.log(res);
              // 接收后端数据
                let { code, reason} = res;
                // 判断
                if( code === 0){
                    // 弹成功提示
                    this.$message({
                        type:'success',
                        message:reason
                    })
                    // 刷新列表
                    this.getGoodsListByPage();
                }else if( code === 1){
                    this.$message.error(reason)
                }
              
            })
            .catch( err =>{
              console.log('失败',err);
              
            })


        }
      })
    },


    // 单个删除  功能
    handleDelete(id){
      // console.log(id)

      // 优化
      this.$confirm('是否确定删除？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () =>{
             // 发送请求 把id发送到后台
            this.request.get('/goods/goodsdelete',{id})
              .then( res =>{
                // console.log(res);
                // 判断
                let { code, reason} =res;
                if ( code === 0){
                  // 谈提示
                  this.$message({
                    type:'success',
                    message:reason
                  })
                  // 刷新列表
                  this.getGoodsListByPage();
                }else if( code ===1 ){
                  this.$message.error(reason)
                }
                
              })
              .catch( err =>{
                console.log(err);
                
              })
        }).catch( () =>{
            this.$message({
            type:'info',
            message:'已取消删除'
          })
        })
     
    },

    // 取消选择
    cancelSelect(){
        this.$refs.goodsTableData.clearSelection()
    },

    // 选择框发生改变
    handleSelectionChange(val){
      // console.log(val);
      // 获取id
      this.selectedId=val.map(v =>v.id)
      // console.log(this.selectedId);
    },


    // 批量删除
    batchDel(){
      // 如果没有选中   给出错误提示，并结束此函数
      // 避免 不选择就进行批量删除的操作 崩掉服务器
      if(!this.selectedId.length){
        // 谈错误
        this.$message.error('请至少选择一项之后再进行此操作')
        return false
      }

       // 优化删除体验
      this.$confirm('是否确定要批量删除？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then( ( )=>{
          // 收集参数
        let params={
          idArray:this.selectedId
        }
        // console.log("222");
        this.request.get('/goods/batchdel',params)
          .then( res =>{
              // console.log(res);
            // 接收响应
              let { code, reason} =res;
                if ( code === 0){
                  // 谈提示
                  this.$message({
                    type:'success',
                    message:reason
                  })
                  // 刷新列表
                  this.getGoodsListByPage();
                }else if( code ===1 ){
                  this.$message.error(reason)
                }
              
          })
          .catch( err =>{
            console.log('失败',err);
            
          })


        }).catch( () =>{
          this.$message({
            type:'info',
            message:'已取消删除'
          })
        })
      
      
    },


    // 每页条数改变
    handleSizeChange(val){
      // console.log(val);

     this.pageSize = val;
     this.getGoodsListByPage();
      
      // 把每页条数赋值给pageSize
      // this.pageSize=val;
      
    },
    // 当前页码改变
    handleCurrentChange(val){
      this.currentPage = val;
        // console.log(val);
        this.getGoodsListByPage();

    },

    // handleSelectionChange(){

    // }
  },
  // 钩子函数
  created(){
    // 分页请求数据函数
     this.getGoodsListByPage();
  }

};
</script>

<style lang="less">
    @import "./goodsmanage.less";
</style>


