export const defaultConfig = {
  bgColor: "",
  textColor: "#fff"
}

/**
 * 裁剪一级分类名称，最多4个字
 * @param {*} text
 * @param {*} max
 * @returns
 */
export const clipTagText =(text, max = 4)=> {
  return text.substring(0, max)
}