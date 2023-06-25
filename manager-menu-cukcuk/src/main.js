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
import MagicNumberEnum from './resources/enums/MagicNumberEnum'
import TypeFilterEnum from './resources/enums/TypeFilterEnum'
import TypeBtnDialogEnum from './resources/enums/TypeBtnDialogEnum'
import TypeToolbarBtnEnum from './resources/enums/TypeToolbarBtnEnum'

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
globalProps.$MagicNumber = MagicNumberEnum
globalProps.$TypeFilterEnum = TypeFilterEnum
globalProps.$TypeBtnDialogEnum = TypeBtnDialogEnum
globalProps.$TypeToolbarBtnEnum = TypeToolbarBtnEnum

app.mount('#app')

export { globalProps }
