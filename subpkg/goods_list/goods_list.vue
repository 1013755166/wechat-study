<template>
  <view>
    <view class="goods-list">
      <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
        <my-goods :goods="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量,用来实现分页
        total: 0,
        // 是否正在请求数据
        isloading: false
      }
    },
    onLoad(options) {
      // 将页面参数转存到this.queryObj对象中
      // query是home楼层跳转和搜索历史跳转
      this.queryObj.query = options.query || ''
      // cid是分类中三级分类跳转
      this.queryObj.cid = options.cid || ''
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        // 打开节流阀，允许请求数据
        this.isloading = true
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀，不允许请求数据
        this.isloading = false
        // 只要数据请求完毕,就立即按需调用cb回调函数，如果cb是undefined，就继续运行下面的代码，接收到了回调函数，也运行
        console.log(cb)
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        // 为数据赋值，通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 点击跳转到商品详情页面
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 触底的事件
    onReachBottom() {
      // 判断是否还有下一页数据
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 判断是否正在请求其他数据,如果是,则不发起额外请求,如果this.isloading是true,直接退出函数，后面的不运行
      if (this.isloading) return
      // 让页码值自增+1
      this.queryObj.pagenum += 1
      // 重新获取列表数据，因为之前只获取了第一页的数据，获取第二页的数据
      this.getGoodsList()
    },
    // 下拉刷新的事件
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      // 重新发起请求,并在请求完成后关闭下拉刷新事件,为什么在这里写个回调,是因为不是每次的getGoodsList()都需要关闭下拉刷新
      this.getGoodsList(() => uni.stopPullDownRefresh())

    }
  }
</script>

<style lang="scss">

</style>