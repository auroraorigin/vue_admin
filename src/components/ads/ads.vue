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
          <!-- 首页 -->
          <el-tab-pane label="首页" name="first">
            <div class="page">
              <el-card shadow="hover " :body-style="{ padding: '14px' }">
                <el-carousel height="200px" class="swiper" :autoplay="false">
                  <el-carousel-item v-for="item in adList.swiper" :key="item.id">
                    <el-image style="width: 375px; height: 200px;" :src="item" fit="fill"></el-image>
                  </el-carousel-item>
                </el-carousel>

                <el-carousel height="50px" class="notice" :autoplay="false" direction="vertical">
                  <el-carousel-item v-for="item in adList.notice" :key="item.id">
                    <p class="noticep">{{item.name}}</p>
                  </el-carousel-item>
                </el-carousel>

                <div class="floor" v-for="item in adList.floor" :key="item.id">
                  <el-image
                    style="width: 375px;border-radius: 8px;margin-bottom:5px;"
                    :src="item.url"
                    fit="fill"
                  ></el-image>
                  <div class="product">
                    <div class="goods" v-for="itemg in item.goods" :key="itemg.id">
                      <el-image
                        style="width: 180px; height: 94px; border-top-right-radius: 8px; border-top-left-radius: 8px;"
                        :src="itemg.url"
                        fit="fill"
                      ></el-image>
                      {{itemg.name}}
                    </div>
                  </div>
                </div>
              </el-card>
              <div class="btn">
                <el-button
                  type="primary"
                  @click="showEditSwiperDialog"
                  round
                  icon="el-icon-edit"
                  size="medium"
                >编辑轮播图</el-button>
                <Br />
                <el-button
                  type="info"
                  @click="showEditNoticeDialog"
                  round
                  icon="el-icon-edit"
                  style="margin:5px 0;"
                  size="medium"
                >编辑公告信息</el-button>
                <Br />
                <el-button
                  type="warning"
                  @click="showEditFloorDialog"
                  round
                  icon="el-icon-edit"
                  size="medium"
                >编辑楼层信息</el-button>
              </div>
            </div>
          </el-tab-pane>
          <!-- 分类页面 -->
          <el-tab-pane label="分类" name="second">
            <div class="page">
              <el-card shadow="hover " :body-style="{ padding: '14px' }">
                <div class="cate" v-for="item in adList.cate" :key="item.id">
                  <p style="margin-left:5px;">{{item.name}}</p>
                  <div class="cate_goods" v-for="itemg in item.goods" :key="itemg.id">
                    <el-image
                      style="width: 140px; height: 94px; border-top-left-radius: 8px; border-bottom-left-radius: 8px;"
                      :src="itemg.url"
                      fit="fill"
                    ></el-image>
                    <p style="margin-left:5px;">{{itemg.name}}</p>
                  </div>
                </div>
              </el-card>
              <div class="btn">
                <el-button
                  type="primary"
                  @click="showEditCateDialog"
                  round
                  icon="el-icon-edit"
                  size="medium"
                >编辑推广分类</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>

    <!-- 修改轮播图对话框 -->
    <el-dialog
      title="修改首页轮播图"
      :visible.sync="editSwiperDialogVisible"
      width="50%"
      @close="editSwiperDialogClosed"
    >
      <el-form
        ref="editSwiperFormRef"
        :model="editSwiperForm"
        :rules="editSwiperFormRules"
        label-width="100px"
      >
        <el-form-item label="轮播图" prop="swiper">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-success="handleSwiperSuccess"
            :on-remove="handleSwiperRemove"
            :file-list="editSwiperForm.swiper"
            :headers="headerObj"
            list-type="picture"
            :limit="5"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSwiperDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSwiper">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改公告对话框 -->
    <el-dialog
      title="修改首页公告"
      :visible.sync="editNoticeDialogVisible"
      width="50%"
      @close="editNoticeDialogClosed"
    >
      <el-form
        ref="editNoticeFormRef"
        :model="editNoticeForm"
        :rules="editNoticeFormRules"
        label-width="100px"
      >
        <el-form-item label="公告" prop="notice">
          <el-button type="primary" size="mini" @click="addNotice">添加公告</el-button>
          <el-table :data="editNoticeForm.notice" border stripe>
            <el-table-column label="信息" prop="name"></el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editNoticeItem(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeNotice(scope.row._id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNoticeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNotice">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改楼层信息对话框 -->
    <el-dialog title="修改楼层信息" :visible.sync="editFloorDialogVisible" width="75%">
      <el-form
        ref="editFloorFormRef"
        :model="editFloorForm"
        :rules="editFloorFormRules"
        label-width="100px"
      >
        <el-form-item label="楼层" prop="floor">
          <el-button type="primary" size="mini" @click="addFloor">添加楼层</el-button>
          <div v-for="item in editFloorForm.floor" :key="item._id" style="margin-bottom:10px;">
            <el-card :body-style="{ padding: '15px' }">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :headers="headerObj"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <div @click="getFloor(item)">
                  <img v-if="item.url" :src="item.url" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
              <el-button type="primary" size="mini" @click="showAddFloorGoodsDialog(item._id)">添加商品</el-button>
              <el-table :data="item.goods" border stripe>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column
                  label="图片"
                  prop="url"
                  width="102px"
                  class="pic"
                  align="center"
                  header-align="left"
                >
                  <template slot-scope="scope">
                    <el-image style="width: 83px; height: 70px;" :src="scope.row.url" fit="fill"></el-image>
                  </template>
                </el-table-column>
                <el-table-column label="描述" prop="desc"></el-table-column>
                <el-table-column label="分类" prop="categories.name" width="100px"></el-table-column>
                <el-table-column label="操作" width="68px">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeFloorGoods(item._id,scope.row._id)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="danger" size="mini" @click="removeFloor(item._id)">删除楼层</el-button>
            </el-card>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFloorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFloor">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加楼层商品对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addFloorGoodsDialogVisible"
      width="30%"
      @close="closeAddFloorGoodsDialog"
    >
      <el-cascader v-model="goods_id" :options="goodsList" :props="{ expandTrigger: 'hover' }"></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFloorGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFloorGoods">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类推广对话框 -->
    <el-dialog title="修改分类页面信息" :visible.sync="editCateDialogVisible" width="75%">
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="100px"
      >
        <el-form-item label="楼层" prop="cate">
          <el-button type="primary" size="mini" @click="addCate">添加楼层</el-button>
          <div v-for="item in editCateForm.cate" :key="item._id" style="margin-bottom:10px;">
            <el-card :body-style="{ padding: '15px' }">
              <el-tooltip class="item" effect="light" content="点击修改楼层名称" placement="right-start">
                <el-tag
                  type="info"
                  style="cursor:pointer;width:80px"
                  @click="editCateName(item)"
                >{{item.name}}</el-tag>
              </el-tooltip>
              <br />
              <el-button type="primary" size="mini" @click="showAddCateGoodsDialog(item._id)">添加商品</el-button>
              <el-table :data="item.goods" border stripe>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column
                  label="图片"
                  prop="url"
                  width="102px"
                  class="pic"
                  align="center"
                  header-align="left"
                >
                  <template slot-scope="scope">
                    <el-image style="width: 83px; height: 70px;" :src="scope.row.url" fit="fill"></el-image>
                  </template>
                </el-table-column>
                <el-table-column label="描述" prop="desc"></el-table-column>
                <el-table-column label="分类" prop="categories.name" width="100px"></el-table-column>
                <el-table-column label="操作" width="68px">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeCateGoods(item._id,scope.row._id)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="danger" size="mini" @click="removeCate(item._id)">删除楼层</el-button>
            </el-card>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类楼层商品对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addCateGoodsDialogVisible"
      width="30%"
      @close="closeAddCateGoodsDialog"
    >
      <el-cascader v-model="goods_id" :options="goodsList" :props="{ expandTrigger: 'hover' }"></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateGoods">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      adList: {},
      uploadURL: 'http://127.0.0.1:8888/admin/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,
      editSwiperDialogVisible: false,
      editSwiperForm: { swiper: [] },
      editSwiperFormRules: {
        swiper: [
          { required: true, message: '请上传首页轮播图', trigger: 'blur' }
        ]
      },
      editNoticeDialogVisible: false,
      editNoticeForm: { notice: [] },
      editNoticeFormRules: {
        notice: [{ required: true, message: '请添加首页公告', trigger: 'blur' }]
      },
      editFloorDialogVisible: false,
      editFloorForm: { floor: [] },
      editFloorFormRules: {
        floor: [{ required: true, message: '请完善楼层数据', trigger: 'blur' }]
      },
      currentFlootId: '',
      addFloorGoodsDialogVisible: false,
      goods_id: [],
      goodsList: [],
      index: 0,
      editCateDialogVisible: false,
      editCateForm: { cate: [] },
      editCateFormRules: {
        cate: [
          { required: true, message: '请完善分类楼层数据', trigger: 'blur' }
        ]
      },
      addCateGoodsDialogVisible: false
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
    showEditSwiperDialog () {
      for (let i = 0; i < this.adList.swiper.length; i++) {
        this.editSwiperForm.swiper.push({
          name: '商品轮播图片',
          url: this.adList.swiper[i]
        })
      }
      this.editSwiperDialogVisible = true
    },
    // 关闭修改首页轮播图
    editSwiperDialogClosed () {
      this.editSwiperForm.swiper = []
    },
    // 点击图片名称预览
    handlePreview (file) {
      this.previewPath = file.url
      this.previewVisible = true
    },
    // 添加swiperUrl照片
    handleSwiperSuccess (res, file) {
      var temp = {
        name: file.name,
        url: res.data
      }
      this.editSwiperForm.swiper.push(temp)
    },
    // 删除swiperUrl照片
    handleSwiperRemove (file) {
      for (let i = 0; i < this.editSwiperForm.swiper.length; i++) {
        if (this.editSwiperForm.swiper[i].url === file.url) {
          this.editSwiperForm.swiper.splice(i, 1)
          break
        }
      }
    },
    // 上传图片之前
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG格式 或 png格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 修改首页轮播图
    editSwiper () {
      this.$refs.editSwiperFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          'ad/swiper',
          this.editSwiperForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getAdList()
        this.editSwiperDialogVisible = false
      })
    },
    // 显示修改公告对话框
    showEditNoticeDialog () {
      this.editNoticeForm.notice = JSON.parse(
        JSON.stringify(this.adList.notice)
      )
      this.editNoticeDialogVisible = true
    },
    // 关闭修改公告对话框
    editNoticeDialogClosed () {
      this.editNoticeForm.notice = []
    },
    // 添加公告
    addNotice () {
      this.$prompt('请输入公告', '添加新公告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          if (value === null || this.editNoticeForm.notice.length === 5) {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          } else {
            var temp = { name: '' }
            temp.name = value
            this.editNoticeForm.notice.push(temp)
          }
        })
        .catch(() => {})
    },
    // 编辑公告信息
    editNoticeItem (info) {
      this.$prompt('请修改公告', '修改公告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: info.name
      })
        .then(({ value }) => {
          if (value === '') {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          } else {
            for (let i = 0; i < this.editNoticeForm.notice.length; i++) {
              if (this.editNoticeForm.notice[i]._id === info._id) {
                this.editNoticeForm.notice[i].name = value
                return
              }
            }
          }
        })
        .catch(() => {})
    },
    // 删除公告item
    async removeNotice (_id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该公告, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      for (let i = 0; i < this.editNoticeForm.notice.length; i++) {
        if (this.editNoticeForm.notice[i]._id === _id) {
          this.editNoticeForm.notice.splice(i, 1)
          return
        }
      }
    },
    // 修改公告
    async editNotice () {
      this.$refs.editNoticeFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          'ad/notice',
          this.editNoticeForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getAdList()
        this.editNoticeDialogVisible = false
      })
    },
    // 显示编辑楼层信息对话框
    async showEditFloorDialog () {
      this.editFloorForm.floor = JSON.parse(JSON.stringify(this.adList.floor))

      const { data: res } = await this.$http.get('ad/goods')

      this.goodsList = res.data
      this.editFloorDialogVisible = true
    },
    // 获取修改图片楼层ID
    getFloor (item) {
      this.currentFlootId = item._id
    },
    // 修改楼层图片成功
    handleAvatarSuccess (res, file) {
      for (let i = 0; i < this.editFloorForm.floor.length; i++) {
        if (this.editFloorForm.floor[i]._id === this.currentFlootId) {
          this.editFloorForm.floor[i].url = res.data
        }
      }
    },
    // 删除楼层商品
    async removeFloorGoods (id, _id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      for (let i = 0; i < this.editFloorForm.floor.length; i++) {
        if (this.editFloorForm.floor[i]._id === id) {
          for (let j = 0; j < this.editFloorForm.floor[i].goods.length; j++) {
            if (this.editFloorForm.floor[i].goods[j]._id === _id) {
              this.editFloorForm.floor[i].goods.splice(j, 1)
              return
            }
          }
        }
      }
    },
    // 删除楼层
    async removeFloor (_id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该楼层, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      for (let i = 0; i < this.editFloorForm.floor.length; i++) {
        if (this.editFloorForm.floor[i]._id === _id) {
          this.editFloorForm.floor.splice(i, 1)
          return
        }
      }
    },
    // 显示添加楼层商品对话框
    async showAddFloorGoodsDialog (_id) {
      this.currentFlootId = _id
      this.addFloorGoodsDialogVisible = true
    },
    // 关闭添加楼层商品对话框
    closeAddFloorGoodsDialog () {
      this.goods_id = []
    },
    // 添加楼层商品
    addFloorGoods () {
      if (this.goods_id.length !== 2) {
        return this.$message.error('请选择商品')
      }

      for (let i = 0; i < this.editFloorForm.floor.length; i++) {
        if (this.editFloorForm.floor[i]._id === this.currentFlootId) {
          for (let j = 0; j < this.editFloorForm.floor[i].goods.length; j++) {
            if (
              this.editFloorForm.floor[i].goods[j]._id === this.goods_id[1]._id
            ) {
              return this.$message.error('该商品已存在')
            }
          }
          this.editFloorForm.floor[i].goods.push(this.goods_id[1])
          return this.$message.success('添加成功')
        }
      }
    },
    // 添加新楼层
    async addFloor () {
      const confirmResult = await this.$confirm('是否添加新楼层?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return
      }

      const a = this.index
      this.editFloorForm.floor.push({ _id: a, goods: [], url: '' })
      this.index++
    },
    // 修改楼层
    editFloor () {
      this.$refs.editFloorFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          'ad/floor',
          this.editFloorForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getAdList()
        this.editFloorDialogVisible = false
      })
    },
    // 显示修改分类楼层窗口
    async showEditCateDialog () {
      this.editCateForm.cate = JSON.parse(JSON.stringify(this.adList.cate))

      const { data: res } = await this.$http.get('ad/goods')

      this.goodsList = res.data

      this.editCateDialogVisible = true
    },
    // 添加分类楼层
    async addCate () {
      const confirmResult = await this.$confirm('是否添加新楼层?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return
      }

      const a = this.index
      this.editCateForm.cate.push({ _id: a, goods: [], name: '' })
      this.index++
    },
    // 修改分类楼层名称
    editCateName (info) {
      this.$prompt('请修改楼层名称', '修改楼层名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: info.name
      })
        .then(({ value }) => {
          if (value === '') {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          } else {
            for (let i = 0; i < this.editCateForm.cate.length; i++) {
              if (this.editCateForm.cate[i]._id === info._id) {
                this.editCateForm.cate[i].name = value
                return
              }
            }
          }
        })
        .catch(() => {})
    },
    // 显示分类楼层商品对话框
    async showAddCateGoodsDialog (_id) {
      this.currentFlootId = _id
      this.addCateGoodsDialogVisible = true
    },
    // 删除分类楼层商品
    async removeCateGoods (id, _id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      for (let i = 0; i < this.editCateForm.cate.length; i++) {
        if (this.editCateForm.cate[i]._id === id) {
          for (let j = 0; j < this.editCateForm.cate[i].goods.length; j++) {
            if (this.editCateForm.cate[i].goods[j]._id === _id) {
              this.editCateForm.cate[i].goods.splice(j, 1)
              return
            }
          }
        }
      }
    },
    // 删除分类楼层
    async removeCate (_id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该楼层, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      for (let i = 0; i < this.editCateForm.cate.length; i++) {
        if (this.editCateForm.cate[i]._id === _id) {
          this.editCateForm.cate.splice(i, 1)
          return
        }
      }
    },
    // 关闭添加分类楼层商品对话框
    closeAddCateGoodsDialog () {
      this.goods_id = []
    },
    // 添加分类楼层商品
    addCateGoods () {
      if (this.goods_id.length !== 2) {
        return this.$message.error('请选择商品')
      }

      for (let i = 0; i < this.editCateForm.cate.length; i++) {
        if (this.editCateForm.cate[i]._id === this.currentFlootId) {
          for (let j = 0; j < this.editCateForm.cate[i].goods.length; j++) {
            if (
              this.editCateForm.cate[i].goods[j]._id === this.goods_id[1]._id
            ) {
              return this.$message.error('该商品已存在')
            }
          }
          this.editCateForm.cate[i].goods.push(this.goods_id[1])
          return this.$message.success('添加成功')
        }
      }
    },
    // 修改分类楼层
    editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          'ad/cate',
          this.editCateForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getAdList()
        this.editCateDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  display: flex;
  flex-direction: row;
  justify-content: left;
}
.btn {
  margin-top: 170px;
  margin-left: 100px;
}
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
  display: flex;
  flex-direction: column;
  width: 375px;
  margin: 5px 0px;
}
.product {
  width: 375px;
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.goods {
  flex-wrap: wrap;
  width: 180px;
  margin-bottom: 5px;
  border-radius: 8px;
  border: 1.5px solid #cbccce;
  box-shadow: 0px 0px 7px #ededed;
}
.cate {
  width: 375px;
}
.cate_goods {
  display: flex;
  align-items: center;
  width: 375px;
  border: 1.5px solid #cbccce;
  box-shadow: 0px 0px 7px #ededed;
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
