// 对axios进行封装

// 1.引入axios
import axios from 'axios'
// // 引入qs
import qs from 'qs'

// console.log(axios);
// 引入local
import local from '@/utils/local'

// 设置请求的服务器根目录 根目录地址   要请求的后端服务器的这个地址  
axios.defaults.baseURL = 'http://127.0.0.1:666';


// axios请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    const token = local.get('Mango');
    config.headers.authorization = `Bearer ${token}` 
    return config;
})



// 导出请求对象
export default{
    get(url,params = {}){
        return new Promise((resolve,reject) =>{
            axios.get(url,{params})   //这里的params只是为了更方便，取一样的名字
            .then(response =>{
                resolve(response.data)  //成功使用resolve处理
            })
            .catch(err =>{
                reject(err)  //失败使用reject处理
            })
        })
    },
    post(url,params={}){
        return new Promise((resolve,reject) =>{
            axios.post(url,qs.stringify(params))
            .then(response =>{
                resolve(response.data)  //成功使用resolve处理
            })
            .catch(err =>{
                reject(err)   // 失败使用reject处理
            })
        })
    }
}