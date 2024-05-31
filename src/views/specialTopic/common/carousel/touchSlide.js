/**
 * 监听滑动
 */

// 截流
function throttle (fn, delay = 100) {
    let wait = false
  
    return function () {
        if (!wait) {
            fn && fn.apply(this, arguments)
            wait = true
    
            setTimeout(() => {
            wait = false
            }, delay)
        }
    }
}
  
/**
 *
 * 滑动
 *   start, // 滑动开始
 *      参数: pageX, pageY
 *   move, // 滑动中，会不断地触发，可以通过截流来限制触发频率
 *      参数:
             time, // 总时间:ms
            disX, // 总路程:px
            disY,
            addX, // 路程增量:px
            addY,
            speedX: disX / time, // 平均速度:px/ms
            speedY: disY / time
*   end, // 滑动结束，参数同move
* }
*/

export default class WatchTouch {
    constructor () {
        // 先将bind(this)后的function保存起来
        this.touchstartFn = this.touchstartFn.bind(this)
        this.touchmoveFn = this.touchmoveFn.bind(this)
        this.touchendFn = this.touchendFn.bind(this)
    }
    init (node, {
        delay = 100,
        start,
        move,
        end
    }) {
        // 传入参数
        if (!node) return
        this.node = node
        this.delay = delay;
        this.start = start;
        this.move = move;
        this.end = end;

        // 辅助变量
        this.sTouch = null;
        this.eTouch = null;
        this.sTime = ''

        // 先清掉之前绑定事件,再重新绑定事件
        this.removeListener()
        this.addListener()
    }

    addListener () {

        this.node.addEventListener('touchstart', this.touchstartFn, false)
    
        this.node.addEventListener('touchmove', this.touchmoveFn, false)
    
        this.node.addEventListener('touchend', this.touchendFn, false)
    }

    removeListener () {
        if(this.node) {
            this.node.removeEventListener('touchstart', this.touchstartFn)
    
            this.node.removeEventListener('touchmove', this.touchmoveFn)
        
            this.node.removeEventListener('touchend', this.touchendFn)
        }
    }

    touchstartFn (e) {
        this.sTime = e.timeStamp
        this.sTouch = this.eTouch = e.targetTouches[0]

        this.start && this.start({
            pageX: this.sTouch.pageX,
            pageY: this.sTouch.pageY
        })
    }

    touchmoveFn (e) {
        let touch = e.targetTouches[0]
        let time = e.timeStamp - this.sTime
        let disX = touch.pageX - this.sTouch.pageX
        let disY = touch.pageY - this.sTouch.pageY
        let addX = touch.pageX - this.eTouch.pageX
        let addY = touch.pageY - this.eTouch.pageY

        this.move && this.move({
            time, // 总时间:ms
            disX, // 总路程:px
            disY,
            addX, // 路程增量:px
            addY,
            speedX: disX / time, // 平均速度:px/ms
            speedY: disY / time
        })

        // 记录上一次touch
        this.eTouch = touch
    }

    touchendFn (e) {
        let touch = e.changedTouches[0]
        let time = e.timeStamp - this.sTime
        let disX = touch.pageX - this.sTouch.pageX
        let disY = touch.pageY - this.sTouch.pageY
        let addX = touch.pageX - this.eTouch.pageX
        let addY = touch.pageY - this.eTouch.pageY

        this.end && this.end({
            time,
            disX,
            disY,
            addX,
            addY,
            speedX: disX / time,
            speedY: disY / time
        })
    }

}