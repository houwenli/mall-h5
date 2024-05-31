

/*
 * 右补齐字符串
 * @param num 要处理的值
 * @param nSize 要补齐的长度
 * @param ch 要补齐的字符
 */
export const padRight = function(num = '', nSize = 0, ch = '0') {
    let len = 0
    let s = num + ''
    len = s.length
    while (len < nSize) {
      s = s + ch
      len++
    }
    return s
}

/*
 * 右移小数点位置 （用于数学计算，相当于除以Math.pow(10,scale)
 * @param num 要处理的值
 * @param scale 要移位的刻度
 * @return
 */
export const movePointRight = function(num = '', scale = 0) {
    // let s, s1, s2, ch, ps
    if (num === 0) return num
    let s = num + '' || ''
    let ch = '.'
    if (scale <= 0) {
      return s
    }
  
    let ps = s.split('.')
    let s1 = ps[0] || ''
    let s2 = ps[1] || ''
  
    if (s2.length <= scale) {
      ch = ''
      s2 = padRight(s2, scale)
    }

    let decimal = s2.slice(0, scale) + ch + s2.slice(scale, s2.length)
    let integer = s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length)

    return num >= 1 ? integer : decimal
}
