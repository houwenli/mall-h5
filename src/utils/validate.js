// 验证密码
export function checkPassword(password) {
  let complex = 0;
  complex = /\d/.test(password) ? complex + 1 : complex;
  complex = /[a-zA-Z]/.test(password) ? complex + 1 : complex;
  complex = /[-`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]/.test(password) ? complex + 1 : complex;
  if (!password || complex < 2 || password.length < 6 || password.length > 20) {
    return {
      valid: false,
      msg: "密码长度需在6-20个字符之间,且包含字母、数字和符号两种及以上组合"
    } // 验证错误 返回valid:false;
  } else {
    return {
      valid: true
    } //验证正确  返回valid:true
  }
}


// 判断是否是手机号码
export function isMobilePhone(value) {
  return value && /^1(3|4|5|6|7|8|9)\d{9}$/.test(value);
}

// 判断是否是邮箱
export function isEmail(value) {
  return value && /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value);
}

// 判断是否是金钱
export function isMoney(value) {
  return value && /^([0-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,2})$/.test(value);
}


// 判断是否为空
export function isEmpty(value) {
  return !value || value.trim() == '';
}

// 中文校验器
export function chineseValidator(value) {
  if (isHasChinese(value)) {
    return {
      valid: false,
      msg: "物流单号不能含有中文"
    };
  } else {
    return {
      valid: true
    }
  }
}

// 判断是否含有中文
export function isHasChinese(value) {
  return /.*[\u4e00-\u9fa5]+.*$/.test(value);
}

// 固定电话校验器
export function telephoneValidator(value) {
  if (!isTelephone(value)) {
    return {
      valid: false,
      msg: "请填写正确的固定电话！"
    };
  } else {
    return {
      valid: true
    }
  }
}

// 判断是否是固定电话
export function isTelephone(value) {
  return value && /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(value);
}

// 邮编校验器
export function zipCodeValidator(value) {
  if (!isZipCode(value)) {
    return {
      valid: false,
      msg: "请填写正确的邮编！"
    };
  } else {
    return {
      valid: true
    }
  }
}

// 判断是否是邮编
export function isZipCode(value) {
  return value && /^[1-9][0-9]{5}$/.test(value);
}

// 判断是否为非负整数
export function isNumber(value) {
  return value && /^\d+$/.test(value);
}

// 互换数组中的两个元素
export function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}