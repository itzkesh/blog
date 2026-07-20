<script setup lang="ts">
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const logout = async () => {

  const { error } = await supabase.auth.signOut()

  if (error) {
    alert(error.message)
  } else {
    router.push('/login')
  }

}
</script>

<template>
    <div class="dashboard">
    <div class="container-fluid">
      <div class="row">

        <!-- Sidebar -->
        <aside class="col-lg-2 col-md-3 sidebar p-4">

          <h3 class="text-white fw-bold mb-5">
            The Blog
          </h3>

          <ul class="nav flex-column">

            <li class="nav-item">
              <RouterLink to="/admin/dashboard" class="nav-link">
                <i class="bi bi-grid me-2"></i>
                Dashboard
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink to="/admin/posts" class="nav-link">
                <i class="bi bi-journal-text me-2"></i>
                All Posts
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink to="/admin/posts/new" class="nav-link">
                <i class="bi bi-plus-circle me-2"></i>
                New Post
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink to="/admin/profile" class="nav-link">
                <i class="bi bi-person-circle me-2"></i>
                Profile
              </RouterLink>
            </li>

            <li class="nav-item">
              <button @click="logout" class="btn btn-danger w-100">
                <i class="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </li>

          </ul>


        </aside>

        <!-- Main Content -->
        <main class="col-lg-10 col-md-9 p-4">
          <router-view />
        </main>

      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard{
    min-height:100vh;
    background:#f5f7fb;
}

.sidebar{
    min-height:100vh;
    background:#1f2937;
    display:flex;
    flex-direction:column;
}

.nav-link{
    color:#d1d5db;
    padding:14px;
    border-radius:10px;
    margin-bottom:10px;
    transition:.3s;
    text-decoration:none;
}

.nav-link:hover{
    background:#374151;
    color:#fff;
}

.router-link-active{
    background:#0d6efd;
    color:#fff;
}

.stats-card{
    border:none;
    border-radius:16px;
}

.icon{
    width:60px;
    height:60px;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:14px;
    color:#fff;
    font-size:24px;
    margin-bottom:20px;
}

.card{
    border-radius:16px;
}

.table th{
    font-weight:600;
}

.table td{
    vertical-align:middle;
}
</style>
