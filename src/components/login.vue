<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">管理员登录</div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="form"
      >
        <el-form-item prop="name">
          <el-input
            v-model="loginForm.name"
            prefix-icon="iconfont icon-user"
            clearable
            maxlength="20"
            placeholder="管理员名称"
            class="dialog-input-text"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
            maxlength="15"
            placeholder="密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="but" type="primary" @click="login">登录</el-button>
          <!-- :loading="true" -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        name: 'auroralorigin',
        password: 'guiji11'
      },
      loginFormRules: {
        name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '管理员名称长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #293a4a;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
  height: 400px;
  background-color: #293a4a;
  border-radius: 6px;
  .avatar_box {
    font-size: 23px;
    color: #e9f3f4;
    margin-bottom: 30px;
  }
  .el-input /deep/ .el-input__inner {
    background-color: #243443;
    color: #e9f3f4;
    border-color: #384959;
  }
  .form {
    width: 100%;
    .but {
      width: 100%;
      background-color: #79c0fe;
      color: #e9f3f4;
    }
  }
}
</style>
