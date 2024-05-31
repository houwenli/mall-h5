// 退单状态字典
export const logStatusDict = [
  {
    label: '[退款处理中]',
    value: 1
  },
  {
    label: '退款申请已通过',
    value: 2
  },
  {
    label: '退款申请已拒绝',
    value: 3
  },
  // {
  //   label: '退款成功',
  //   value: 2
  // },
  // {
  //   label: '退款拒绝',
  //   value: 3
  // },
  {
    label: '退货申请',
    value: 4
  },
  {
    label: '退货拒绝',
    value: 5
  },
  {
    label: '退货审核通过等待用户填写物流',
    value: 6
  },
  {
    label: '待收货',
    value: 7
  },
  {
    label: '退货完成',
    value: 8
  },
  {
    label: '退货失败',
    value: 9
  },
  {
    label: '发放金额',
    value: 10
  },
  {
    label: '用户取消申请',
    value: 11
  },
  {
    label: '用户修改申请',
    value: 12
  },
  {
    label: '退款申请已通过',
    value: 31
  },
]

// 支付方式字典
export const payChannelDict = [
  {
    label: '钱包支付',
    value: 1
  },
  {
    label: '万顺宝余额支付',
    value: 0
  },
  {
    label: '微信',
    value: 2
  },
  {
    label: '支付宝',
    value: 3
  },
  {
    label: '银联支付',
    value: 4
  },
  {
    label: '平台代付',
    value: 5
	},
  {
    label: '礼品卡支付',
    value: 6
	},
  {
    label: '微信+万顺宝余额支付',
    value: 7
  },
  {
    label: '支付宝+万顺宝余额支付',
    value: 8
  },
  {
    label: '福气值支付',
    value: 9
  },
  {
    label: '福气值+万顺宝余额支付',
    value: 10
  },
  {
    label: '福气值+支付宝支付',
    value: 11
  },
  {
    label: '福气值+微信支付',
    value: 12
  },
  {
    label: '福气值+万顺宝余额+支付宝支付',
    value: 13
  },
  {
    label: '福气值+万顺宝余额+微信支付',
    value: 14
  }
]

//服务单详情状态
export const serverStatusDict = [
  {
    label: '待审核',
    value: 4
  },
  {
    label: '请您发货',
    value: 6
  },
  {
    label: '待供应商收货',
    value: 7
  },
  {
    label: '退款成功',
    value: 8
  },
  {
    label: '服务单关闭',
    value: 5
  },
  {
    label: '服务单关闭',
    value: 9
  },
  {
    label: '服务单取消',
    value: 11
  },
  {
    value: 12,
    label: '退款成功'
  }
]

//换货服务单详情状态
export const exchangeServerStatusDict = [
  {
    label: '待审核',
    value: 13
  },
  {
    label: '服务单取消',
    value: 11
  },
  {
    label: '服务单关闭',
    value: 14
  },
  {
    label: '服务单关闭',
    value: 17
  },
  {
    label: '请您发货',
    value: 15
  },
  {
    label: '待供应商收货',
    value: 16
  },
  {
    label: '待供应商发货',
    value: 18
  },
  {
    label: '退款成功',
    value: 19
  },
  {
    label: '等待收货',
    value: 20
  },
  {
    label: '等待收货',
    value: 21
  },
  {
    label: '换货完成',
    value: 22
  }
]

export const seckillSceneStatusDict = [
  {
    label: '抢购中',
    value: 1
  },
  {
    label: '即将开始',
    value: 2
  }
]
