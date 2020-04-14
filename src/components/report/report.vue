<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 1000px;height:400px;"></div>
      <div id="pmain" style="width: 1000px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      option: {
        title: {
          text: '各月份营业额',
          subtext: 'Monthly turnover'
        },
        xAxis: {
          axisLabel: {
            inside: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                  ]
                )
              }
            }
          }
        ]
      },
      poption: {
        title: {
          text: '客户来源',
          subtext: 'customers location'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          top: 50
        },
        series: [
          {
            name: '客户来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            }
          }
        ]
      }
    }
  },
  created () {},
  methods: {},
  async mounted () {
    // 柱状图
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/zhuzhuangtu')
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    const result = _.merge(res.data, this.option)

    myChart.setOption(result)

    var temp = result
    var zoomSize = 6
    myChart.on('click', function (params) {
      myChart.dispatchAction({
        type: 'dataZoom',
        startValue: temp.xAxis.data[Math.max(params.dataIndex - zoomSize / 2, 0)],
        endValue: temp.xAxis.data[Math.min(params.dataIndex + zoomSize / 2, temp.series[1].data.length - 1)]
      })
    })

    // 饼状图
    var pmyChart = echarts.init(document.getElementById('pmain'))
    const { data: Pres } = await this.$http.get('reports/bingzhuangtu')
    if (Pres.meta.status !== 200) {
      return this.$message.error(Pres.meta.msg)
    }
    const presult = _.merge(Pres.data, this.poption)
    pmyChart.setOption(presult)
  }
}
</script>

<style lang="less" scoped>
</style>
