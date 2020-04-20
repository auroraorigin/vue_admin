<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤 -->
      <el-steps :space="330" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品规格"></el-step>
        <el-step title="商品详情"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" tab-position="left">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model.trim="addForm.name"></el-input>
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
                <img v-if="addForm.url" :src="addForm.url" class="avatar" />
                <i v-else class="avatar-uploader-icon">+</i>
              </el-upload>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input v-model.trim="addForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categories">
              <el-select v-model="addForm.categories" placeholder="请选择">
                <el-option
                  v-for="item in cateList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品规格" name="1">
            <el-form-item label="商品规格" prop="specification">
              <el-button type="primary" @click="addSDialogVisible = true">添加规格</el-button>
              <el-table :data="addForm.specification" border stripe>
                <el-table-column label="规格">
                  <el-table-column label="属性名称" prop="name"></el-table-column>
                  <el-table-column label="价格(元)" prop="price"></el-table-column>
                  <el-table-column label="库存(件)" prop="stock"></el-table-column>
                  <el-table-column label="运费(元)" prop="freight"></el-table-column>
                  <el-table-column label="操作" width="65px">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="removeS(scope.row)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品详情" name="2">

            <el-form-item label="轮播图" prop="swiperUrl">
              <el-upload
                class="upload-demo"
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="addForm.swiperUrl"
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
                :file-list="addForm.urls"
                :headers="headerObj"
                list-type="picture"
                :before-upload="beforeAvatarUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-form-item>

            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>

          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>

    <!-- 添加规格对话框 -->
    <el-dialog title="添加规格" :visible.sync="addSDialogVisible" width="40%">
      <el-form ref="addSFormRef" :model="addSForm" :rules="addSFormRules" label-width="100px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model.trim="addSForm.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model.trim="addSForm.price" :precision="2" :step="10" :max="9999" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model.trim="addSForm.stock" :step="10" :max="9999" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="运费" prop="freight">
          <el-input-number v-model.trim="addSForm.freight" :precision="2" :step="10" :max="999" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSpecification">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      addForm: {
        name: '',
        url: '',
        desc: '',
        categories: '',
        specification: [],
        swiperUrl: [],
        urls: []
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '商品名称的长度在1~20个字符之间',
            trigger: 'blur'
          }
        ],
        desc: [
          { required: true, message: '请输入商品描述', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '商品描述的长度在1~50个字符之间',
            trigger: 'blur'
          }
        ],
        url: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
        categories: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '请添加商品规格', trigger: 'blur' }
        ],
        swiperUrl: [
          { required: true, message: '请上传商品轮播图', trigger: 'blur' }
        ],
        urls: [
          { required: true, message: '请上传商品详情图', trigger: 'blur' }
        ]
      },
      uploadURL: this.$http.defaults.baseURL + 'upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      cateList: [],
      previewPath: '',
      previewVisible: false,
      addSDialogVisible: false,
      addSForm: { name: '', price: '', stock: '', freight: '' },
      addSFormRules: {
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
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$messgae.error(res.meta.msg)
      }

      this.cateList = res.data
    },
    // 上传图片成功
    handleAvatarSuccess (res, file) {
      this.addForm.url = res.data
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
    // 添加新规格
    addSpecification () {
      this.$refs.addSFormRef.validate(async valid => {
        if (!valid) return
        this.addForm.specification.push(this.addSForm)
        this.addSForm = { name: '', price: '', stock: '', freight: '' }
        this.addSDialogVisible = false
      })
    },
    // 删除规格
    removeS (info) {
      var i
      for (i = 0; i < this.addForm.specification.length; i++) {
        if (
          this.addForm.specification[i].name === info.name &&
          this.addForm.specification[i].price === info.price &&
          this.addForm.specification[i].stock === info.stock &&
          this.addForm.specification[i].freight === info.freight
        ) {
          break
        }
      }
      this.addForm.specification.splice(i, 1)
    },
    // 点击图片名称
    handlePreview (file) {
      this.previewPath = file.url
      this.previewVisible = true
    },
    // 添加swiperUrl照片
    handleSuccess (res, file) {
      var temp = {
        name: file.name,
        url: res.data
      }
      this.addForm.swiperUrl.push(temp)
    },
    // 删除swiperUrl照片
    handleRemove (file) {
      for (let i = 0; i < this.addForm.swiperUrl.length; i++) {
        if (this.addForm.swiperUrl[i].url === file.url) {
          this.addForm.swiperUrl.splice(i, 1)
          break
        }
      }
    },
    // 商品图片上传成功
    handleSuccess1 (res, file) {
      var temp = {
        name: file.name,
        url: res.data
      }
      this.addForm.urls.push(temp)
    },
    // 删除商品图片
    handleRemove1 (file) {
      for (let i = 0; i < this.addForm.urls.length; i++) {
        if (this.addForm.urls[i].url === file.url) {
          this.addForm.urls.splice(i, 1)
          break
        }
      }
    },

    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }

        var goods = JSON.parse(JSON.stringify(this.addForm))
        goods.swiperUrl = []
        goods.urls = []
        // 将图片对象转换为数组
        for (let i = 0; i < this.addForm.swiperUrl.length; i++) {
          goods.swiperUrl.push(this.addForm.swiperUrl[i].url)
        }

        for (let i = 0; i < this.addForm.urls.length; i++) {
          goods.urls.push(this.addForm.urls[i].url)
        }

        const { data: res } = await this.$http.post('goods', goods)

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
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
  display: flex;
  align-items: center;
  font-size: 50px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  justify-content: center;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
