export const defaultCubeImageConfig = (style) => {
  return {
    title: '',
    text: '',
    style,
    styleText: `风格${style}`,

    // 不同风格的不同的容器
    styleImages: {
      // 有滑动的图片
      slideshowImageList: [],
      // 其他单张图片， 一次从list中取
      imgList: []
    },
    // 1 背景色 2 背景图片
    radio: 1,
    bgColor: "",
    bgImage: "",
    hasBackground: "",
    showComTitle: "",
    comTitle: ""
  }
}