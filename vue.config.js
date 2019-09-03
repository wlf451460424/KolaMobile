const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const resolve = (dir) => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
module.exports = {
  publicPath: process.env.BASE_URL,
  outputDir: process.env.outputDir || 'dist',
  assetsDir: 'static',
  lintOnSave: !IS_PROD,
  runtimeCompiler: false,
  productionSourceMap: !IS_PROD,
  parallel: require('os').cpus().length > 1,
  pwa: {},
  devServer: {
    open: false, // 是否自动打开浏览器页面
    // host: '0.0.0.0', // 指定使用一个 host，默认是 localhost
    port: 8079, // 端口地址
    https: false, // 不使用https提供服务
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    proxy: {
      '/api': {
        target: process.env.VUE_APP_HOST,
        ws: false, // 是否启用websockets
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api/player': '/player/api/player',
          '^/api/metadata': '/metadata/api/metadata'
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.extensions
      .add('.vue')
      .add('.js')
      .add('.css')
      .add('.json')
      .add('.scss')
      .add('.styl')

    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@common', resolve('src/common'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@filters', resolve('src/filters'))
      .set('@layouts', resolve('src/layouts'))
      .set('@locale', resolve('src/locale'))
      .set('@mixins', resolve('src/mixins'))
      .set('@plugins', resolve('src/plugins'))
      .set('@router', resolve('src/router'))
      .set('@store', resolve('src/store'))
      .set('@styles', resolve('src/styles'))
      .set('@utils', resolve('src/utils'))
      .set('@views', resolve('src/views'))

    // 修复HMR
    config.resolve.symlinks(true)

    config.plugin('html').tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = 'none'
      return args
    })
    return config
  },
  configureWebpack: config => {
    // 生产环境打包分析体积
    if (IS_PROD) {
      const plugins = []
      if (process.env.VUE_APP_MODE === 'production') {
        plugins.push(new BundleAnalyzerPlugin())
      }
      plugins.push(new TerserPlugin({
        terserOptions: {
          cache: true,
          parallel: true,
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        }
      }))

      // 开启gzip压缩
      const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config.plugins = [
        ...config.plugins,
        ...plugins
      ]
    } else {
      config.devtool = 'source-map'
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
    loaderOptions: {
      sass: {
        data: `
        @import "@styles/mixin.scss";
        @import "@styles/_var.scss";
        @import "@styles/lottery_css.scss";
        `
      },
      stylus: {
        'resolve url': true,
        'import': [
          './src/plugins/cube/theme'
        ]
      },
      less: {

      }
    }
  },
  // 三方插件配置
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  }
}
