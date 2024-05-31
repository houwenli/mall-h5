import dayjs from 'dayjs'
/**
* 获取运输时间-格式化
*/
export const getTransportTime = t => {
  let todayDate = dayjs().date()
  let currentYear = dayjs().year()


  let date = dayjs(t).date()
  let year = dayjs(t).year()

  // 时间为当日
  if (todayDate === date) {
    return dayjs(t).format('HH:mm')
  }

  // 当年
  if (currentYear === year) {
    return dayjs(t).format('MM-DD')
  }

  // 往年
  return dayjs(t).format('YYYY-MM-DD')
}