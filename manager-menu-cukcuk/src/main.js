import './css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import emitter from 'tiny-emitter/instance'

import App from './App.vue'
import router from './router'
import ResourceNavbar from './resources/resource/ResourceNavbar'
import ResourceToolbarTable from './resources/resource/ResourceToolbarTable'
import EmitterEnum from './resources/enums/EmitterEnum'
import ResourceDialogForm from './resources/resource/ResourceDialogForm'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const globalProps = app.config.globalProperties
globalProps.$router = router
globalProps.$axios = axios
globalProps.$msemitter = emitter
// Enums
globalProps.$EmitterEnum = EmitterEnum

// Resources
globalProps.$ResourceNavbar = ResourceNavbar
globalProps.$ResourceToolbarTable = ResourceToolbarTable
globalProps.$ResourceDialogForm = ResourceDialogForm

app.mount('#app')

export { globalProps }
