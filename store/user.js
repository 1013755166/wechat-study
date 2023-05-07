export default {
  // 开启命名空间
  namespaced: true,

  // state数据
  state: () => ({
    // 收货地址对象
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),
  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      // 2. 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
      this.commit('m_user/saveAddressStorage')
    },
    // 1. 定义将 address 持久化存储到本地 mutations 方法
    saveAddressStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },
  // 数据包装器
  getters: {
    // 收货详细地址的计算属性
    addstr(state) {
      // 如果省不存在,则返回空字符串,存在，就进行地址拼接
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}