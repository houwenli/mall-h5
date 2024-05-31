import axios from 'axios'
import {
  Toast
} from 'vant' //引入Toast
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/token'

function upLoaderImg(file) { //file为 你读取成功的回调文件信息
  //new 一个FormData格式的参数
  let params = new FormData()
  params.append('image', file)
  let config = {
    headers: { //添加请求头
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + getToken()
    }
  }
  return new Promise((resolve, reject) => {
    //把 uploadUrl 换成自己的 上传路径
    axios.post(process.env.UPLOAD_API, params, config).then(res => {
      // console.log(res,'图片');
      if (res.data && res.data.code == 200) { //如果为真 resolve出去
        resolve(res.data)
      } else {
        //否则 Toast 提示
        Toast(res.data.description)
		reject(res.data)
      }
    }).catch(err => {
      Toast('系统异常')
      reject(err)
    })
  })
}
export default upLoaderImg
