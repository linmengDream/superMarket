<template>
    <div class="password-modify">
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <span>修改账号密码</span>
            </div>
            <div class="text item">
               <el-form :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-width="100px" class="demo-ruleForm">
                    <!-- 原密码 -->
                    <el-form-item label="原密码" prop="oldPassword">
                        <el-input type="text" v-model="passwordForm.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 新密码 -->
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="text" v-model="passwordForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 确认新密码 -->
                    <el-form-item label="确认新密码" prop="checkNewPass">
                        <el-input type="text" v-model="passwordForm.checkNewPass" autocomplete="off"></el-input>
                    </el-form-item>
                  
                    <el-form-item>
                        <el-button type="primary" plain @click="editForm()">修改</el-button>
                        <el-button type="info" plain @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
// 引入正则工具函数
import { passwordReg } from '@/utils/validator';
// 引入local
import local from '@/utils/local'

export default {
    data(){
        // 自定义验证旧密码
        const checkOldPassword =(rule,value,callback) =>{
            // 发送axios给后端
            this.request.post('/account/passwordmodify',{oldPassword:value})
             .then( res =>{
                //  console.log(res);
                // 接收后端响应的数据
                let {code, reason} =res;
                // 判断
                if( code === 0){
                    callback()
                }else if( code === 1){
                    callback(new Error(reason))
                }
             })
             .catch( err =>{
                 console.log('失败',err);   
             })
        }
        // 新密码  验证
        const CheckNewPassword=(rule,value,callback) =>{
            if(value === ''){
                callback(new Error('请输入新密码，不能为空'))
            }else if(!passwordReg(value)){
                callback(new Error('以字母开头，长度在3~6，只能包含字符、数字和下划线'))
            }else{
               if(this.passwordForm.checkNewPass !== ''){
                    // 触发一次性验证
                    this.$refs.passwordForm.validateField('checkNewPass')
               } 
               callback();  //成功
            }
        };
        // 确认新密码验证
        const ConfirmNewPassword=(rule,value,callback)=>{
            if(value === ''){
                callback(new Error('确认新密码，不能为空'))
            }else if(value !== this.passwordForm.newPassword){
                callback(new Error('两次密码输入不一致'))
            }else{
                callback() //
            }
        }
        return{
            // 修改密码的数据
            passwordForm:{
                oldPassword:'',
                newPassword:'',
                checkNewPass:''
            },
            // 规则验证
            rules:{
                // 密码
                oldPassword:[
                    {required:true, validator:checkOldPassword, trigger:'blur'}
                ],
                // 新密码
                newPassword:[
                    {required:true, validator:CheckNewPassword, trigger:'blur'}
                ],
                // 确认新密码
                checkNewPass:[
                    {required:true, validator:ConfirmNewPassword, trigger:'blur'}
                ]
            }
        }
    },
    methods:{
        // 修改
        editForm(){
            this.$refs.passwordForm.validate((valid) =>{
                if(valid){
                    // 收集新的密码
                    let params={
                        newPassword: this.passwordForm.newPassword,
                    }
                    // alert('修改成功')
                    // 发送请求给后端
                    this.request.post('/account/editnewpassword',params)
                        .then( res =>{
                            // console.log(res);
                            // 接收响应
                            let { code , reason} = res;
                            // 判断
                            if(code === 0){
                                // 弹成功消息
                                this.$message({
                                    type:'success',
                                    message:reason
                                })
                                // 删除token！！！！
                                local.remove('Mango')
                                // 跳转
                                this.$router.push('/login')

                            }else if(code === 1){
                                this.$message.error(reason)
                            }
                        })
                        .catch( err =>{
                            console.log('失败',err);
                            
                        })
                }else{
                    console.log('修改未成功，请检查错误');
                    return
                }
            })
        },
        // 重置
        resetForm(){
            this.$refs.passwordForm.resetFields();
        }
    }
}
</script>

<style lang="less">
    @import './passwordmodify.less';
</style>


