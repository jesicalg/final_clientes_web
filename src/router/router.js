import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import MyProfile from "../pages/MyProfile.vue"
import UserProfile from "../pages/UserProfile.vue"
import PrivateChat from "../pages/PrivateChat.vue"
import ControlPanel from "../pages/ControlPanel.vue"
import ProductForm from "../pages/ProductForm.vue"
import ProductService from "../pages/ProductService.vue"
import { createRouter, createWebHashHistory } from "vue-router";
import { subscribeToAuth } from "../service/auth"

export const PATHS = {
    HOME: '/',
    LOGIN: '/iniciar-sesion',
    SING_IN: '/crear-cuenta',
    PROFILE: '/perfil',
    HOSTING: '/hostings',
    USER_PROFILE: '/usuario',
    PRIVATE_CHAT: '/usuario/chat',
    CONTROL_PANEL: '/panel-control',
    NEW_PRODUCT_FORM: '/producto/nuevo',
    EDIT_PRODUCT_FORM: '/producto'
}

const routes = [
    { path: PATHS.HOME, component: Home, },
    { path: PATHS.LOGIN, component: Login, },
    { path: PATHS.SING_IN, component: Register, },
    { path: PATHS.PROFILE, component: MyProfile, meta: { requiredAuth: true, } },
    { path: PATHS.HOSTING, component: ProductService},
    { path: PATHS.USER_PROFILE + '/:id', component: UserProfile, meta: { requiredAuth: true, } },
    { path: PATHS.PRIVATE_CHAT + '/:id', component: PrivateChat, meta: { requiredAuth: true, } },
    { path: PATHS.CONTROL_PANEL, component: ControlPanel, meta: { requiredAuth: true, } },
    { path: PATHS.NEW_PRODUCT_FORM, component: ProductForm, meta: { requiredAuth: true, } },
    { path: PATHS.EDIT_PRODUCT_FORM + '/:id', component: ProductForm, meta: { requiredAuth: true, } },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let user = {
    id: null,
    email: null,
}

subscribeToAuth(newUser => user = newUser);

router.beforeEach((to, from) => {
    if (to.meta.requiredAuth && user.id === null) {
        return {
            path: PATHS.LOGIN,
        }
    }
})

export default router;