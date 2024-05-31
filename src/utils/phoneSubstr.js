// 手机号码中间隐藏
const phoneSubstr = val => {
  if(val) {
    return val.substr(0,3) + '****' + val.substr(7);
  }
}

export default {
  phoneSubstr
};
