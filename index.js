/** 各个省份 身份证前两位 map集合 */
const provs = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江 ",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北 ",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏 ",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外"
};
class IdCard {
  cardInfo = {}
  /** 获取身份证校验码(身份证最后一位) */
  _getCheckCode(cardNum) {
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = factor.reduce((pre, cur, i) => pre + cur * cardNum[i], 0)
    return parity[sum % 11]
  }
  /** 校验校验码 */
  _checkCheckCode(cardNum) {
    const code = cardNum.substring(17)
    const sex = cardNum.slice(-2, -1) % 2 == 1 ? 'man' : 'woman'
    Object.assign(this.cardInfo, {
      sex
    })
    const checkCode = this._getCheckCode(cardNum)
    return code.toUpperCase() == checkCode
  }
  /** 校验身份证日期 */
  _checkDate(val) {
    const pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/
    if (pattern.test(val)) {
      const year = val.substring(0, 4)
      const month = val.substring(4, 6)
      const date = val.substring(6, 8)
      const birthDay = `${year}-${month}-${date}`
      const dateTime = new Date(birthDay)
      if (dateTime && dateTime.getMonth() === (parseInt(month) - 1)) {
        Object.assign(this.cardInfo, {
          year,
          month,
          date,
          birthDay
        })
        return true
      }
    }
    return false
  }
  /** 校验身份证省份 */
  _checkProv(val) {
    const pattern = /^[1-9][0-9]/
    const pro = provs[val]
    Object.assign(this.cardInfo, {
      pro
    })
    return pattern.test(val) && pro
  }
  /** 校验身份证位数格式 */
  _checkCode(val) {
    const pattern = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/
    return pattern.test(val)
  }
  /** 整体校验 */
  validator(cardNum) {
    if (!this._checkCode(cardNum)) {
      return {
        checked: false,
        msg: '身份证格式不正确'
      }
    }
    if (!this._checkCheckCode(cardNum)) {
      return {
        checked: false,
        msg: '身份证校验码(最后一位)不正确'
      }
    }
    const date = cardNum.substring(6, 14)
    if (!this._checkDate(date)) {
      return {
        checked: false,
        msg: '身份证出生日期不正确'
      }
    }
    const pro = cardNum.substring(0, 2)
    if (!this._checkProv(pro)) {
      return {
        checked: false,
        msg: '身份证区号不存在'
      }
    }
    return {
      checked: true
    }
  }
  /** 处理身份信息 */
  _handCardInfo() {
    const {
      year
    } = this.cardInfo
    return {
      ...this.cardInfo,
      age: new Date().getFullYear() - year
    }
  }
  /** 获取身份证信息 */
  getIdCardInfo(cardNum) {
    const {
      checked,
      msg
    } = this.validator(cardNum)
    if (!checked) return {
      checked,
      msg
    }
    return this._handCardInfo()
  }
}
export default IdCard
