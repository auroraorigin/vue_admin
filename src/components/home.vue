<template>
  <el-container class="home-container">
    <el-header>
      <div>后台管理系统</div>
      <el-button class="btn" type="info" @click="logout" round>退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边菜单 -->
        <el-menu
          background-color="#293a4a"
          text-color="#e9f3f4"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item._id" v-for="item in menulist" :key="item._id">
            <!-- 一级菜单区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item._id]"></i>
              <!-- 文本 -->
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem._id"
              @click="saveNavState(subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        '5e71d72f993f6246d8147c27': 'iconfont icon-user',
        '5e72e81b9e064435c4a7c5cd': 'iconfont icon-tijikongjian',
        '5e79e56f180d5719dc01d297': 'iconfont icon-shangpin',
        '5e7df2e29730a725e48324d4': 'iconfont icon-danju',
        '5e7f4816176df706a4bc85f4': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活地址
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }

  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(32, 54, 75);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 25px;
  color: #e9f3f4;
  .btn {
    background-color: rgb(32, 54, 75);
  }
}
.el-aside {
  background-color: #293a4a;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #e9edf1;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.main{
  height: 690px;
}
.el-submenu span{
    font-size: 13px;
}
</style>
