/**
 * touch移动触发，每次只能移动一个
 * 每个元素宽度都一样，不然不好做
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
        scale: 1 / 2,
        speed: 0.2
    },
    loop: { // 是否循环轮播
        use: false,
        showNum: 1,
    }
}

export default class Carousel {
    // 参数 父容器id，子元素class，配置项
    constructor(containerNode, sonNodeList, option = {}) {
        this.initIndex = option.initIndex || defaults.initIndex;
        this.autoplay = Object.assign({}, defaults.autoplay, option.autoplay);
        this.slide = Object.assign({}, defaults.slide, option.slide);
        this.loop = Object.assign({}, defaults.loop, option.loop);

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

        let everyOffset = [];
        // 总长度
        let allLength = sonNodeWidths.reduce((preValue, curValue) => preValue + curValue, 0);
        sonNodeWidths.forEach((item, index) => {
            let elWidths = sonNodeWidths.slice(0, index);

            let currentLength = elWidths.reduce((preValue, curValue) => preValue + curValue, 0)

            everyOffset.push(currentLength)
            
        });

        // 逻辑属性，挂载到this上
        this.carouselObj = {
            containerNode, // 容器
            containerWidth, // 容器宽度
            sonNodeList, // 子元素列表
            sonNodeWidths, // 元素长度集合,
            allLength, // 总长度
            everyOffset, // 每个元素偏移量
        }

        // 如果是循环轮播，要给初始位置
        if (this.loop.use) {
            this.initIndex = this.loop.showNum
            containerNode.style.transform = `translateX(${everyOffset[this.initIndex] * -1}px)`
        } else {
            containerNode.style.transform =  `translateX(0px)`
        }
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
            allLength, // 总长度
            everyOffset, // 每个元素偏移量
        } = this.carouselObj;
        
        watchTouch.init(containerNode, {
            delay: 0,
            start () {
                containerNode.style.transitionDuration = '0ms'
            },
            move (info) {
                let initIndex = that.initIndex;
                // 获取单个元素宽度
                let itemWidth = sonNodeWidths[0]

                let move = info.disX / containerWidth * itemWidth

                let total = everyOffset[initIndex] * -1 + move;

                containerNode.style.transform =  `translateX(${total}px)`;
            },
            end (info) {
                let initIndex = that.initIndex;
                containerNode.style.transitionDuration = '300ms';
                // 判断是否需要移动index
                // 获取单个元素宽度
                let itemWidth = sonNodeWidths[0]
                let move = info.disX / containerWidth * itemWidth
                let total = everyOffset[initIndex] * -1 + move;
                let absTotal = Math.abs(total);

                let scale = Math.abs(info.disX) / containerWidth
                let speed = Math.abs(info.speedX)

                if (scale >= that.slide.scale || speed >= that.slide.speed) {
                    that.change(info.disX < 0, touchEffect)
                } else {
                    containerNode.style.transform = `translateX(${everyOffset[that.initIndex] * -1}px)`
                    // 滚动之后加上特殊处理
                    touchEffect && touchEffect(that.initIndex)
                }
                
            }
        })
    }
    // 触发翻页，判断是否需要调整位置
    change(isNext, touchEffect) {
        const {
            containerNode, // 容器
            containerWidth, // 容器宽度
            sonNodeList, // 子元素列表
            sonNodeWidths, // 元素长度集合
            everyOffset, // 每个元素偏移量
        } = this.carouselObj;

        this.initIndex += isNext ? 1 : -1

        let last = sonNodeWidths.length - this.loop.showNum;

        let isNextContinue = isNext && (this.initIndex === last);
        let isPrevContinue = !isNext && (this.initIndex === 0);

        containerNode.style.transitionDuration = '300ms'
        containerNode.style.transform = `translateX(${everyOffset[this.initIndex] * -1}px)`
        touchEffect && touchEffect(this.initIndex)

        if (isNextContinue || isPrevContinue) {
            console.log('到占位图了')
            // 滑到占位图
            this.initIndex = isNextContinue ? this.loop.showNum : last - this.loop.showNum

            setTimeout(() => {
                touchEffect && touchEffect(this.initIndex)
                containerNode.style.transitionDuration = '0ms'
                containerNode.style.transform = `translateX(${everyOffset[this.initIndex] * -1}px)`
            }, 300)
        }
    }
}