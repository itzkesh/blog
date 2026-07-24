import { createRouter, createWebHistory } from 'vue-router'
import {supabase} from "../lib/supabase"

import BlogPosts from '../views/BlogPosts.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import ForgotPassword from '../views/auth/ForgotPassword.vue'
import Dashboard from '../views/users/Dashboard.vue'

import AddProduct from '../views/users/AddProduct.vue'
import Profile from '../views/users/Profile.vue'
import MyProducts from '../views/users/MyProducts.vue'
import UserLayout from '../layout/UserLayout.vue'
import AdminLayout from '../layout/AdminUserLayout.vue'

const routes = [

    { path: '/', name: 'BlogPosts', component: BlogPosts },
    {
     path: '/',
     component: UserLayout,
     children: [
        { path: 'login', name: 'Login', component: Login },
        { path: 'register', name: 'Register', component: Register },
        { path: 'reset-password', name: 'ResetPassword', component: ResetPassword },
        { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPassword },
     ]
    },
    
    {
        path: '/auth',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children:[
            { path: 'dashboard', name: 'UserDashboard', component: Dashboard},
            { path: 'my-products', name: 'AdminMyProducts', component: MyProducts},
            { path: 'products/add', name: 'AdminAddProduct', component: AddProduct},
            { path: 'products/edit/:id', name: 'AdminEditProduct', component: AddProduct},
            { path: 'profile', name: 'AdminProfile', component: Profile }
        ]
    },
 
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to) => {
    if (! to.meta.requiresAuth) 
        return true

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) 
        return '/login'

    return true
    
})

export default router