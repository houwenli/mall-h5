import Vue from 'vue'
class Storage{
  constructor(){
    this.name = '_wsf_' + hashCode('_WSF_RECOMMEND_TOKEN')
    this.expires = 86400000 * 15 // ⼀天 86400000毫秒
  }

  //设置缓存
  setItem(params = {}){
    let shareCodeList = localStorage.getItem(this.name)
    // 如果没有取到数据
    if (!shareCodeList) {
      shareCodeList = {}
      shareCodeList.spuList = []
      shareCodeList.sign = ''
    }else {
      try{
        shareCodeList = JSON.parse(shareCodeList);
      }catch(error){
        //如果不⾏就不是json的字符串，就直接返回
      }
      // 如果哈希校验不对则代表数值被修改过,sign为哈希加密,确保唯⼀性
      if (hashCode(shareCodeList.spuList) !== shareCodeList.sign) {
        this.removeItem()
        return
      }
      shareCodeList.spuList = shareCodeList.spuList
    }
    let obj = {
      spuId: params.spuId, // 商品id
      recommendToken:params.recommendToken, // 分销码
      expiresTime: new Date().getTime() + this.expires, // 过期时间毫秒级
    }
    let options = {};
    //将obj和传进来的params合并
    Object.assign(options,obj)
    let {_obj,_objIdx} = getObjForId(shareCodeList.spuList,'spuId',options.spuId)
    // 如果数据存在 且 相同值 则跳过
    if (_objIdx >= 0 && _obj.recommendToken == options.recommendToken) {
      return
    }else {
      // 如果不存在 或 recommendToken值不同 则添加
      if (_objIdx < 0) {
        shareCodeList.spuList.push(options)
      }else {
        shareCodeList.spuList[_objIdx] = options
      }
    }
    // 存数据
    this.saveShareCodeList(shareCodeList)
  }

  //拿到缓存
  getItem(spuId){
    let shareCodeList = localStorage.getItem(this.name);
    // 先将拿到的试着进⾏json转为对象的形式
    try{
      shareCodeList = JSON.parse(shareCodeList)
    } catch (error){
      return false
    }
    if (!shareCodeList) return false
    shareCodeList.spuList = shareCodeList.spuList
    let {_obj,_objIdx} = getObjForId(shareCodeList.spuList,'spuId',spuId)
    // 有值
    // 不能取到相应的参数代表没有该值
    if (_objIdx < 0) {
      return false
    } else {
      let date = new Date().getTime();
      // 何时将值取出减去刚存⼊的时间，与_obj.expiresTime，如果⼤于就是过期了，如果⼩于或等于就还没过期
      if(date > _obj.expiresTime ){
        //缓存过期，清除缓存，返回false
        shareCodeList.spuList.splice(_objIdx,1)
        // 存取数据
        this.saveShareCodeList(shareCodeList)
        return false;
      }else{
        return _obj.recommendToken;
      }
    }
  }

  //移出缓存
  removeItem(data){
    let shareCodeList = localStorage.getItem(this.name);
    // 先将拿到的试着进⾏json转为对象的形式
    try{
      shareCodeList = JSON.parse(shareCodeList)
    } catch (error){
      return false
    }
    if (!shareCodeList) return false
    let arrN = shareCodeList.spuList
    shareCodeList.spuList.forEach( (item,i) => {
      if (item.spuId == data) {
        arrN.splice(i,1)
      }
    });
    shareCodeList.spuList = arrN
    // 存取数据
    this.saveShareCodeList(shareCodeList)
  }
  //移出全部缓存
  clear(){
    localStorage.clear();
  }

  clearOld(){
    window.localStorage.removeItem('_wsf_1612629729')
  }

  saveShareCodeList(shareCodeList) {
    let newShareCodeList = {
      sign:hashCode(shareCodeList.spuList),
      spuList: shareCodeList.spuList
    }
    window.localStorage.setItem(this.name,JSON.stringify(newShareCodeList))
  }

}

// 处理哈希 - 校验加密唯⼀性
function hashCode(str){
  str=str+"";
  let h = 0, off = 0;
  let len = str.length;
  for(let i = 0; i < len; i++){
    h = 31 * h + str.charCodeAt(off++);
    if(h>0x7fffffff || h<0x80000000){
      h=h & 0xffffffff;
    }
  }
  return h;
}
// 根据某个key获取这个key值相等的对象
function getObjForId(_arr,keyName,value) {
  const _tempArr = _arr.filter(el => {
    return el[keyName] == value
  })
  const _tempArrIdx = _arr.findIndex(el => {
    return el[keyName] == value
  })
  return {_obj: _tempArr.length > 0 ? _tempArr[0]: '', _objIdx: _tempArrIdx}
}

/** Todo 混淆加密结果 及 混淆解密结果 **/
Vue.prototype.$storage = new Storage()

// // 存值 如果重复则不存,如果不重复则会刷新
// this.$stroage.setItem({spuId: 11111,recommendToken: 'chenfeng'})
// // 取值 如果不存在会返回 false 如果存在会返回 recommendToken
// this.$stroage.getItem(11111) // chenfeng
