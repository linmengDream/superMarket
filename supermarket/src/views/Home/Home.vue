<template>
    <div class="home">
        <el-container>
            <!-- 左侧 -->
            <el-aside width="200px">
                <!-- 导航 -->
                <LeftNav></LeftNav>
            </el-aside>

            <!-- 右侧 -->
            <el-container>
                <!-- 头 -->
                <el-header>
                    <Top ref="top"></Top>
                </el-header>
                
                <!-- 中 -->
                <el-main>
                    <!-- 路由出口 -->
                    <router-view @A="B"></router-view>
                </el-main>

                <!-- 尾 -->
                <el-footer>
                    <Bottom></Bottom>
                </el-footer>
            </el-container>

        </el-container>    
    </div>
</template>

<script>
//1.引入组件     要在home组件中使用  所以要在这里引入
import LeftNav from '@/components/LeftNav/LeftNav.vue'
import Top from '@/components/Top/Top.vue'
import Bottom from '@/components/Bottom/Bottom.vue'

export default {
    // 2.注册组件
    components:{
        LeftNav,
        Top,
        Bottom
    },
    methods:{
        B(){
            // alert("11")
            this.$refs.top.getUserInfo()
        }
    }
}
</script>

<style lang="less">
    //  引入样式
    @import './home.less';//一定记得打分号，出了两次错了
</style>


