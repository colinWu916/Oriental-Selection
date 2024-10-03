import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:svg-icons-register'
import '@/styles/index.scss'
import gloalComponent from '@/components'
import router from './router'
import pinia from './store'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(router)
app.use(gloalComponent)
import './permisstion';
app.mount('#app')
