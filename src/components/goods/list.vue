<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格  -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-button type="primary" @click="showAddDialog(scope.row._id)">添加规格</el-button>
            <el-table :data="scope.row.specification" border stripe>
              <el-table-column label="规格">
                <el-table-column label="属性名称" prop="name"></el-table-column>
                <el-table-column label="价格(元)" prop="price"></el-table-column>
                <el-table-column label="库存(件)" prop="stock"></el-table-column>
                <el-table-column label="运费(元)" prop="freight"></el-table-column>
                <el-table-column label="操作" width="172px">
                  <template slot-scope="Scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditSDialog(scope.row._id,Scope.row)"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeSByid(scope.row._id,Scope.row._id)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
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
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="goodsStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="172px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog1(scope.row)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeByid(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改商品基本信息对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible1"
      width="50%"
      @close="editDialogClosed1"
    >
      <el-form ref="editFormRef1" :model="editForm1" :rules="editFormRules1" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="editForm1.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="url">
          <el-upload
            class="avatar-uploader"
            :action="uploadURL"
            :headers="headerObj"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm1.url" :src="editForm1.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="editForm1.desc"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categories">
          <el-select v-model="editForm1.categories" placeholder="请选择">
            <el-option
              v-for="item in cateList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品详情信息对话框 -->
    <el-dialog
      title="修改商品详情信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="轮播图" prop="swiperUrl">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :file-list="editForm.swiperUrl"
            :headers="headerObj"
            list-type="picture"
            :limit="5"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图" prop="urls">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-success="handleSuccess1"
            :on-remove="handleRemove1"
            :file-list="editForm.urls"
            :headers="headerObj"
            list-type="picture"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加规格对话框 -->
    <el-dialog title="添加规格" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="addForm.price" :precision="2" :step="10" :max="9999" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="addForm.stock" :step="10" :max="9999" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="运费" prop="freight">
          <el-input-number v-model="addForm.freight" :precision="2" :step="10" :max="999" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSpecification">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改规格对话框 -->
    <el-dialog title="修改规格" :visible.sync="editSDialogVisible" width="40%">
      <el-form ref="editSFormRef" :model="editSForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="editSForm.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="editSForm.price" :precision="2" :step="10" :max="9999" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="editSForm.stock" :step="10" :max="9999" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="运费" prop="freight">
          <el-input-number
            v-model="editSForm.freight"
            :precision="2"
            :step="10"
            :max="999"
            :min="0"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSpecification">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询对象参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodslist: [],
      total: 0,
      addDialogVisible: false,
      addForm: { name: '', price: '', stock: '', freight: '' },
      addFormRules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '属性名称的长度在1~20个字符之间',
            trigger: 'blur'
          }
        ],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
        freight: [{ required: true, message: '请输入运费', trigger: 'blur' }]
      },
      current_id: '',
      current_s_id: '',
      editSDialogVisible: false,
      editSForm: { name: '', price: '', stock: '', freight: '' },
      editForm1: { name: '', url: '', desc: '', categories: '' },
      editFormRules1: {
        name: [
          { required: true, message: '请输商品名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '商品名称的长度在1~20个字符之间',
            trigger: 'blur'
          }
        ],
        desc: [
          { required: true, message: '请输商品描述', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '商品描述的长度在1~50个字符之间',
            trigger: 'blur'
          }
        ],
        url: [{ required: true, message: '请商品上传图片', trigger: 'blur' }],
        categories: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      editDialogVisible1: false,
      uploadURL: 'http://127.0.0.1:8888/admin/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      editDialogVisible: false,
      editForm: { swiperUrl: [], urls: [] },
      editFormRules: {
        swiperUrl: [{ required: true, message: '请上传商品轮播图', trigger: 'blur' }],
        urls: [{ required: true, message: '请上传商品详情图', trigger: 'blur' }]
      },
      fileList: [],
      previewVisible: false,
      previewPath: ''
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.goodslist = res.data.data
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    async removeByid (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 204) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    goAddpage () {
      this.$router.push('goods/add')
    },
    showAddDialog (_id) {
      this.current_id = _id
      this.addDialogVisible = true
    },
    // 关闭添加商品规格窗口
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加商品规格
    addSpecification () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `goods/${this.current_id}/specification`,
          this.addForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)

        // 找到当前对象规格数组并插入新元素
        for (let i = 0; i < this.goodslist.length; i++) {
          if (this.goodslist[i]._id === this.current_id) {
            this.goodslist[i].specification = res.data
            break
          }
        }
        this.addDialogVisible = false
      })
    },
    // 显示修改规格窗口
    showEditSDialog (_id, form) {
      this.current_id = _id
      this.current_s_id = form._id
      this.editSForm.name = form.name
      this.editSForm.price = form.price
      this.editSForm.stock = form.stock
      this.editSForm.freight = form.freight
      this.editSDialogVisible = true
    },
    // 修改规格
    async editSpecification () {
      this.$refs.editSFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          `/goods/${this.current_id}/specification/${this.current_s_id}`,
          this.editSForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)

        for (let i = 0; i < this.goodslist.length; i++) {
          if (this.goodslist[i]._id === this.current_id) {
            this.goodslist[i].specification = res.data
            break
          }
        }

        this.editSDialogVisible = false
      })
    },
    // 删除指定规格
    async removeSByid (_id, sId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该规格, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete(
        `/goods/${_id}/specification/${sId}`
      )
      if (res.meta.status !== 204) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)

      for (let i = 0; i < this.goodslist.length; i++) {
        if (this.goodslist[i]._id === _id) {
          this.goodslist[i].specification = res.data
          break
        }
      }
    },
    // 更改商品状态
    async goodsStateChanged (goodsinfo) {
      const { data: res } = await this.$http.put(
        `goods/${goodsinfo._id}/state/${goodsinfo.state}`
      )
      if (res.meta.status !== 200) {
        goodsinfo.state = !goodsinfo.state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 打开修改商品基本信息窗口
    async showEditDialog1 (info) {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.cateList = res.data
      this.editForm1.name = info.name
      this.editForm1.url = info.url
      this.editForm1.desc = info.desc
      if (info.categories) {
        this.editForm1.categories = info.categories._id
      } else {
        this.editForm1.categories = ''
      }
      this.current_id = info._id
      this.editDialogVisible1 = true
    },
    // 关闭修改商品基本信息窗口
    editDialogClosed1 () {
      this.$refs.editFormRef1.resetFields()
    },
    // 上传图片成功
    handleAvatarSuccess (res, file) {
      this.editForm1.url = res.data
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
    // 提交修改商品基本信息
    async editGoodsInfo1 () {
      this.$refs.editFormRef1.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `goods/${this.current_id}`,
          this.editForm1
        )

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        this.getGoodsList()

        this.$message.success(res.meta.msg)
        this.editDialogVisible1 = false
      })
    },
    // 显示修改商品详情信息窗口
    showEditDialog (info) {
      for (let i = 0; i < info.swiperUrl.length; i++) {
        this.editForm.swiperUrl.push({
          name: '商品轮播图片',
          url: info.swiperUrl[i]
        })
      }
      for (let i = 0; i < info.urls.length; i++) {
        this.editForm.urls.push({ name: '商品详情图片', url: info.urls[i] })
      }
      this.current_id = info._id
      this.editDialogVisible = true
    },
    // 关闭修改商品详情信息窗口
    editDialogClosed () {
      this.editForm = { swiperUrl: [], urls: [] }
    },
    // 修改商品详情信息
    async editGoodsInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          `goods/${this.current_id}/detail`,
          this.editForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getGoodsList()
        this.editDialogVisible = false
      })
    },
    // 添加swiperUrl照片
    handleSuccess (res, file) {
      var temp = {
        name: file.name,
        url: res.data
      }
      this.editForm.swiperUrl.push(temp)
    },
    // 删除swiperUrl照片
    handleRemove (file) {
      for (let i = 0; i < this.editForm.swiperUrl.length; i++) {
        if (this.editForm.swiperUrl[i].url === file.url) {
          this.editForm.swiperUrl.splice(i, 1)
          break
        }
      }
    },
    // 点击图片名称
    handlePreview (file) {
      this.previewPath = file.url
      this.previewVisible = true
    },
    // 商品图片上传成功
    handleSuccess1 (res, file) {
      var temp = {
        name: file.name,
        url: res.data
      }
      this.editForm.urls.push(temp)
    },
    // 删除商品图片
    handleRemove1 (file) {
      for (let i = 0; i < this.editForm.urls.length; i++) {
        if (this.editForm.urls[i].url === file.url) {
          this.editForm.urls.splice(i, 1)
          break
        }
      }
    }
  }
}
</script>

<style lang="less">
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
  width: 111px;
  height: 94px;
  line-height: 94px;
  text-align: center;
}
.avatar {
  width: 111px;
  height: 94px;
  display: block;
}
.previewImg {
  width: 100%;
}
</style>
