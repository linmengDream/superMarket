var express = require('express');
var router = express.Router();

// 引入数据库模块
const connection=require('./js/conn');

// 01.引入jwt
const jwt = require('jsonwebtoken')
// 02.准备一个签名 (秘钥)
// const secretKey = 'lemon';

/* // 测试通不通
router.get('/',(req,res) =>{
    res.send('哈哈哈')
})
 */

//跨域  指的是  3个地方不一致都会导致跨域的问题  协议 http： https:   端口：：8080  ：666   还有就是中间的地址？？
// 在后台响应之前  写一个路由统一设置响应头，all就是所有的路由就都不用再单独设置了   解决跨域的问题   404
router.all('*',(req,res,next) =>{
    // 设置响应头 解决跨域   接收从前台 这个地址传来的信息    后面一个参数还可以是*，就是所有的地址都可以
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许通过头部信息authorization 携带token
    
    // res.send('如果不写next（），则发回前台的是这句话，而后面的真正响应的信息 111就被拦截了，无法返回去')
    // 放行
    next()
})


/* --------------------  验证token合法性开始  ---------------- */ 
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




 /* 接收 checklogin  检查用户名和密码是否正确*/
 router.post('/checklogin',(req,res) =>{
    //  接收参数
     let {account,password} = req.body;

    //  构造sql
    const sqlStr =`select * from account where account='${account}' and password='${password}'`;
    // console.log(sqlStr);
    
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        //  console.log(data);   //数组
        // 判断
        if( data.length>0){
            // console.log(data)  data是一个数组里面有一个对象，用data[0]获取对象 
            //   data[0]不是一个普通的对象  而是RowDataPacket~ 需用浅拷贝赋给一个新的对象
            // 3. jwt生成token 登录成功才给token  把token和数据一起响应给前端
            // const token = jwt.sign( 要加密的数据对象, secretKey, { expiresIn:  60*60*2 } )
            
            // const token = jwt.sign(data[0],secretKey,{ expiresIn: 60*60*2})
            const token = jwt.sign(Object.assign({},data[0]),secretKey,{ expiresIn: 60*60*2})
            
            // console.log(token);
            
            res.send({ code:0 , reason:'登录成功',token})
        }else{
            res.send({ code:1 , reason:'登录失败,请检查账号或密码'})            
        } 
    })
    // res.send('哈哈')
     
 })


// 获取当前登录用户名
router.get('/currentaccount', (req,res) =>{
    // console.log(req.user)
    // res.send('你好')
    // 响应当前登录的账号名给前端 （使用express-jwt验证token合法后 会把token的值 存入 req.user 其实就是当前登录账号数据对象）
    res.send(req.user.account)
})


module.exports = router;