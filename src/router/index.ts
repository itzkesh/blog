import { createRouter, createWebHistory } from 'vue-router'

import BlogPosts from '../views/BlogPosts.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import ForgotPassword from '../views/auth/ForgotPassword.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import NewPost from '../views/admin/NewPost.vue'
import EditPost from '../views/admin/EditPost.vue'
import Profile from '../views/admin/Profile.vue'
import AdminPosts from '../views/admin/AdminPosts.vue'
import UserLayout from '../layout/UserLayout.vue'
import AdminLayout from '../layout/AdminLayout.vue'

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
        path: '/admin',
        component: AdminLayout,
        children:[
            { path: 'dashboard', name: 'AdminDashboard', component: Dashboard},
            { path: 'posts', name: 'AdminPosts', component: AdminPosts},
            { path: 'posts/new', name: 'AdminNewPost', component: NewPost},
            { path: 'post/:id/edit', name: 'AdminEditPost', component: EditPost },
            { path: 'profile', name: 'AdminProfile', component: Profile }
        ]
    },
 
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router