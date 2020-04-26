<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList()">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3" >
          <el-button icon="el-icon-refresh" style="margin-left:100px;width:60px;" @click="refresh"></el-button>
        </el-col>
        <el-col :span="14">
          <el-radio-group v-model="queryInfo.radio" style="margin-left:100px" @change="changeRadio">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="待付款"></el-radio-button>
            <el-radio-button label="待发货"></el-radio-button>
            <el-radio-button label="待收货"></el-radio-button>
            <el-radio-button label="交易成功"></el-radio-button>
            <el-radio-button label="退款中"></el-radio-button>
            <el-radio-button label="交易关闭"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="收货人">
                <span>{{ scope.row.address.consignee}}</span>
              </el-form-item>
              <el-form-item label="手机号码">
                <span>{{ scope.row.address.mobile}}</span>
              </el-form-item>
              <el-form-item label="省市区/县">
                <span>{{ scope.row.address.region_name}}</span>
              </el-form-item>
              <el-form-item label="详细地址">
                <span>{{ scope.row.address.detail_address}}</span>
              </el-form-item>
              <el-form-item label="用户留言" v-if="scope.row.userWord!=='无'">
                <span>{{scope.row.userWord}}</span>
              </el-form-item>
              <el-form-item label="快递编号" v-if="scope.row.expressNumber">
                {{ scope.row.expressNumber}}
              </el-form-item>
              <el-form-item label="退款原因" v-if="scope.row.returnReason">
                {{ scope.row.returnReason}}
              </el-form-item>
              <el-form-item label="合计金额">
                <span v-if="scope.row.coupon">¥ {{scope.row.havedPaid}} = 商品价格:¥ {{Number(scope.row.totalPrice)}} + 总运费:¥ {{ scope.row.freight}} - 优惠券:¥ {{scope.row.coupon.money[1]}}</span>
                <span v-else>¥ {{scope.row.havedPaid}} = 商品价格:¥ {{Number(scope.row.totalPrice)}} + 总运费:¥ {{scope.row.freight}}</span>
              </el-form-item>
            </el-form>

            <el-table :data="scope.row.goods" border stripe>
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="商品名称" prop="name"></el-table-column>
              <el-table-column label="规格属性" prop="specification"></el-table-column>
              <el-table-column label="数量" prop="buyNumber"></el-table-column>
              <el-table-column label="单价" prop="unitPrice"></el-table-column>
              <el-table-column label="运费" prop="freight"></el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="_id"></el-table-column>
        <el-table-column label="用户编号" prop="openid"></el-table-column>
        <el-table-column label="实付款(元)" prop="havedPaid" width="110px"></el-table-column>
        <el-table-column label="状态" width="110px">
          <template v-slot="scope">
            <el-tag v-if="scope.row.state=='待付款'">待付款</el-tag>
            <el-tag type="warning" v-else-if="scope.row.state=='待发货'">待发货</el-tag>
            <el-tag v-else-if="scope.row.state=='待收货'">待收货</el-tag>
            <el-tag type="success" v-else-if="scope.row.state=='交易成功'">交易成功</el-tag>
            <el-tag type="danger" v-else-if="scope.row.state=='退款中'">退款中</el-tag>
            <el-tag type="info" v-else-if="scope.row.state=='交易关闭'">交易关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="150px"></el-table-column>
        <el-table-column label="待处理订单" width="110px">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="warning"
              v-if="scope.row.state=='待发货'"
              @click="showSend(scope.row._id)"
            >发货</el-button>
            <el-button
              size="mini"
              type="danger"
              v-else-if="scope.row.state=='退款中'"
              @click="shutDown(scope.row._id)"
            >关闭订单</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox(scope.row)"></el-button>
            <el-button v-if="scope.row.expressNumber"
              type="warning"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 发货对话框 -->
    <el-dialog title="发货" :visible.sync="sendVisible" width="50%" @close="sendDialogClosed">
      <el-form :model="sendForm" :rules="sendFormRules" ref="sendFormRef" label-width="100px">
        <el-form-item label="快递编号" prop="expressNumber">
          <el-input v-model.trim.trim="sendForm.expressNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendVisible = false">取消</el-button>
        <el-button type="primary" @click="sendGoods">确认发货</el-button>
      </span>
    </el-dialog>

    <!-- 修改订单信息对话框 -->
    <el-dialog
      title="修改订单信息"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model.trim="addressForm.consignee"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.trim="addressForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="省市区/县" prop="region_name">
          <el-input v-model.trim="addressForm.region_name"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail_address">
          <el-input v-model.trim="addressForm.detail_address"></el-input>
        </el-form-item>
        <el-form-item label="快递编号" prop="expressNumber">
          <el-input v-model.trim="addressForm.expressNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
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
        pagesize: 10,
        radio: '全部'
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        consignee: '',
        detail_address: '',
        mobile: '',
        region_name: '',
        expressNumber: ''
      },
      addressFormRules: {
        consignee: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' }
        ],
        detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        region_name: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        expressNumber: [
          { required: true, message: '请输入快递编号', trigger: 'blur' }
        ]
      },
      progressVisible: false,
      progressInfo: [],
      sendVisible: false,
      sendForm: { expressNumber: '' },
      sendFormRules: {
        expressNumber: [
          { required: true, message: '请输入快递编号', trigger: 'blur' }
        ]
      },
      current_id: ''
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.totalpage
      this.orderlist = res.data.data
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showBox (info) {
      this.addressForm.consignee = info.address.consignee
      this.addressForm.mobile = info.address.mobile
      this.addressForm.region_name = info.address.region_name
      this.addressForm.detail_address = info.address.detail_address
      this.addressForm.expressNumber = info.expressNumber
      this.current_id = info._id
      this.addressVisible = true
    },
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox (info) {
      const { data: res } = await this.$http.get(
        `orders/${info.expressNumber}/kuaidi`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.progressInfo = res.data
      this.progressVisible = true
    },
    sendDialogClosed () {
      this.$refs.sendFormRef.resetFields()
    },
    showSend (_id) {
      this.current_id = _id
      this.sendVisible = true
    },
    async sendGoods () {
      this.$refs.sendFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `orders/${this.current_id}/send`,
          this.sendForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getOrderList()
        this.sendVisible = false
      })
    },
    async shutDown (_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久关闭该订单, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消关闭该订单') }

      const { data: res } = await this.$http.put(`orders/${_id}/close`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getOrderList()
    },
    async editAddress () {
      this.$refs.addressFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `orders/${this.current_id}`,
          this.addressForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getOrderList()
        this.addressVisible = false
      })
    },
    changeRadio () {
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    refresh () {
      this.getOrderList()
    }
  }
}
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
