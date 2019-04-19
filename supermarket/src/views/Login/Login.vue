<template>
    <div class="login">
        <!-- 登录表单容器 -->
        <div class="login-wrap">
            <!-- 标题 -->
            <div class="title">
                <span class="el-icon-menu"></span>
                华联超市管理系统
            </div>
            <!-- 登录表单 -->
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <!-- 账号 -->
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 提交和注册 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>

// 引入验证密码函数        
// 如果validator里面写的是： export function passwordReg(){ }    那么这里要用import { passwordReg} from ……   解构的方式
import { passwordReg } from '@/utils/validator';

// 引入local文件
import local from '@/utils/local';


export default {
    data(){

        // 确认密码   自定义验证函数   放在这个位置
        const confirmPassword=(rule,value,callback) =>{
            // rules:验证规则对象  value:用户输入的值 callback：回调函数
            if (value === ''){   //非空验证
                callback(new Error('确认密码不能为空')) //输出错误提示信息
            }else if( value !== this.loginForm.password){
                callback(new Error('两次密码不一致'))  //输出错误提示信息
            }else{
                callback()  //成功 （绿色勾勾）
            }

        }
        // 密码  自定义验证函数   放在这个位置
        const checkPassword=(rule,value,callback) =>{
            if(value === ''){    //非空验证
                callback(new Error('密码不能为空'))
            }else if(!passwordReg(value)){
                callback(new Error('以字母开头，长度在3~6之间，只能包含字符、数字和下划线'))
            }else{
                if(this.loginForm.checkPass !== ''){   //如果 即在确认密码不为空的情形下   触发一致性验证  如果为空，没有意义
                    // 触发一致性验证   这个$refs 对应的是上文所有包含ref属性的     ref="loginForm"
                    this.$refs.loginForm.validateField('checkPass')
                }
                callback() //成功回调
            }
        }

        return{
            // 表单数据
            loginForm: {
                account: '',
                password: '',
                checkPass: ''
            },
            // 验证规则
            rules:{
                // 账号
                account: [
                    { required: true, message:'请输入账号', trigger:'blur'},//非空
                    { min:3, max:8, message:'账号长度3~8位', trigger:'blur'}//长度
                ],
                // 密码
                password: [
                    { required:true, validator: checkPassword, trigger: 'blur' } //自定义验证
                ],
                // 确认密码
                checkPass: [
                    { required:true, validator: confirmPassword, trigger: 'blur' } //自定义验证
                ],
                
            }
        }
    },
    methods:{
        // 登录
        submitForm(){
            this.$refs.loginForm.validate(valid =>{
                // 如果所有前端验证都通过  valid就是true，否则就是false
                if(valid){
                    // 把数据交给后端
                    let params={
                        account: this.loginForm.account,
                        password:this.loginForm.password
                    }
                    this.request.post('/login/checklogin',params)
                    .then( res =>{
                        // console.log(res)
                        // 接收后台消息
                        let {code, reason,token} =res;
                        // 判断
                        if (code === 0){
                            // 把token存入浏览器
                            local.save('Mango',token)
                            // 弹成功
                            this.$message({
                                type:'success',
                                message:reason
                            })
                            setTimeout( ()=>{
                            // 跳转页面  欧耶
                             this.$router.push('/home')
                            },300)
                             
                        
                        }else if( code === 1){
                            this.$message.error(reason)
                        }
                        
                       

                    })
                    .catch( err =>{
                        console.log(err);
                        
                    }) 
                    // console.log(params)
                    // alert('登录成功')
                    // 路由跳转  这里写home就可以了，因为home自己会重定向调到home/systeminfo
                    // this.$router.push('/home')
                }else{
                    console.log('前端验证不通过，不允许提交')
                    return
                }
            })
        },
        // 重置
        resetForm(){
            // 重置表单
            this.$refs.loginForm.resetFields()
        }
    }
}
</script>

<style lang="less">
    // 引入样式
    @import "./login.less";//这里注意必须打分号
</style>


