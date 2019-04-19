<template>
  <div class="account-manage">
    <!-- 面板 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>账号管理</span>
      </div>
      <!-- 内容 -->
      <div class="text item">
        <!-- 表格 -->
        <el-table
          ref="accountTableData"
          :data="accountTableData"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          style="width: 100%"
         >
          <!-- 单选框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 账号 -->
          <el-table-column prop="account" label="账号"></el-table-column>
          <!-- 用户组 -->
          <el-table-column prop="user_group" label="用户组"></el-table-column>
          <!-- 账号创建日期 -->
          <el-table-column label="日期">
            <template slot-scope="scope">{{ scope.row.create_date | filterDate}}</template>
          </el-table-column>
          <!-- 操作框 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button size="mini" type="info" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 弹出的模态框表单 -->
        <el-dialog width="400px" title="修改账号" :visible.sync="dialogFormVisible">
          <!-- 修改表单 -->
          <el-form :model="editForm" :rules="rules" ref="editForm">
            <!-- 账号 -->
            <el-form-item label="账号" prop="account" :label-width="formLabelWidth" style="width:317px">
              <el-input v-model="editForm.account" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 用户组 -->
            <el-form-item label="用户组" prop="userGroup"   :label-width="formLabelWidth">
              <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通用户" value="普通用户"></el-option>
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
// 引入moment
import moment from 'moment';

