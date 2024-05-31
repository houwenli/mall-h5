<template>
  <div>

    <!-- <x-header title="门店详情" :left-options="{backText: ''}">
      <div slot="right" @click="toCart" class="header-cart-icon" style="top: -16px; right: -16px">
        <badge v-if="carNum!=0" :text="carNum" style="position: absolute; right: -4px"></badge>
      </div>
    </x-header> -->

    <div class="store_box">
      <div class="store_img"><img :src="storeInfo.avatarPicture"></div>
      <h1>{{storeInfo.storeName}}</h1>
      <rater style="margin-top: 5px" v-model="storeInfo.aveScore"
             star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
             active-color="#f23030" :min="1" disabled></rater>
    </div>

    <group>
      <cell is-link @click.native="toRouteNavigation">
        <div slot="title">
          <div class="address-icon-wrap">{{storeInfo.companyAddress}}</div>
        </div>
      </cell>
    </group>

    <group style="margin-top: 10px">
      <cell title="门店信息"></cell>
      <cell>
        <div slot="title">联系电话：{{storeInfo.contactPhone}}</div>
      </cell>
      <cell>
        <div slot="title">营业时间：{{storeInfo.businessTime}}</div>
      </cell>
      <cell>
        <div slot="title">公交线路：{{storeInfo.busRoutes}}</div>
      </cell>
    </group>

    <section class="actionbar">
      <div class="action-list">
        <a class="item addtocart" @click="specShowFlag = true">预约到店</a>
        <a class="item buy" @click="specShowFlag = true">加入购物车</a>
      </div>
    </section>

    <!--规格弹窗-->
    <popup v-model="specShowFlag" height="60%" position="bottom"
           style="background: #fff; padding: .6rem 0; overflow: initial">
      <div class="spec-menu-top">
        <div class="spec-first-pic">
          <img :src="storeSpu.images?storeSpu.images[0]:''">
        </div>
        <div class="spec-weight">{{ storeSpu.name }}</div>
        <div class="spec-price">¥{{storeSpu.price?storeSpu.price.toFixed(2):'0'}}
        </div>
        <div class="spec-code">商品编码:{{ storeSpu.id }}</div>
      </div>
      <div class="spuSpecs">
        <div class="prod-spec">
          <div class="nature-container">
            <dl v-for="spec in specs" class="pro-spec">
              <dt class="multy-spec">{{ spec.name }}</dt>
              <dd>
                <a
                  @click="specValue.checked?'':specValue.isActive?changeSpecValue(spec.id,specValue.id):specs.length===1?'':handleDisableClick(specValue.id)"
                  v-for="specValue in spec.specValues" class="a-item"
                  :class="{selected : specValue.checked, disabled : !specValue.isActive}">{{ specValue.name }}</a>
              </dd>
            </dl>
          </div>
        </div>
        <div class="goods-number">
          <h2>购买数量</h2>
          <inline-x-number v-model="num" class="count_choose" :min="1"
                           :max="99"></inline-x-number>
        </div>
      </div>
      <section class="actionbar" style="z-index: 510">
        <div class="action-list">
          <a class="item addtocart" @click="addReservation">预约到店</a>
          <a class="item buy" @click="addStoreShoppingCart">加入购物车</a>
        </div>
      </section>
    </popup>

  </div>
</template>

