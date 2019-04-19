<template>
    <div class="top">
        <!-- 布局 -->
        <el-row :gutter="20">
            <!-- 左侧标题 -->
            <el-col :span="20">
                <h3>
                    <i class="el-icon-menu"></i>
                    华联超市管理系统
                </h3>
            </el-col>
            <!-- 右侧头像 和用户名 -->
            <el-col :span="4">
                <el-row>
                    <!-- 头像 -->
                    <el-col :span="10">
                        <div class="avatar">
                            <img :src="avatar" alt="">
                        </div>
                    </el-col>
                    <!-- 用户名 -->
                    <el-col :span="14">
                        <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                {{account}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <!-- <el-dropdown-item @click="personalCenter()">个人中心</el-dropdown-item> -->
                                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">退出系统</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
// y引入local
import local from '@/utils/local'
export default {
    data(){
        return{
            account:'',
            avatar:''
        }
    },
    methods:{
        // 退出登录功能
        handleCommand(command){
            // console.log(command)
            // 判断
            if(command ==='personal'){
                // console.log('个人中心')
                // 跳转到个人中心
                this.$router.push('/home/personal')

            }else if(command === 'logout'){
                // 清除token
                local.remove('Mango');

                // 退出提示
                this.$message({
                    type:'success',
                    message:'退出成功,欢迎下次光临'
                })


                // 跳转到登录页
                setTimeout( () =>{
                    this.$router.push('/login')
                },600)
            }
        },
        // 获取当前登录账号
        getUserInfo(){
            this.request.get('/account/accountinfo')
                .then( res =>{
                    // console.log(res);
                    // 接收后端响应的数据 
                    let { account, avatar } = res[0];
                    // console.log(res);
                    
                    // 赋值给对应的变量
                    this.account = account;
                    this.avatar = `http://127.0.0.1:666/${avatar}`
                    // console.log(avatar);
                    
                    
                })
                .catch( err =>{
                    console.log(err);
                    
                })
        }
    },
    created(){
        this.getUserInfo();
    }
}
</script>
<style lang="less">
    @import './top.less';
</style>
