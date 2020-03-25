<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getAdminList">
            <el-button slot="append" icon="el-icon-search" @click="getAdminList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加管理员</el-button>
        </el-col>
      </el-row>
      <!-- 管理员列表 -->
      <el-table :data="adminlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="管理员名称" prop="name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role.name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.state" @change="adminStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeAdminById(scope.row._id)"
            ></el-button>
            <el-tooltip effect="light" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加管理员对话框 -->
    <el-dialog title="添加管理员" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改管理员信息对话框 -->
    <el-dialog
      title="修改管理员信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdminInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <el-row>
        <p>当前管理员：{{adminInfo.name}}</p>
      </el-row>
      <el-row>
        <p>当前角色：{{adminInfo.role.name}}</p>
      </el-row>
      <el-row>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </p>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      adminlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        name: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入管理员名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '管理员名的长度在2~20个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      setRoleDialogVisible: false,
      // 需要被分配角色的管理员信息
      adminInfo: { role: { name: '' } },
      // 所有角色信息
      rolesList: [],
      // 已选中的角色ID值
      selectedRoleId: ''
    }
  },
  created () {
    this.getAdminList()
  },
  methods: {
    async getAdminList () {
      const { data: res } = await this.$http.get('admins', {
        params: this.queryInfo
      })
      this.adminlist = res.data.data
      this.total = res.data.totalpage
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getAdminList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getAdminList()
    },
    async adminStateChanged (admininfo) {
      const { data: res } = await this.$http.put(
        `admins/${admininfo._id}/state/${admininfo.state}`
      )
      if (res.meta.status !== 200) {
        admininfo.state = !admininfo.state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addAdmin () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('admins', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getAdminList()
      })
    },
    // 点击修改管理员信息按钮
    async showEditDialog (_id) {
      const { data: res } = await this.$http.get('admins/' + _id)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改管理员信息对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改管理员信息并提交
    editAdminInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'admins/' + this.editForm._id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editDialogVisible = false
        this.getAdminList()
        this.$message.success(res.meta.msg)
      })
    },
    // 根据ID删除管理员信息
    async removeAdminById (_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该管理员, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete('admins/' + _id)

      if (res.meta.status !== 204) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getAdminList()
    },
    // 显示分配角色对话框
    async setRole (adminInfo) {
      this.adminInfo = adminInfo
      if (!adminInfo.role) this.adminInfo.role = { name: '' }

      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    // 更新管理员新角色
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(
        `admins/${this.adminInfo._id}/role`,
        {
          rid: this.selectedRoleId
        }
      )

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success(res.meta.msg)
      this.getAdminList()
      this.setRoleDialogVisible = false
    },
    // 关闭更新管理员角色对话框
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.adminInfo = { role: { name: '' } }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
