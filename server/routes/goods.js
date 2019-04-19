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
    res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许通过头部信息authorization 携带token
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

/* 添加商品 */
router.post('/goodsadd', (req,res) =>{
    
    // 接收参数
    let {goodsClass,goodsBarcode,goodsName,goodsPrice,marketPrice,stockNumber} = req.body;

    
    // 同时存入数据库
    // 构造sql
    const sqlStr = `insert into goods(goods_class,goods_barcode,goods_name,goods_price,market_price,stock_number) values('${goodsClass}','${goodsBarcode}','${goodsName}','${goodsPrice}','${marketPrice}','${stockNumber}')`
    // console.log(sqlStr);
    
    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        // console.log(data);
        // 判断
        if (data.affectedRows >0){
            // 成功
            res.send({ code:0 , reason:'商品添加成功'})
        }else{
            res.send({ code:0 , reason:'商品添加成功'})    
        }
                
    })
    //  res.send("hahhaha")
})


/* 商品列表查询   */
/* router.get('/goodslist', (req, res) =>{
    // 构造sql
    const sqlStr = `select * from goods order by id desc`
    // console.log(sqlStr);

    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        // console.log(data);
        res.send(data)
        
    })
    
    // res.send('11111')
}) */


/* 分页商品列表查询    与查询整合之前*/
/* router.get('/getgoodslistbypage',(req,res) =>{
    // res.send('heheh')
    // 接收参数
    let {currentPage, pageSize} = req.query;
    // 构造sql
    let sqlStr = `select * from goods order by id decs`; 


    // 执行sql
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        // console.log(data);
        // res.send(data)

        // 1.获取总条数
        let total = data.length;  

        // 2. 构造分页sql 根据前端给的当前页 和  每页显示的条数  拼接计算  当前页显示的数据
        // 当前显示的数据 即：跳过多少条(n条) ，每页多少条
        let n =(currentPage - 1) * pageSize;
        sqlStr += ` limit ${n}, ${pageSize}`;

        // console.log(sqlStr)

        // 执行sql
        connection.query(sqlStr, (err, data) =>{
            if (err) throw err;
            // 把数据总条数和每个页码对应的数据发送给前端
            res.send({total,data})
        })
        
    })
}) */


/* 分页商品列表查询   与查询整合之后*/
router.get('/getgoodslistbypage',(req,res) =>{
    // res.send('heheh')
    // 接收参数
    let {currentPage, pageSize, goodsClass, keyword} = req.query;
    // 构造sql
    let sqlStr = `select * from goods where 1=1`; 

    // 拼接查询条件
    // 如果goodclass为空或者全部，代表查询所有分类，否则就是按照分类查询
    if( goodsClass !=='' && goodsClass !== '全部'){
        sqlStr += ` and goods_class='${goodsClass}'`;
    }
    
    
    // 如果keyword为空，代表所有名称或者条形码，否则就是查询 名称和条形码（包含有关键字的）
    if( keyword !== ''){  //注意 and前面要加空格
        // %${}%  为 like……的语法
        sqlStr += ` and(goods_name like '%${keyword}%' or goods_barcode like '%${keyword}%')`
    }

    // 拼接排序
    sqlStr += ` order by id desc`
    // 执行sql  按照查询条件 查询数据
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        // console.log(data);
        // res.send(data)

        // 1.获取查询后的总条数
        let total = data.length;  //这里是通过查询条件查询后的total条数


        // 2. 构造分页sql 根据前端给的当前页 和  每页显示的条数  拼接计算  当前页显示的数据
        // 当前显示的数据 即：跳过多少条(n条) ，每页多少条
        let n =(currentPage - 1) * pageSize;
        sqlStr += ` limit ${n}, ${pageSize}`;

        // console.log(sqlStr)

        // 执行sql
        connection.query(sqlStr, (err, data) =>{
            if (err) throw err;
            // 把数据总条数和每个页码对应的数据发送给前端
            res.send({total,data})
        })
        
    })
})

/* 单个删除 */
router.get('/goodsdelete', (req,res) =>{
    // res.send('哈哈哈')
    // 接收id
    let {id} = req.query;

    // 构造sql
    const sqlStr = `delete from goods where id=${id}`

    // 执行sql
    connection.query(sqlStr,(err,data)  =>{
        if (err) throw err;
        // console.log(data);
        // judge
        if (data.affectedRows >0){
            res.send({ code: 0, reason:'删除成功了哈'});
        }else{
            res.send({ code: 1, reason:'删除失败了哟'});
        }
    })
})


//* 批量删除 */
router.get('/batchdel', (req,res) =>{
    // res.send('哈啊哈')
    // 接收参数
    let {idArray} = req.query;
    // 构造
    const sqlStr = `delete from goods where id in (${idArray})`
    // 执行
    connection.query(sqlStr, (err,data) =>{
        if (err) throw err;
        // judge
        if (data.affectedRows >0){
            res.send({ code: 0, reason:'批量删除成功了哈'});
        }else{
            res.send({ code: 1, reason:'批量删除失败了哟'});
        }
    })

})

/* 单个修改 */
router.get('/goodsedit', (req,res) =>{
    // res.send('哈啊哈')
    // 接收参数
    let {id} = req.query;
    // construct
    const sqlStr = `select * from goods where id=${id}`
    // xie
    connection.query(sqlStr, (err, data) =>{
        if (err) throw err;
        res.send(data)
    })
})



/* 模态框修改 */
router.post('/saveeditgoods', (req, res) =>{
    // res.send('haajhl')
    // 接收参数
    let {goodsName,goodsPrice,goodsClass,editId} = req.body;
    // 构造
    const sqlStr = `update goods set goods_name='${goodsName}',goods_price='${goodsPrice}',goods_class='${goodsClass}' where id=${editId}`;
    // xie
    connection.query(sqlStr,(err, data) =>{
        if (err) throw err;
        // 判断成功
        if( data.affectedRows >0 ){
            res.send({code:0, reason:'修改账号成功'})
        }else{
            res.send({code:1, reason:'修改账号失败'})
        }
    })
})


/* 商品查询    模糊查询 */

/* router.get('/search', (req, res) =>{
   
    // 接收参数
    let { goodsClass,keyword } = req.query;

    // console.log('哈哈',goodsClass,keyword)
    // 构造sql  where 1=1  (为true，永远成立 ) 是为了之后的拼接
    // 之后要拼接 就用let
    let sqlStr = `select * from goods where 1=1`

    // 如果goodclass为空或者全部，代表查询所有分类，否则就是按照分类查询
    if( goodsClass !=='' && goodsClass !== '全部'){
        sqlStr += ` and goods_class='${goodsClass}'`;
    }
    
    
    // 如果keyword为空，代表所有名称或者条形码，否则就是查询 名称和条形码（包含有关键字的）
    if( keyword !== ''){  //注意 and前面要加空格
        // %${}%  为 like……的语法
        sqlStr += ` and(goods_name like '%${keyword}%' or goods_barcode like '%${keyword}%')`
    }
    console.log(sqlStr);
    // 执行sql
    connection.query(sqlStr, ( err, data) =>{
        if(err) throw err;
        res.send(data)
    })
    // res.send('哈哈哈')
})
 */
module.exports = router;
