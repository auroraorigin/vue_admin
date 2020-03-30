<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>推广信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>推广信息列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <template>
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="首页" name="first">
            <el-carousel height="200px" class="swiper" :autoplay="false">
              <el-carousel-item v-for="item in adList.swiper" :key="item">
                <el-image style="width: 375px; height: 200px;" :src="item" fit="fill"></el-image>
              </el-carousel-item>
            </el-carousel>

            <el-carousel height="50px" class="notice" :autoplay="false" direction="vertical">
              <el-carousel-item v-for="item in adList.notice" :key="item">
                <p class="noticep">{{item}}</p>
              </el-carousel-item>
            </el-carousel>

            <div class="floor" v-for="item in adList.floor" :key="item">
              <el-image style="width: 375px;border-radius: 8px;" :src="item.url" fit="fill"></el-image>
              <div class="product">
                <div class="goods" v-for="itemg in item.goods" :key="itemg">
                  <el-image style="width: 180px; height: 94px; border-top-right-radius: 8px; border-top-left-radius: 8px;" :src="itemg.url" fit="fill"></el-image>
                  {{itemg.name}}
                  </div>
              </div>
            </div>
            <el-button type="primary" @click="showEditSwiperDialog">编辑轮播图</el-button>
            <el-button type="primary" @click="showEditSwiperDialog">编辑广告</el-button>
            <el-button type="primary" @click="showEditSwiperDialog">编辑楼层信息</el-button>
          </el-tab-pane>

          <el-tab-pane label="分类" name="second">
            <div class="cate" v-for="item in adList.cate" :key="item">
              <p>{{item.name}}</p>
              <div class="cate_goods" v-for="itemg in item.goods" :key="itemg">
                  <el-image style="width: 140px; height: 94px; border-top-left-radius: 8px; border-bottom-left-radius: 8px;" :src="itemg.url" fit="fill"></el-image>
                  {{itemg.name}}
              </div>
            </div>
            <el-button type="primary" @click="showEditSwiperDialog">编辑推广分类</el-button>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      adList: {}
    }
  },
  created () {
    this.getAdList()
  },
  methods: {
    async getAdList () {
      const { data: res } = await this.$http.get('ad')
      this.adList = res.data
    },
    // 显示修改轮播图对话框
    showEditSwiperDialog () {}
  }
}
</script>

<style lang="less" scoped>
.swiper {
  width: 375px;
  margin-bottom: 5px;
  border-radius: 8px;
}
.notice {
  width: 375px;
  margin: 5px 0;
  border-radius: 8px;
}
.noticep {
  margin-left: 5px;
  line-height: 20px;
}
.floor {
  width: 375px;
  margin: 5px 0px;
}
.product {
  width: 375px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.goods {
  width: 180px;
  border-radius: 8px;
  border:1px solid #cbccce;
}
.cate{
  width: 375px;
}
.cate_goods{
 display: flex;
 align-items: center;
 width: 375px;
 border:1px solid #cbccce;
 border-radius: 8px;
 margin-bottom: 5px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
