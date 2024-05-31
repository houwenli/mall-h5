/**
 * touch移动触发，每次不止移动一个
 */

import WatchTouch from './touchSlide'
const watchTouch = new WatchTouch()

const defaults = {
    initIndex: 0,
    autoplay: {
        use: true,
        delay: 3000
    },
    slide: {
        use: true,
    }
}

export default class Carousel {
    // 参数 父容器id，子元素class，配置项
    constructor(containerNode, sonNodeList, option = {}) {

        this.initIndex = option.initIndex || defaults.initIndex;
        this.autoplay = Object.assign({}, defaults.autoplay, option.autoplay);
        this.slide = Object.assign({}, defaults.slide, option.slide);

        // 初始化
        this.carouselInit(containerNode, sonNodeList)
    }

    // 初始化
    carouselInit(containerNode, sonNodeList) {
        // 获取容器宽度
        let containerWidth = parseFloat(window.getComputedStyle(containerNode).width.split('px')[0]);

        // 获取元素长度集合
        let sonNodeWidths = []
        // 遍历获取每个一级菜单的宽度
        for(let item of sonNodeList) {
            // 获取单个元素属性
            let sonNode = window.getComputedStyle(item);
            // 动态获取元素的margin距离
            let sonNodeRight = parseFloat(sonNode.marginRight.split('px')[0]) || 0;
            let sonNodeLeft = parseFloat(sonNode.marginLeft.split('px')[0]) || 0;
            let sonNodeWidth = parseFloat(sonNode.width.split('px')[0]) || 0;
            sonNodeWidth = sonNodeWidth + sonNodeRight + sonNodeLeft;
            sonNodeWidths.push(sonNodeWidth.toFixed(4) * 1)
        }

        // 逻辑属性，挂载到this上
        this.carouselObj = {
            containerNode, // 容器
            containerWidth, // 容器宽度
            sonNodeList, // 子元素列表
            sonNodeWidths, // 元素长度集合
        }

        // 初始化位置
        containerNode.style.transform =  `translateX(0px)`
        // 手动清除轮播事件
        watchTouch.removeListener()
    }

    // 监听滑动
    carouselTouchListen(touchEffect) {
        let that = this;
        const {
            containerNode, // 容器
            containerWidth, // 容器宽度
            sonNodeList, // 子元素列表
            sonNodeWidths, // 元素长度集合
        } = this.carouselObj;

        // 获取每个元素到第一个位置时的偏移量，因为需要显示三个元素，所以右边倒数第三个之后偏移量不变
        let everyOffset = [];
        // 总长度
        let allLength = sonNodeWidths.reduce((preValue, curValue) => preValue + curValue, 0);
        sonNodeWidths.forEach((item, index) => {
            let carouselLength = sonNodeWidths.length;
            let elWidths = sonNodeWidths.slice(0, index);

            let currentLength = elWidths.reduce((preValue, curValue) => preValue + curValue, 0)

            // 如果总长度-当前宽度 < 容器宽度 说明到底了，取前面的
            if (allLength - currentLength < containerWidth) {
                everyOffset.push(everyOffset[everyOffset.length - 1])
            } else {
                everyOffset.push(currentLength)
            }
            
        });
        watchTouch.init(containerNode, {
            delay: 0,
            start () {
                containerNode.style.transitionDuration = '0ms'
            },
            move (info) {
                let initIndex = that.initIndex;
                let move = info.disX;
                let total = everyOffset[initIndex] * -1 + move;

                containerNode.style.transform =  `translateX(${total}px)`;
            },
            end (info) {
                let initIndex = that.initIndex;
                containerNode.style.transitionDuration = '300ms';
                // 判断是否需要移动index
                let move = info.disX;
                let total = everyOffset[initIndex] * -1 + move;
                let absTotal = Math.abs(total);

                let findIndex = 0;

                // 往左
                if (total > 0) {
                    findIndex = 0
                }
                // 往右，如果滑动超过限制就取最大偏移量的那个index
                else if (allLength - absTotal < containerWidth) {
                    let flag = {}
                    let max = 0
                    everyOffset.forEach((item, index) => {
                        if(item > max) {
                            max = item
                            if (!flag[max]) {
                                flag[max] = index
                            }
                        }
                    })
                    findIndex = flag[max]
                } else {
                    everyOffset.some((item, index) => {
                        let absTotal = Math.abs(total);
                        if (absTotal >= item && absTotal < everyOffset[index + 1]) {
                            if (move > 0) {
                                findIndex = index + 1
                            } else {
                                findIndex = index
                            }
                            return true
                        }
                    })
                }

                that.initIndex = findIndex;
                
                containerNode.style.transform = `translateX(${everyOffset[that.initIndex] * -1}px)`

                // 滚动之后加上特殊处理
                touchEffect && touchEffect(findIndex)
                
            }
        })
    }
}