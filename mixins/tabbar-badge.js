import {
  mapGetters
} from 'vuex'

// 导出一个mixin对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  watch: {
    // 监听total值的变化
    total() {
      调用methods中的setBadge方法,
      重新为tabBar的数字徽章赋值
      this.setBadge()
    }
  },
  onShow() {
    // 在页面刚展示的时候,设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用uni.setTabBarBadge()方法,为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2,
        text: this.total + '',
      })
    }
  }
}