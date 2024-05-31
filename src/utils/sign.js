const fun_aes = require('./AES')

export const encrypt = function (str,ivStr, keyStr) {
  let timeStamp = Date.now()
  let srcs = fun_aes.CryptoJS.enc.Utf8.parse(str)
  let key = fun_aes.CryptoJS.enc.Utf8.parse(keyStr ? keyStr : 'Gbc*%fghijklmn12')
  let iv = fun_aes.CryptoJS.enc.Utf8.parse(ivStr ? ivStr : `wsf${timeStamp}`)
  let encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: fun_aes.CryptoJS.mode.CBC,
    padding: fun_aes.CryptoJS.pad.Pkcs7
  });
  return {encryptStr: encrypted.ciphertext.toString(fun_aes.CryptoJS.enc.Base64),timeStamp};
}

//解密
// export const decrypt = function(word, keyStr, ivStr) {
//   let key = fun_aes.CryptoJS.enc.Utf8.parse(keyStr ? keyStr : 'Gbc*%fghijklmn12')
//   let iv = fun_aes.CryptoJS.enc.Utf8.parse(ivStr ? ivStr : '@bc$%fghijklmn12')
//   let decrypt = fun_aes.CryptoJS.AES.decrypt(word, key, {iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7})
//   return fun_aes.CryptoJS.enc.Utf8.stringify(decrypt).toString()
// }


export default {
  // 加密对象
  sign(data) {
    if (data.password){
      let {encryptStr,timeStamp} = encrypt(data.password)
      data.password = encryptStr
      data.timeStamp = timeStamp
    }
    return data
  }

}
