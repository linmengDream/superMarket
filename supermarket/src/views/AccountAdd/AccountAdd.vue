<template>
    <div class="account-add">
        <!-- 面板组件 -->
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <span>添加管理员账号</span>
            </div>
            <!-- 内容 -->
            <div class="text item">
                <el-form :model="accountAddForm" status-icon :rules="rules" ref="accountAddForm" label-width="100px" class="demo-ruleForm" size="medium">
                    <!-- 账号 -->
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accountAddForm.account" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="密码" prop="password">
                        <el-input type="text" v-model="accountAddForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 确认密码 -->
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="text" v-model="accountAddForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 选择用户组 -->
                    <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="accountAddForm.userGroup" placeholder="请选择用户组">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">添加</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
     </div>
</template>

<script>
// 引入正则工具函数
import { passwordReg } from '@/utils/validator';
// // 引入qs
// import qs from 'qs'

export default {
    data(){
        // 自定义验证   密码函数
        const checkPassword = (rule,value,callback)  =>{
             if(value === ''){  //非空
                callback(new Error('密码不能为空'))
             }else if(!passwordReg(value)){   //正则
                 callback(new Error('以字母开头，长度在3~6，只能包含字符、数字和下划线'))
             }else{
                 if(this.accountAddForm.checkPass !== ''){
                    //  触发一致性验证    ？？？？
                    this.$refs.accountAddForm.validateField('checkPass')
                 }
                 callback(); //成功
             }
        }
        // 自定义验证   确认密码函数
        const confirmPassword = (rule,value,callback)  =>{
            if(value === ''){   //非空验证
                callback(new Error('确认密码不能为空'))
            }else if(value !== this.accountAddForm.password){   //一致性验证
                callback(new Error('两次密码不一致'))
            }else{
                callback();  //成功
            }
        }
        return{
            // 添加账号表单数据
            accountAddForm:{
                account:'',
                password:'',
                checkPass:'',
                userGroup:''
            },
            // 验证规则
            rules:{
                // 规则
                account:[
                    {required:true, message:'请输入账号', trigger:'blur'}, //非空验证
                    {min:3,max:6,message:'账号长度3~6位',trigger:'blur'} //长度验证
                ],
                // 密码
                password:[
                    {required:true, validator:checkPassword, trigger:'blur'} //自定义
                ],
                // 确认密码
                checkPass:[
                    {required:true, validator:confirmPassword, trigger:'blur'} //自定义                    
                ],
                // 用户组
                userGroup:[
                    {required:true,message:'请选择用户组',trigger:'change'} //非空
                ]
            }
        }
    },
    methods:{
        // 添加账号
        submitForm(){
            this.$refs.accountAddForm.validate(valid =>{
                if(valid){
                    // 收集账号数据
                    let params={
                        account:this.accountAddForm.account,
                        password:this.accountAddForm.password,
                        userGroup:this.accountAddForm.userGroup,
                    }
                    // console.log(params)
                    // console.log("哈哈",this.request);  this.request就代表了axios

                    // 发送axios  get请求,把数据发送给后台
                    // this.request.post('http://127.0.0.1:666/account/accountadd',params)
                        // params:{}  因为和上面的params同名，且同样是对象，本来就是获取上面的params  且封装了，就不用{}对象包住了
                        // 'http://127.0.0.1:666/account/accountadd'  这里的这个后台服务器地址如果不写，就会变成http://127.0.0.1:8080  默认的前端服务器地址就是不对的
                        // 但是每次请求都要输入这个后台服务器地址很麻烦，所以在request.js里面设置一个服务器根目录
                    this.request.post('/account/accountadd',params)
                    .then(res =>{
                        //  console.log('成功',res);
                        // 接收后端响应回来的数据
                        let {code, reason} =res;
                        // 判断
                        // 如果成功
                        if( code === 0){
                            // 弹成功提示
                            this.$message({
                                type:'success',
                                message:reason
                            })
                            // 跳转账户列表
                            this.$router.push('/home/accountmanage')
                            // 如果失败
                        }else if( code === 1){
                            this.$message.error(reason)
                        }
                    })
                    .catch(err =>{
                        console.log('失败',err);
                        
                    })
                    // 发送axios post请求
                   /*  this.request.post('/url',qs.stringify(params))
                    .then(response =>{
                        console.log(response.data);
                    })
                    .catch(err =>{
                        console.log(err);
                    })  */

                    
                    
                    // alert('添加账号成功')
                    // 跳转
                    // this.$router.push('/home/accountmanage')
                }else{
                    console.log('前端验证不通过，不许提交')
                    return
                }
            })
        },
        // 重置
        resetForm(){
            // 获取到整个表单 accountAddForm
            this.$refs.accountAddForm.resetFields()
        }
    }
}
</script>

<style lang="less">
    @import './accountadd.less';
</style>


