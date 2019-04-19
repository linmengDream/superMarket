var express = require('express');
var router = express.Router();

// 测试通不通
// router.get('/',(req,res) =>{
//     res.send('哈哈哈')
// })

// 引入nodejs和数据库连接的模块  这样这个版块才能访问数据库
const connection = require('./js/conn');


//跨域  指的是  3个地方不一致都会导致跨域的问题  协议 http： https:   端口：：8080  ：666   还有就是中间的ip
// 在后台响应之前  写一个路由统一设置响应头，all就是所有的路由就都不用再单独设置了   解决跨域的问题   404
router.all('*',(req,res,next) =>{
    // 设置响应头 解决跨域   接收从前台 这个地址传来的信息    后面一个参数还可以是*，就是所有的地址都可以
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers", "authorization,Content-Type"); // 允许通过头部信息authorization 携带token
    // res.send('如果不写next（），则发回前台的是这句话，而后面的真正响应的信息 111就被拦截了，无法返回去')
    // 放行
    next()
})


// /* --------------------  验证token合法性开始  ---------------- */ 
// 此部分必须放在响应头之后，所有路由之前！！！

// 0.准备一个签名 (秘钥)
const secretKey = 'lemon';
// 1.引入
const expressJwt = require('express-jwt');

// 2.验证token合法性
    router.use(expressJwt ({
        // secret: 我们生成token的秘钥
        secret:secretKey
    }).unless({
        path: ['/login/checklogin']  // 除了这些地址，其他的URL都需要验证
    }));

// 3.路由拦截器
router.use(function (err, req, res, next) {
    // 如果前端没有token或者是错误的token 就会抛出如下错误
    if (err.name === 'UnauthorizedError') { 
        // 响应给前端token无效的信息
        res.status(401).send('token不合法...');
    }
})
/* --------------------  验证token合法性结束  ---------------- */ 

/* 添加账号路由 */
// 接收请求
router.post('/accountadd',(req,res) =>{         

    // res.setHeader("Access-Control-Allow-Origin","*")
    // 接收前端数据
    let { account, password, userGroup} =req.body;

    let avatar = '/upload/default.jpg'; //默认头像


    // 同时存入数据库 两个步骤
    // 1.写sql
    const sqlStr = `insert into account(account,password,user_group,avatar) values('${account}','${password}','${userGroup}','${avatar}')`
    
    // console.log(sqlStr)    //这里必须测试！！！！！

    // 2.执行sql
    connection.query(sqlStr,(err,data) =>{
        if (err) throw err;
        //  console.log(data)  //打印出来 data是个对象
        // 如果受影响行数>0
        if(data.affectedRows >0){
            // 响应成功的数据对象给前端
            res.send({code:0, reason:"添加账号成功"})
        }else{
            // 响应失败的数据对象给前端
            res.send({code:1, reason:"添加账号失败"})
        }

    })
    // 必须要响应一个东西
    //  res.send('通了')
})

/* 请求账号列表路由 */
router.get('/accountlist',(req,res) =>{
    // res.send("请求账号列表接通")
    // 直接去数据库查找所有的数据 两步
    // 1.写sql    desc降序
    const sqlStr=`select * from account order by create_date desc`;
    // console.log(sqlStr)
    // 2.执行sql
    connection.query(sqlStr,(err,data) =>{
        if (err) throw err;
        // console.log(data)  //看有没有拿到数据
        res.send(data)
    })
})

/* 分页路由 */
router.get('/accountlistbypage', (req,res) =>{
    // 接收参数
    let {currentPage, pageSize} = req.query;
    // 构造sql
    let sqlStr = `select * from account order by create_date desc`;
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if(err) throw err;
        // console.log(data);   //数组
        // 获取数据总条数
        let total = data.length;
        // 每个页码对应的数据  
        // 计算跳过多少条
        let n = (currentPage - 1) * pageSize;
        // 拼接 分页sql  跳过多少条，每页多少条
        // 注意 limit前面必须留空格 为了排版
        sqlStr += ` limit ${n}, ${pageSize}`;

        // console.log(sqlStr)
        // // 执行sql
        connection.query(sqlStr, (err, data) =>{
            if (err) throw err;
            // 把数据总条数和每个页码对应的数据发送给前端
            res.send({total,data})
        })
        
    })
    //  res.send('hhhh')
})

