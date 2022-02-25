import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 附件插件
// eslint-disable-next-line no-unused-vars
import { Boot, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import attachmentModule from '@wangeditor/plugin-upload-attachment'
// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(attachmentModule)

new Vue({
  render: h => h(App),
}).$mount('#app')
