<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表 -->

      <el-table :data="catelist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="分类编号" prop="_id"></el-table-column>
        <el-table-column label="分类名称" prop="name" width="304px"></el-table-column>
        <el-table-column
          label="图片"
          prop="url"
          width="304px"
          class="pic"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-image style="width: 83.6px; height: 70.5px;" :src="scope.row.url" fit="fill"></el-image>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCateById(scope.row._id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model.trim="addCateForm.name"></el-input>
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
            <img v-if="addCateForm.url" :src="addCateForm.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类信息对话框 -->
    <el-dialog
      title="修改分类信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="url">
          <el-upload
            class="avatar-uploader"
            :action="uploadURL"
            :headers="headerObj"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.url" :src="editForm.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catelist: [],
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        name: '',
        url: ''
      },
      uploadURL: this.$http.defaults.baseURL + 'upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      addCateFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 5,
            message: '分类名称长度在1~5个字符之间',
            trigger: 'blur'
          }
        ],
        url: [{ required: true, message: '请上传分类图片', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: { name: '', url: '' },
      editFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 5,
            message: '分类名称长度在1~5个字符之间',
            trigger: 'blur'
          }
        ],
        url: [{ required: true, message: '请上传分类图片', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }

      this.catelist = res.data.data
      this.total = res.data.totalpage
    },
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击添加分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.message.error(res.meta.msg)
      }

      this.parentCateList = res.data
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog (_id) {
      const { data: res } = await this.$http.get('categories/' + _id)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    editCateInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm._id,
          {
            name: this.editForm.name,
            url: this.editForm.url
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editDialogVisible = false
        this.getCateList()
        this.$message.success(res.meta.msg)
      })
    },
    async removeCateById (_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete('categories/' + _id)

      if (res.meta.status !== 204) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getCateList()
    },
    // 添加分类上传图片成功
    handleAvatarSuccess (res, file) {
      this.addCateForm.url = res.data
    },
    // 修改分类上传图片成功
    handleAvatarSuccess1 (res, file) {
      this.editForm.url = res.data
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
    }
  }
}
</script>

<style scoped>
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
.el-icon-plus {
  line-height: 178px !important;
}
.el-icon-plus .avatar-uploader-icon {
  margin-top: 5px;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;

  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