/* 删除账号路由 */
// 接收请求
router.get('/delaccount',(req,res) =>{
    if(req.user.user_group === '普通用户'){
        res.send({code:110, reason:'不好意思，您没有删除权限'})
        return;
    }
    // 接收数据
    let {id} = req.query;
    // 根据id去数据库查找数据
    // 1.写sql
    const sqlStr=`delete from account where id=${id}`;
    // console.log(sqlStr)
    // 2.执行sql
    connection.query(sqlStr,(err,data) =>{
        if (err) throw err;
        // console.log(data)
        // 判断
        if(data.affectedRows >0){
            // 响应成功的数据对象给前端
            res.send({ code:0, reason:'删除账号成功'})
        }else{
            // 响应失败的数据对象给前端
            res.send({ code:1, resaon:' 删除账号失败'})
        }
    })
    // res.send("接到了")
})


/* 修改账号路由 ---  数据回填*/
// 接收请求
router.get('/editaccount',(req,res) =>{
    // 接收数据
    let { id } = req.query;
    // console.log(id);
    // 根据id 去数据库查找数据
    // 1.写sql
    const sqlStr=`select * from account where id=${id}`
    // console.log(sqlStr)

    // 2.操作sql
    connection.query(sqlStr,(err,data) =>{
        if (err) throw err;
        res.send(data)// 把查询到的数据响应给前端
    })
    // res.send('接到了')
})

/* 修改账号路由 ---  保存新数据*/
router.post('/saveeditaccount',( req, res) =>{
    // 接收数据
    let { account, userGroup, editId} =req.body;
    // 存入数据库
    // 1写sql
    const sqlStr = `update account set account='${account}', user_group='${userGroup}' where id=${editId}`;
    // console.log(sqlStr);
    // 2.执行
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        // 判断成功
        if( data.affectedRows >0 ){
            res.send({code:0, reason:'修改账号成功'})
        }else{
            res.send({code:1, reason:'修改账号失败'})
        }
    })
    // res.send('hahaah')
})


/* 批量删除 */
router.get('/batchDel', (req,res) =>{
    // 接收id们  数组
    let {idArr} = req.query;
    // console.log(idArr);
    //构造sql
    const sqlStr= `delete from account where id in (${idArr})`;
    console.log(sqlStr);
    
    // 执行sql
    connection.query(sqlStr,(err, data ) =>{
        if (err) throw err;
        // 判断
        if ( data.affectedRows >0 ){
            res.send({code :0, reason:'批量删除成功'})
        }else{
            res.send({code :1, reason:'批量删除失败'})
        }
    })
    // res.send('111')
})


/* 检查旧密码验证 */
router.post('/passwordmodify', (req,res) =>{
    // 接收前端传过来的用户输入的旧密码
    let { oldPassword } = req.body;
    // console.log('旧密码',oldPassword);
    let { password } = req.user;
    // console.log('用户',req.user) //req.user 指的是当前登录账号的信息
    if( oldPassword === password ) {
        res.send({code: 0, reason: '原密码输入正确'})
    }else{
        res.send({code: 1, reason: '原密码输入错误'})
    }
    // res.send('哈哈哈')
})


/* 新密码修改 */
router.post('/editnewpassword', (req, res) =>{
    // res.send('哈哈哈哈')
    // 接收新密码
    let { newPassword } = req.body;
    // 获取当前登录用户的id  通过req.user
    let { id } = req.user;
    // console.log(req.user)

    // 存到数据库覆盖原密码
    // 构造sql
     const sqlStr = `update account set password='${newPassword}' where id=${id}`;
    // 执行sql
    connection.query(sqlStr,(err, data)  =>{
        if (err) throw err;
        // console.log(data);
        if ( data.affectedRows >0 ){
            res.send({ code:0 , reason:'密码修改成功，请重新登录'})
        }else{
            res.send({code: 1, reason: '密码修改失败！'})
        }
        
    })
})


