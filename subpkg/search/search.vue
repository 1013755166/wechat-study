<template>
  <view>
    <view class="search-box">
      <!-- 使用uni-ui提供的搜索组件 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !==0">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 搜索历史列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的timeId
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜素关键词的历史记录
        historyList: ['a', 'b']
      };
    },
    computed: {
      historys() {
        // 注意,由于数组是引用类型,所以不要直接基于原数组调用reverse方法,以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组,再进行reverse反转
        return [...this.historyList].reverse()
      }
    },
    onLoad() {
      // 加载本地存储的搜索历史记录，JSON.parse()解析JSON字符串
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        // e是最新的搜索内容
        // console.log(e)
        // 清除timer对应的延时器
        clearTimeout(this.timer)
        // 重新启动一个延时器,并把timeId赋值给this.timer
        this.timer = setTimeout(() => {
          // 如果500毫秒内,没有触发新的输入事件,则为搜索关键词赋值
          this.kw = e
          console.log(this.kw)
          // 根据关键词,搜索商品建议列表
          this.getSearchList()
        }, 500)
      },
      // 根据关键词,搜索商品建议列表
      async getSearchList() {
        // 判断关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        // 获取搜索建议列表
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        this.saveSearchHistory()
      },
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      // 保存搜索关键词的方法
      saveSearchHistory() {
        // 直接把搜索关键词push到historyList数组中
        // this.historyList.push(this.kw)
        // 直接在原数组调用reverse,数组元素顺序会反转，[1,2]=>[2,1]
        // this.historyList.reverse()
        // 将Array数组转化为set对象
        const mySet = new Set(this.historyList);
        // 调用 Set 对象的 delete 方法，移除对应的元素，目的是将重复的旧元素删除，在添加重复的新元素时，重复的元素在通过reverse后就是最前面的元素了
        mySet.delete(this.kw)
        // 调用 Set 对象的 add 方法，向 Set 中添加元素
        mySet.add(this.kw)
        // 将 Set 对象转化为 Array 数组
        this.historyList = Array.from(mySet)
        // console.log(mySet)
        // if (mySet.has(this.kw) == false) return mySet.add(this.kw)
        // 调用uni.setStorageSync(key,value)将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清空搜索历史记录
      cleanHistory() {
        // 清空data中保存的搜索历史
        this.historyList = []
        // 清空本地存储中记录的搜索历史
        uni.setStorageSync('kw', '[]')
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    // 设置定位效果为'吸顶'
    position: sticky;
    // 吸顶的'位置'
    top: 0;
    // 提高层级,防止被轮播图覆盖
    z-index: 999;
    background-color: #c00000;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>