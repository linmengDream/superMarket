<template>
    <div class="left-nav">
        <!-- 导航组件 -->
        <!-- :default-active="$route.path"   这里是动态绑定当前激活菜单index，可以通过route的自带方法path获取到此地址index -->
        <el-menu
            :default-active="$route.path"    
            class="el-menu-vertical-demo"
            background-color="rgb(48,65,86)"
            text-color="#fff"
            active-text-color="darkcyan"
            unique-opened
            router
            >
            
            <!-- 导航 -->
            <!-- 字符串加上任何类型都是字符串 -->
            <el-submenu :index="(index+1)+'' " v-for="(menu, index) in menus" :key="index">
                <!-- 图标和标题 -->
                <template slot="title">
                    <i :class="menu.iconClass"></i>
                    <span>{{ menu.title }}</span>
                </template>
                <!-- 二级导航 -->
                <el-menu-item :index="subMenu.path" v-for="(subMenu,i) in menu.children" :key="i">
                {{ subMenu.subTitle}}
                </el-menu-item>
            </el-submenu>

        </el-menu>
    </div>
</template>
<script>
export default {
    data(){
        return {
            // 导航菜单数据
            menus:[]
        }
    },
    methods:{
        getMenus(){
            // 请求用户角色 方便使用
            this.request.get('/account/menus')
            .then( res =>{
                // console.log(res);  
                //存入本地存储
                this.menus = res.accessMenu;
                    
            })
            .catch( err =>{
                console.log(err);  
            })
        }
    },
    // 生命周期自动
    created(){
        // 调用请求 请求菜单数据
       this.getMenus()
    }
}
</script>
<style lang="less">
    @import './leftnav.less';
</style>