/* 获取个人信息 */
router.get('/accountinfo',(req,res) =>{
    // 获取当前登录用户的id    因为怕修改之后不好维护等  最好不要直接把req.user响应回去
    const id = req.user.id;
    // 构造sql
    const sqlStr = `select * from account where id=${id}`
    // 执行sql
    connection.query(sqlStr,(err,data) =>{
        if (err) throw err;
        res.send(data)
    })

})


/* ——————————上传后端配置    开始*/

// 引入multer
const multer = require('multer')

// 配置上传到服务器放置的目录 和重命名
const storage = multer.diskStorage({
    // 图片上传到服务器的目录
    destination:'public/upload',
    // 图片重命名
    filename (req, file, cb) {
        var fileFormat =(file.originalname).split("."); // haha.jpg => ['haha', 'jpg']
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
})

/* 上传对象 */
const upload = multer({
    storage,
})

/* ——————————上传后端配置      结束*/

/* 头像上传 请求 */     //upload.single('file') 需要和前端的名字一致
router.post('/uploadavatar', upload.single('file'),( req, res) =>{
    // 接收数据   req.file 接收文件上传的
    // let file = req.file;
    // console.log(file);
    // 获取文件名
    let filename = req.file.filename;
    // 拼接路径
    let path = `/upload/${filename}`;
    // console.log('文件名',path);
    // 构造sql
    const sqlStr=`update account set avatar='${path}' where id=${req.user.id}`;
    // 执行
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        if(data.affectedRows>0){
            res.send({code:0, reason:'头像修改成功',path})
        }else{
            res.send({code:1, reason:'头像修改失败'})
        }
    })
    
    // res.send('1')
})


/* 用户角色：超级管理员/普通会员  */
router.get('/menus', (req, res) =>{
    //获取用户组信息
    let userGroup = req.user.user_group;
    // 三元运算
    let role = userGroup === '超级管理员' ? 'super' : 'normal';

    let menus = [
        // 系统管理
        {
            iconClass:'el-icon-document',
            title: '系统管理',
            roles:['super','normal'],
            // 二级导航
            children:[
                {path:'/home/systeminfo',subTitle:'系统信息'}
            ]
        },
        //  账号管理 
        {
            iconClass:'el-icon-news',
            title: '账号管理',
            roles:['super','normal'],
            // 二级导航
            children:[
                {path:'/home/accountmanage',subTitle:'账号管理'},
                {path:'/home/accountadd',subTitle:'账号添加'},
                {path:'/home/passwordmodify',subTitle:'密码修改'}
            ]
        },
        // 商品管理
        {
            iconClass:'el-icon-goods',
            title: '商品管理',
            roles:['super','normal'],
            // 二级导航
            children:[
                {path:'/home/goodsmanage',subTitle:'商品管理'},
                {path:'/home/goodsadd',subTitle:'商品添加'},
            ]
        },
        // 统计管理
        {
            iconClass:'el-icon-location',
            title: '统计管理',
            roles:['super'],
            // 二级导航
            children:[
                {path:'/home/salestotal',subTitle:'销售统计'},
                {path:'/home/stocktotal',subTitle:'进货统计'}
            ]
        }
    ]

    /* // 过滤菜单
    let accessMenu=[];
    // 遍历菜单 把roles中包含 当前登录用户角色的数据 添加进入一个新数组 那么 这个新数组 就是
    // 过滤之后的权限菜单
    menus.forEach(item =>{
        // console.log(item.roles)
        if( item.roles.includes(role)){
            accessMenu.push(item)
        }
    }) */


   
    // menus.filter(item =>item.roles.includes(role))

    // 功能和上面一样 把菜单数组中 包含当前登录用户角色的数据 过滤出来
    let accessMenu = menus.filter(item =>item.roles.includes(role))

    res.send({accessMenu})
})


// 暴露
module.exports = router;