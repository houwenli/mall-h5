// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store/store'
import '@/styles/style.css' // 自定义 css
import infiniteScroll from 'vue-infinite-scroll'
import './utils/localstorage'

import statusHeight from '@/components/commons/statusHeight'
import Bridge from '@/utils/bridge'
// FastClick.attach(document.body)
import {
    ToastPlugin,
    ConfirmPlugin,
    AlertPlugin
} from 'vux'
import '@/permission' // permission controlmnv

import VueScroller from 'vue-scroller'

import VueAMap from 'vue-amap'

import http from '@/utils/request'
// import Vant from 'vant';
import 'vant/lib/index.css';
// 引入本地的字体图标
import 'vant/lib/icon/local.css';
// 外部图片链接统一域名
import {ossUrl,smartImg} from "./utils/config.js";
import callUp from './mixins/callUp'
Vue.mixin(callUp);

// Vue.use(Vant);
import {
    Tab,
    Tabs,
    Popup,
    Toast,
    Switch,
    Field,
    Cell,
    Button,
    NavBar,
    Icon,
    ShareSheet,
    CellGroup,
    Uploader,
    Rate,
    Swipe,
    SwipeItem,
    Tabbar,
    TabbarItem,
    List,
    Image as VanImage,
    Overlay,
    Popover,
    Card,
    PullRefresh,
    Dialog,
    ActionSheet,
    Search,
    NumberKeyboard,
    Loading
} from "vant";

Vue.use(Tab).use(Tabs);
Vue.use(Popup).use(ActionSheet);
Vue.use(Toast);
Vue.use(Field);
Vue.use(Switch);
Vue.use(Cell);
Vue.use(Button);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(ShareSheet);
Vue.use(CellGroup);
Vue.use(Uploader);
Vue.use(Rate);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(VanImage);
Vue.use(List);
Vue.use(Overlay);
Vue.use(Popover);
Vue.use(Card);
Vue.use(PullRefresh);
Vue.use(Dialog);
Vue.use(Search);
Vue.use(NumberKeyboard);
Vue.use(Loading);
//复制到粘贴板插件
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

// const src = "//cdn.jsdelivr.net/npm/eruda"
// document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>')
// document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>')

Vue.prototype.$http = http
Vue.prototype.$oss = ossUrl
Vue.prototype.$smartImg = smartImg
Vue.prototype.$bridge = Bridge;

Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)

Vue.use(VueScroller)

Vue.use(VueAMap)
// 初始化vue-amap
VueAMap.initAMapApiLoader({
    // 高德key
    key: process.env.GAODE_KEY,
    // 插件集合 （插件按需引入）
    plugin: [
        'AMap.Autocomplete',
        'AMap.PlaceSearch',
        'AMap.Scale',
        'AMap.OverView',
        'AMap.ToolBar',
        'AMap.MapType',
        'AMap.PolyEditor',
        'AMap.CircleEditor',
        'AMap.Geolocation',
        'AMap.Driving',
    ],
    v: '1.4.15', //  版本号
    uiVersion: '1.0.11', // UI组件库版本号
})

Vue.config.productionTip = false
Vue.use(infiniteScroll)

Vue.component('StatusHeight', statusHeight)
// 注册过滤器
import '@/utils/filters'

// if (process.env.NODE_ENV !== 'production') {
//     // eslint-disable-next-line no-undef,no-new
//     eruda.init()
// }

import filter from "@/utils/phoneSubstr";
// 全局导入过滤器
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]));

/* eslint-disable no-new */
export const app = new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app-box')
