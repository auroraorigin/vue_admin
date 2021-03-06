module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'favion.ico',
      favicon16: 'favion.ico',
      appleTouchIcon: 'favion.ico',
      maskIcon: 'favion.ico',
      msTileImage: 'favion.ico'
    }
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })

    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        moment: 'moment',
        'moment-timezone': 'moment'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
  }
}
