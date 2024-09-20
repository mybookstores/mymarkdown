import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入element-plus依赖
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';




import '@/assets/global.css'





VMdEditor.use(githubTheme, {
    Hljs: hljs,
  });

createApp(App).use(store).use(router).use(VMdEditor).mount('#app')

