<template>
  <div class="goods-add">
    <!-- 主面板 -->
    <el-card class="box-card">
        <!-- 主面板头 -->
        <div slot="header" class="clearfix">
            <span>添加商品</span>
        </div>
        <!-- 主面板内容   表单验证-->
        <div class="text item">
            <el-form :model="GoodsAddForm" :rules="rules" ref="GoodsAddForm" label-width="100px" class="demo-ruleForm">
                
                <!-- 所属分类 -->
                <el-form-item label="所属分类" prop="goodsClass">
                    <el-select v-model="GoodsAddForm.goodsClass" placeholder="-----------选择分类----------" style="font-weight:bold">
                        <el-option label="生活用品" value="日常用品"></el-option>
                        <el-option label="个人用品" value="个人用品"></el-option>
                        <el-option label="厨房用品" value="厨房用品"></el-option>
                        <el-option label="家居用品" value="家居用品"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 商品条形码 -->
                <el-row :gutter="20">
                    <el-form-item label="商品条形码" prop="goodsBarcode" >
                        <el-col :span="6"><el-input v-model="GoodsAddForm.goodsBarcode"></el-input></el-col>
                        <el-col :span="18"><el-button type="primary" plain @click="barcodeCreate">生成条形码</el-button></el-col>
                        <!-- <el-col :span="18"><el-button type="primary" plain>生成条形码</el-button></el-col> -->
                    </el-form-item>
                </el-row>

                <!-- 商品名称 -->
                <el-form-item label="商品名称" prop="goodsName" style="width:360px">
                    <el-input v-model="GoodsAddForm.goodsName"></el-input>
                </el-form-item>

                <!-- 商品售价 -->
                <el-form-item label="商品售价" prop="goodsPrice" style="width:360px">
                    <el-input v-model="GoodsAddForm.goodsPrice"></el-input>
                    <!-- <span>元</span> -->
                </el-form-item>

                <!-- 市场价 -->
                <el-form-item label="市场价" prop="marketPrice" style="width:360px">
                    <el-input v-model="GoodsAddForm.marketPrice"></el-input>
                </el-form-item>

                <!-- 库存数量 -->
                <el-form-item label="库存数量" prop="stockNumber" style="width:360px">
                    <el-input v-model="GoodsAddForm.stockNumber"></el-input>
                </el-form-item>


                <!-- 会员优惠 -->
                <el-form-item label="会员优惠" prop="memberDiscount">
                    <el-radio-group v-model="GoodsAddForm.memberDiscount">
                        <el-radio  label="享受"></el-radio>
                        <el-radio  label="不享受"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <!--  是否促销 -->
                <el-form-item label="是否促销" prop="goodsPromotion">
                    <el-radio-group v-model="GoodsAddForm.goodsPromotion">
                        <el-radio label="启用"></el-radio>
                        <el-radio label="禁用"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 商品简介 -->
                <el-form-item label="商品简介" prop="goodsDescription" style="width:600px">
                    <el-input type="textarea" v-model="GoodsAddForm.goodsDescription"></el-input>
                    <span>不超过200个汉字</span>
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">添加</el-button>
                    <el-button type="info" @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        // 数字类型的验证 自定义
        const numberTypeCheck = (rule, value, callback) =>{
            if(value === ''){
                callback(new Error('验证码不能为空'))
            }else if(!parseInt(value)){
                callback(new Error('请输入数字'))
            }else{
                callback()
            }
        }
        return{
            // 商品添加 表单数据
            GoodsAddForm:{
                goodsClass:'',
                goodsBarcode:'',
                goodsName:'',
                goodsPrice:'',
                marketPrice:'',
                stockNumber:'',
                memberDiscount:'享受',
                goodsPromotion:'禁用',
                goodsDescription:''
            },
            // 验证规则
            rules:{
                // 产品分类
                goodsClass:[
                    {required:true, message:"请选择产品分类", trigger:'change'}
                ],
                // 产品条形码
                goodsBarcode:[
                    {required:true, message:"请生成产品条形码",trigger:'change'},
                    {required:true, validator:numberTypeCheck,trigger:'blur'}
                ],
                // 产品名称
                goodsName:[
                    {required:true, message:'请输入商品名称，不能为空',trigger:'blur'},
                    {min:2,max:8,message:'长度在 2 到 8 个字符',trigger:'blur'}
                ],
                // 产品价格
                goodsPrice:[
                    {required:true,validator:numberTypeCheck,trigger:'blur'}
                ],
                // 市场价
                marketPrice:[
                    {required:true,validator:numberTypeCheck,trigger:'blur'}
                ],
                stockNumber:[
                    {required:true,validator:numberTypeCheck,trigger:'blur'}
                ],
                // // 会员优惠
                // memberDiscount:[
                //     {required:true,message:'请选择是否允许会员享受优惠', trigger:'change'}
                // ],

                // 是否促销
                // goodsPromotion:[
                //     {required:true,message:'请选择是否进行促销', trigger:'change'}
                // ],

                // 商品简介
                goodsDescription:[
                    {min:1,max:200,message:'不超过200个汉字',trigger:'blur'}
                ]
            }
        }
    },
    methods:{
        // 添加商品
        submitForm(){
            // 如果所有都满足，则提交
            this.$refs.GoodsAddForm.validate(valid =>{
                if(valid){
                    let params={
                        goodsClass:this.GoodsAddForm.goodsClass,
                        goodsBarcode:this.GoodsAddForm.goodsBarcode,
                        goodsName:this.GoodsAddForm.goodsName,
                        goodsPrice:this.GoodsAddForm.goodsPrice,
                        marketPrice:this.GoodsAddForm.marketPrice,
                        stockNumber:this.GoodsAddForm.stockNumber,
                        // goodsPromotion:this.GoodsAddForm.goodsPromotion,  
                    }
                    // console.log(params)


                    // 发送请求
                    this.request.post('/goods/goodsadd',params)
                    .then( res =>{
                        // console.log(res);
                        // 接收后端数据
                        let { code, reason} = res;
                        // 判断
                        if( code === 0){
                            // 弹成功提示
                            this.$message({
                                type:'success',
                                message:reason
                            })
                            // 跳转页面
                            this.$router.push('/home/goodsmanage')
                        }else if( code === 1){
                            this.$message.error(reason)
                        }
                        
                    })
                    .catch( err =>{
                        console.log(err);
                        
                    })



                    // alert("商品添加成功！")
                }else{
                    console.log('产品信息错误或者不完整，添加失败')
                    return
                }
            })
        },
        // 重置
        resetForm(){
            this.$refs.GoodsAddForm.resetFields()
        },
        // 条形码生成
        barcodeCreate(){
            // let barcodeArr=[0,1,2,3,4,5,6,7,8,9];
            // let barcodeString="";
            // for(var i=0; i<13; i++){
            //     let index=Math.floor(Math.random()*10);
            //     barcodeString += barcodeArr[index];
            // }
            let barcodeString=Math.floor(Math.random()*10000000000000)
            this.GoodsAddForm.goodsBarcode = barcodeString;
        }
    }
};
</script>

<style lang="less">
    @import "./goodsadd.less";
</style>


