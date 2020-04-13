<template>
        <div class="aasd">
            <div class="clock">
                <p class="date">{{ date }}</p>
                <p class="time">{{ time }}</p>
                <p class="text">欢迎使用后台管理系统</p>
            </div>
        </div>
</template>

<script>
const schedule = require('node-schedule')

export default {
  data () {
    return {
      time: '',
      date: '',
      week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    }
  },
  created () {
    this.updateTime()
    const scheduleCronstyle = () => {
      schedule.scheduleJob('* * * * * *', () => {
        setInterval(this.updateTime, 0)
      })
    }

    scheduleCronstyle()
  },
  methods: {
    zeroPadding (num, digit) {
      var zero = ''
      for (var i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
    updateTime () {
      var cd = new Date()
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
      this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth() + 1, 2) + '-' + this.zeroPadding(cd.getDate(), 2) + ' ' + this.week[cd.getDay()]
    }

  }
}
</script>

<style lang="less">
p {
    margin: 0;
    padding: 0;
}
.aasd {
    height: 100%;
    width: 100%;
    background: #0f3854;
    background: radial-gradient(ellipse at center,  #293a4a  0%, #293a4a 70%);
    background-size: 100%;
    border-radius: 10px;
}
.clock {
    font-family: 'Share Tech Mono', monospace;
    color: #ffffff;
    text-align: center;
    position: absolute;
    left: 55%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #daf6ff;
    text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
    .time {
        letter-spacing: 0.05em;
        font-size: 80px;
        padding: 5px 0;
    }
    .date {
        letter-spacing: 0.1em;
        font-size: 24px;
    }
    .text {
        letter-spacing: 0.1em;
        font-size: 12px;
        padding: 20px 0 0;
    }
}
</style>
