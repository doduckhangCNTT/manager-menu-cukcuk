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
import ResourceToast from './resources/resource/ResourceToast'
import MagicNumberEnum from './resources/enums/MagicNumberEnum'
import TypeFilterEnum from './resources/enums/TypeFilterEnum'
import TypeBtnDialogEnum from './resources/enums/TypeBtnDialogEnum'
import TypeToolbarBtnEnum from './resources/enums/TypeToolbarBtnEnum'
import HttpStatusCodeEnum from './resources/enums/HttpStatusCodeEnum'
import TypeComboboxEnum from './resources/enums/TypeComboboxEnum'
import EntityNameEnum from './resources/enums/EntityNameEnum'
import ContentPopup from './resources/contents/ContentPopup'
import BehaviorHandleEnum from './resources/enums/BehaviorHandleEnum'

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
globalProps.$HttpStatusCodeEnum = HttpStatusCodeEnum
globalProps.$TypeComboboxEnum = TypeComboboxEnum
globalProps.$EntityNameEnum = EntityNameEnum
globalProps.$ContentPopup = ContentPopup
globalProps.$BehaviorHandleEnum = BehaviorHandleEnum
globalProps.$ResourceToast = ResourceToast

app.mount('#app')

export { globalProps }
