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
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="首页" name="first">首页</el-tab-pane>
          <el-tab-pane label="分类" name="second">分类</el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'second'
    }
  },
  created () {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
