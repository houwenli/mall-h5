<template>
  <div class="page-container">
    <div class="card-panel">
      <p>
        为保障万顺福app的稳定运行和实现相关业务功能，我们会接入由第三方提供的软件开发包（sdk）实现上述目标。我们会尽到审慎业务，对合作方获取信息的软件工具开发包（sdk）进行严格的安全监测，以保护数据安全。
      </p>
      <p>
        我们接入的第三方sdk主要服务于用户的需求，因此在满足新的服务需求及业务功能变更时，我们可能会调整我们接入的第三方sdk。我们会及时在本说明中向您公开说明接入第三方sdk的最新情况。请注意，第三方sdk可能因为其版本升级、策略调整原因导致数据处理类型存在一定变化，请以其公示的官方说明为准。
      </p>
    </div>

    <div class="card-panel">
      <div class="card-title">目前万顺福接入的第三方SDK列明如下：</div>

      <div>
        <div class="card-title">1、SDK名称：高德开放平台出行sdk</div>
        <p>厂家：高德软件有限公司</p>
        <p>
          收集信息类型：
          <span class="text-underline">
            位置信息（经纬度、精确位置、粗略位置）；设备信息【IP 地址、GNSS信息、WiFi状态、WiFi参数、WiFi列表、SSID、BSSID、基站信息、信号强度的信息、蓝牙信息、传感器信息（矢量、加速度、压力、方向、地磁、陀螺、温度、光敏、nema信号）、设备信号强度信息、外部存储目录】；设备标识信息（IMEI、IDFA、IDFV、Android ID、MEID、MAC地址、OAID、IMSI、ICCID、硬件序列号）、当前应用信息（应用名、应用版本号）、设备参数及系统信息（系统属性、设备型号、操作系统、运营商信息）、SIM卡状态、传感器列表，使用的敏感权限：存储；
          </span>
        </p>

        <p>使用目的：实现定位、地图展示、路径规划与导航</p>
        <p>使用的敏感系统权限：位置权限</p>
        <p>具体使用场景：自动定位到用户坐标大头针、叫车起终点路线、展示司机乘客位置、营销活动展示</p>
        <p>共享方式：SDK本地采集</p>
        <p>隐私政策链接：https://lbs.amap.com/pages/privacy/</p>
      </div>
    </div>
    <div class="card-panel">
      <div class="card-title">2、SDK名称：支付宝支付</div>
      <p>厂家：支付宝（中国）网络技术有限公司</p>
      <p>
        收集信息类型：
        <span class="text-underline">
          设备信息（Androidid/厂商/机型/系统版本/时间/IMEI/IMSI、SIM卡序列号/MAC地址/物理位置/网络信息/Ssid/bssid）/订单号/订单金额/软件运行列表/ip地址
        </span>
      </p>
      <p>使用目的：实现使用支付宝付款</p>
      <p>使用的敏感系统权限：无</p>
      <p>具体使用场景：支付：收银台支付</p>
      <p>共享方式：SDK本地采集</p>
      <p>隐私政策链接：https://render.alipay.com/p/c/k2cx0tg8</p>
    </div>

    <div class="card-panel">
      <div class="card-title">3、SDK名称：腾讯buglysdk（集成腾讯tinkersdk）</div>
      <p>厂家：腾讯科技（深圳）有限公司</p>
      <p>
        收集信息类型：
        <span class="text-underline">
          安卓系统（手机型号、手机品牌、安卓系统版本、安卓系统api等级、厂商系统版本、cpu架构类型、设备是否root、磁盘空间占用大小、sdcard空间占用大小、内存空间占用大小、网络类型、软件运行列表和PID）；IOS版本（设备型号、操作系统版本、操作系统内部版本号、wifi状态、cpu属性、内存剩余空间、磁盘空间/磁盘剩余空间、运行时手机状态（进程所占内存、虚拟内存）、IDFV、是否越狱、地区编码、软件运行列表和PID）、存储
        </span>
      </p>
      <p>
        使用目的：排查崩溃问题，帮助app提升稳定性
      </p>
      <p>使用的敏感系统权限：无</p>
      <p>具体使用场景：监测app的异常</p>
      <p>共享方式：SDK本地采集</p>
      <p>隐私政策链接：https://privacy.qq.com/document/preview/fc748b3d96224fd b825ea79e132c1a56</p>
    </div>

    <div class="card-panel">
      <div class="card-title">4、SDK名称：闪验sdk</div>
      <p>厂家：上海创蓝文化传播有限公司</p>
      <p>
        收集信息类型：
        <span class="text-underline">
          IOS【设备名称、机器型号、系统版本、ip、网络制式、当前时间戳、idfv、屏幕宽高、网络类型、运营商类型、bundleId、mac地址、IMEI、ICCID、IMSI、OAID、设备型号厂商】；安卓【设备系统版本、运营商类型、subID、私网IP、应用包名、应用包签名、网络连接状态】；运营商信息、已安装应用包名、WiFi状态，使用的敏感权限：存储；
        </span>
      </p>
    </div>

    <div class="card-panel">
      <div class="card-title">5、SDK名称：腾讯位置服务sdk</div>
      <p>厂家：腾讯科技（深圳）有限公司</p>
      <p>
        收集信息类型：
        <span class="text-underline">
          安卓版本【OAID、系统属性、操作系统及版本、系统设置、设备型号、运营商基站信息（Cellid）、WIFI信息（WiFi状态、WIFI参数、附近的WIFI列表、连接的WIFI）、传感器信息（重力传感器、线性加速度传感器、 陀螺仪传感器、加速度传感器、磁场传感器、光线传感器、旋转矢量传感器、压力传感器、方向传感器、线性加速度传感器）、蓝牙信息、精确位置信息（GPS信息）、网络类型、手机屏幕密度、尺寸、IP地址】；IOS版本【IDFV、操作系统及版本、设备型号、WIFI信息（WiFi状态、WIFI参数、连接的WIFI）、传感器信息（重力传感器、线性加 速度传感器、陀螺仪传感器、加速度传感器、磁场传感器、光线传感器、旋转矢量传感器、压力传感器、方向传感器、线性加速度传感器）、蓝牙信息、精确位置信息（GPS信息）、网络类型、手机屏幕密度、尺寸、IP地址、设备运动数据】、AAID、运行中进程信息、传感器列表、WiFi参数（ssid、bssid）、SIM卡状态、已安装应用包名，使用的敏感权限：存储；</span>
      </p>
      <p>
        使用目的：实现定位、地图展示、路径规划与导航
      </p>
      <p>使用的敏感系统权限：位置权限</p>
      <p>具体使用场景：自动定位到用户坐标大头针、换电电柜和用户起终点位置、租车网点和用户起终点位置</p>
      <p>共享方式：SDK本地采集</p>
      <p>隐私政策链接：https://lbs.qq.com/userAgreements/agreements/privacy</p>
    </div>
  </div>
</template>

<script>
  // 第三方信息共享清单
  export default {
    name: 'listOfThirdPartyInformationSharing',
    data() {
      return {}
    },
  }
</script>

<style lang="less" scoped>
  @import './base.less';

  .page-container {
    padding: 16px;

    .page-title {
      text-align: center;
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel {
      margin-bottom: 16px;
      p {
        line-height: 1.85;
        font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
        text-indent: 2em;
        word-break: break-all;
      }

      .card-title {
        margin-bottom: 8px;
      }
    }
  }
</style>