export default {
  data() {
    return {
      accountTableData: [
        // {
        //   account: "貂蝉",
        //   userGroup: "超级管理员",
        //   createDate: "2013-03-21"
        // },
      ],
      visible2: false,
      currentPage: 1, //当前页
      pageSize:3,
      total: 11, //总共的数据条数
      editForm:{
        account:'',
        userGroup:''
      },
      editId:'', //要修改的数据的id
      dialogFormVisible:false,  //模态框的显示和隐藏
      formLabelWidth:'100px',  //模态框的标签的长度
      rules:{  //修改表单 模态框的验证规则
          account:[
            {required:true, message:'请输入用户名',trigger:'blur'},
            {min:3, max:6,message:'长度在3~6位之间',trigger:'blur'}
          ],
          // userGroup:[
          //   {required:true, message:'请选择用户组',trigger:'change'}
          // ]
      },
      selectedId:[]  //批量删除 选中的这个id数组
    };
    
  },
  methods: {

    /* // 请求所有账号数据 回来刷新页面
    getAccountList(){
        // 自动发送get请求
        this.request.get('/account/accountlist')
        .then(res =>{
          // console.log(res)
          // 把后端请求到的数据直接赋值给accountTableData
          this.accountTableData=res;
        })
        .catch(err =>{
          console.log(err)
        })
    }, */


    // 按照分页请求数据
    getAccountListByPage(){
      // 收集参数
      let params={
        currentPage:this.currentPage,
        pageSize:this.pageSize
      }
      // 请求数据
        this.request.get('/account/accountlistbypage',params)
        .then(res =>{
          
          // 接收后端返回的数据
          let {total,data} = res;
          // 赋值给对应的变量
          this.total = total;
          this.accountTableData = data;
          // console.log(res)

          // 如果这一页没有数据了   或者已经在第一页了
          if(!data.length && this.currentPage !==1 ){
            // 回到上一页
            this.currentPage -=1;
            // 调用自己
            this.getAccountListByPage();
          }
        })
        .catch(err =>{
          console.log(err)
        })
    },

    // 删除  函数方法   传入形参
    handleDelete(id) {
      // 优化删除体验
      this.$confirm('是否确定删除？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
              // // 收集参数
              // let params={
              //   id
              // }
              // console.log(id);
              // 发送请求给后端  把id传给后端
              this.request.get('/account/delaccount',{id})
                .then(res =>{
                  // console.log('成功',res)
                  // 接收后台响应回来的数据
                  let { code, reason} =res;
                  // 判断
                  if( code === 0){
                    // 弹出成功消息
                    this.$message({
                      type:'success',
                      message:reason
                    })
                    // 刷新列表
                    this.getAccountListByPage();
                  }else if( code === 1){
                    // 弹出失败消息
                    this.$message.error(reason)
                  }else if(code === 110){
                    this.$message.error(reason)
                  }
                })
                .catch(err =>{
                  console.log('失败',err)
                })

        
        }).catch( ()=>{
          this.$message({
            type:'info',
            message:'已取消删除'
          })
        })
    },

    // 修改 函数方法
    handleEdit(id) {
      // console.log(id)
      // 点击修改按钮  让模态框显示
      this.dialogFormVisible=true;

      // 发送请求 把id传给后端
      // let params={
      //   id
      // }

      // 把要修改的id保存起来，下一步模态框修改时好使用
      this.editId=id;

      this.request.get('/account/editaccount',{id})
      .then( res=>{  //后台响应回来的虽然只有一个对象但是也是数组包裹的 []  需要用索引去拿
          // console.log(res[0])
          // 数据回填！！！   把传回来的res的值   回填给模态框
          this.editForm.account = res[0].account;
          this.editForm.userGroup = res[0].user_group
      })
      .catch( err =>{
        console.log(err)
      })
    },


    // 保存 模态框 修改
    saveEdit(){
      //  获取整个表单进行验证
      this.$refs.editForm.validate(valid =>{
          // 判断是否合法，有效
          if(valid){
            // 关闭模态框
            this.dialogFormVisible=false;

            // 收集参数
            let params={
              account:this.editForm.account,
              userGroup:this.editForm.userGroup,
              editId:this.editId
            }
            // console.log(params);
            // 发送请求  把新数据和原来的id 一起发给后端
            this.request.post('/account/saveeditaccount',params)
              .then( res =>{
                console.log(res);
                // 接收后端响应的数据
                let { code, reason } = res;
                if( code === 0){
                  // 谈提示
                  this.$message({
                    type:'success',
                    message:reason
                  })
                  // 刷新列表
                  this.getAccountListByPage();

                }else if(code ===1){
                  this.$message.error(reason)
                }
              })    
              .catch( err =>{
                console.log(err);
              })

          }else{
            return false;
          }
      })
    },

    // 取消选择
    cancelSelect(){
      this.$refs.accountTableData.clearSelection()
    },


    // 当表格中  选中的选择框的状态发生改变，就会触发这个函数，而且传入当前被选中的这些数据val
    handleSelectionChange(val){
      // 获取  当前被选中的这些数据（数组）中的id 放入一个数组
      // 循环 map方法   用val去循环  v是每一项 ，=> 箭头后面是返回的对象  即v.id把每一项的id返回   map方法返回的是新的数组
      this.selectedId = val.map(v => v.id)
      // console.log(this.selectedId)
    },

    // 批量删除
    batchDel(){
      // 如果没有选中   给出错误提示，并结束此函数
      // 避免 不选择就进行批量删除的操作 崩掉服务器
      if(!this.selectedId.length){
        // 弹错误提示
        this.$message.error('请至少选择一项之后再进行此操作')
        return false
      }

      // 优化删除体验
      this.$confirm('是否确定要批量删除？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then( () =>{
          // 收集被选中的数据的id
          let params={
            idArr:this.selectedId
          }
          // 发送请求到后端 把被选中的id一起发送给后端
          this.request.get('/account/batchDel',params)
            .then( res =>{
              // console.log(res);
              // 接收数据
              let {code, reason} = res;
              // 判断
              if( code === 0){
                // 弹出成功提示
                this.$message({
                  type:'success',
                  message:reason
                })
                // 刷新列表
                this.getAccountListByPage();
              }else if( code === 1){
                this.$message.error(reason)
              }
            })
            .catch( err =>{
              console.log(err);        
            })
      }).catch( ()=>{
        this.$message({
            type:'info',
            message:'已取消删除'
          })
      })

    },


    // 每页条数改变
    handleSizeChange(val) {
      // 把每页条数赋值给pageSize
      this.pageSize = val;
      // 调用分页函数
      this.getAccountListByPage();
      // console.log(val);
    },


    // 当前页码改变
    handleCurrentChange(val) {
      // 把页码赋值给currentPage
      this.currentPage = val;
      // 调用分页函数
      this.getAccountListByPage();
      // console.log(val);
    }
  },

  
  // created 钩子函数，是vue一生中最适合发送ajax的阶段，只要渲染便会自动触发（直接进入此页面，或者通过账号信息提交跳转到这个页面）
  created(){
    // console.log('我是钩子函数，自动触发')
    // 调用 分页请求数据的函数 
    this.getAccountListByPage();
  },

  // 过滤器
  filters:{
    // 过滤时间
    // 这个函数的形参就是要过滤的那个时间
    filterDate(time){
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }
};
</script>

<style lang="less">
  @import "./accountmanage.less";
</style>