<script>
  import {XHeader, Group, Cell, Badge, Popup, InlineXNumber, Rater} from 'vux'

  import {
    queryStoreSkuDetail,
    queryStoreInfo,
    queryShoppingCartCount,
    querySpuSpecs,
    querySkuSpecs,
    addReservation,
    addStoreShoppingCart
  } from '@/api/storespudetail';

  export default {
    components: {XHeader, Group, Cell, Badge, Popup, InlineXNumber, Rater},
    data() {
      return {
        num: 1,// 选择商品的数量
        storeId: this.$route.query.storeId,// 店铺id
        specPathInfo: {},// 规格值的路径 用于计算规格值的激活
        specSplitter: '\u2299',// 分隔符
        specs: [],// 商品下的规格信息
        allskus: [],//商品下所有的单品
        carNum: 0,// 购物车总数
        storeSpu: {},// 门店商品
        storeInfo: {},// 店铺信息
        specShowFlag: false, // 规格显示隐藏标记
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryStoreSkuDetail(this.$route.query.skuId,);
      this.queryStoreInfo();
      this.queryShoppingCartCount();
    },
    methods: {
      // 查询门店商品
      queryStoreSkuDetail(skuId) {
        queryStoreSkuDetail(skuId, this.storeId).then(res => {
          this.storeSpu = res.data;
          this.querySpuSpecs(this.$route.query.spuId);
        })
      },
      // 查询店铺信息
      queryStoreInfo() {
        queryStoreInfo(this.$route.query.storeId).then(res => {
          this.storeInfo = res.data;
        })
      },
      // 查询购物车数量
      queryShoppingCartCount() {
        queryShoppingCartCount().then(res => {
          this.carNum = res;
        })
      },
      // 预约到店
      addReservation() {
        addReservation({skuId: this.storeSpu.id, num: this.num, storeId: this.storeId}).then(res => {
          switch (res) {
            case 0:
              this.$vux.toast.text('预约失败，请刷新后重试', 'bottom')
              break;
            case 1:
              this.$vux.toast.text('您已成功预约', 'bottom')
              break;
            case -1:
              this.$vux.toast.text('参数错误', 'bottom')
              break;
            case -2:
              this.$vux.toast.text('商品不存在', 'bottom')
              break;
            case -3:
              this.$vux.toast.text('商品已下架', 'bottom')
              break;
            case -4:
              this.$vux.toast.text('库存不足', 'bottom')
              break;
            default:
              break;
          }
        })
      },
      // 加入门店购物车
      addStoreShoppingCart() {
        addStoreShoppingCart({skuId: this.storeSpu.id, num: this.num, storeId: this.storeId}).then(res => {
          switch (res) {
            case 0:
              this.$vux.toast.text('加入购物车失败，请刷新后重试', 'bottom')
              break;
            case 1:
              this.$vux.toast.text('成功加入购物车', 'bottom')
              this.queryShoppingCartCount();
              break;
            case -1:
              this.$vux.toast.text('库存不足', 'bottom')
              break;
            case -2:
              this.$vux.toast.text('商品不存在', 'bottom')
              break;
            case -3:
              this.$vux.toast.text('参数错误', 'bottom')
              break;
            case -4:
              this.$vux.toast.text('商品已下架', 'bottom')
              break;
            default:
              break;
          }
        })
      },
      // 跳转到购物车
      toCart() {
        this.$router.push({path: '/cart', query: {from: 'spudetail'}})
      },
      // 查询单品下的规格信息
      querySpuSpecs(spuId) {
        querySpuSpecs(spuId).then(res => {
          this.specs = this.findChecked(res, this.storeSpu)
          this.querySkuSpecs(spuId);
        })
      },

      // 查询商品下所有单品的规格信息
      querySkuSpecs(spuId) {
        querySkuSpecs(spuId).then(res => {
          this.allskus = res;
          this.specActiveInit();
        })
      },
      // 找出当前单品选中的规格
      findChecked(specs, spu) {
        specs.forEach(spec => {
          spec.specValues.forEach(specValue => {
            spu.skuSpecValues.forEach(skuSpecValue => {
              if (spec.id === skuSpecValue.specId && specValue.id === skuSpecValue.specValueId) {
                specValue.checked = true;
              }
            })
          })
        });
        return specs;
      },
      // 设置规格值激活
      specActiveInit() {
        this.specPathInfo = {};
        this.buildResult();
        this.updateStatus(this.getSelectedItem());
      },
      //生成所有子集是否可选、库存状态 map
      buildResult() {
        let that = this;
        let items = this.allskus;
        let allKeys = this.getAllSkusPath();
        let res = this.specPathInfo;
        for (let i = 0; i < allKeys.length; i++) {
          let curr = allKeys[i];
          let skuId = items[i].id;
          let values = curr.split(that.specSplitter);
          let allSets = this.powerSet(values);
          // 每个组合的子集
          for (let j = 0; j < allSets.length; j++) {
            let set = allSets[j];
            let key = set.join(that.specSplitter);
            if (res[key]) {
              res[key].skuIds.push(skuId)
            } else {
              res[key] = {
                skuIds: [skuId]
              }
            }
          }
        }
      },
      //取得集合的所有子集「幂集」
      powerSet(arr) {
        let ps = [[]];
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0, len = ps.length; j < len; j++) {
            ps.push(ps[j].concat(arr[i]));
          }
        }
        return ps;
      },
      // 获得所有单品的规格值
      getAllSkusPath() {
        let allskus = this.allskus;
        let that = this;
        let result = [];
        allskus.forEach(sku => {
          let values = [];
          sku.skuSpecValues.forEach(skuSpecValue => {
            values.push(skuSpecValue.specValueId + '(' + skuSpecValue.valueRemark + ')')
          });
          sku.path = values.join(that.specSplitter);
          result.push(sku.path);
        });
        return result
      },
      //更新所有规格值是否激活的状态
      updateStatus(selected) {
        let specs = this.specs;
        let that = this;
        let pathInfo = this.specPathInfo;
        for (let i = 0; i < specs.length; i++) {
          let data = specs[i].specValues;
          let copy = selected.slice();
          for (let j = 0; j < data.length; j++) {
            let item = data[j].id + '(' + data[j].name + ')';
            data[j].isActive = true;
            if (selected[i] == item) continue;
            copy[i] = item;
            let curr = that.trimSplitter(copy.join(this.specSplitter));
            data[j].isActive = !!pathInfo[curr];
          }
        }
        this.specs = JSON.parse(JSON.stringify(specs));
      },
      //获取当前选中的规格值
      getSelectedItem() {
        let specs = this.specs;
        let result = [];
        let that = this;
        specs.forEach(spec => {
          let checkedSpecValue = that.getCheckedSpecValue(spec);
          result.push(checkedSpecValue ? checkedSpecValue.id + '(' + checkedSpecValue.name + ')' : '');
        });
        return result;
      },
      // 获得选中的规格值
      getCheckedSpecValue(spec) {
        let checkedSpecValue = null;
        spec.specValues.forEach(specValue => {
          if (specValue.checked) {
            checkedSpecValue = specValue;
          }
        });
        return checkedSpecValue;
      },
      // 去除分隔符
      trimSplitter(str) {
        // ⊙abc⊙ => abc
        // ⊙a⊙⊙b⊙c⊙ => a⊙b⊙c
        let splitter = this.specSplitter;
        let reLeft = new RegExp('^' + splitter + '+', 'g');
        let reRight = new RegExp(splitter + '+$', 'g');
        let reSplitter = new RegExp(splitter + '+', 'g');
        return str.replace(reLeft, '').replace(reRight, '').replace(reSplitter, splitter)
      },
      // 切换规格值
      changeSpecValue(specId, specValueId) {
        let skuId = this.getSkuId(this.getChosenSpec(specId, specValueId), this.allskus);
        // 如果单品id存在 则查询单品信息
        if (skuId) {
          this.queryStoreSkuDetail(skuId);
        } else {
          this.updateStatus(this.getSelectedItem());
        }
      },
      // 获得当前选中的规格信息
      getChosenSpec(specId, specValueId) {
        let response = [];
        let that = this;
        this.specs.forEach(spec => {
          if (spec.id == specId) {
            response.push(specValueId);
            spec.specValues.forEach(specValue => {
              specValue.checked = specValue.id == specValueId;
            })
          } else {
            let checkedSpecValue = that.getCheckedSpecValue(spec);
            response.push(checkedSpecValue ? checkedSpecValue.id : '')
          }
        });
        this.specs = that.specs;
        return response.join(',') + ',';
      },
      // 规格规格值获得对应的单品id
      getSkuId(chooseSpec, allskus) {
        for (let i = 0; i < allskus.length; i++) {
          let skuSpeValue = '';
          for (let j = 0; j < allskus[i].skuSpecValues.length; j++) {
            skuSpeValue += allskus[i].skuSpecValues[j].specValueId + ',';
          }
          if (chooseSpec == skuSpeValue) {
            return allskus[i].id;
          }
        }
      },
      // 门店路线导航
      toRouteNavigation() {
        this.$router.push({
          path: '/routenavigation',
          query: {longitude: this.storeInfo.longitude, latitude: this.storeInfo.latitude}
        })
      },
    }
  }
</script>
