<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const loggingOut = ref(false)

const logout = async () => {
  try {
    loggingOut.value = true

    const { error } = await supabase.auth.signOut()

    if (error) throw error

    router.push('/login')
  } catch (err: any) {
    alert(err.message)
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="container-fluid">
      <div class="row">

        <!-- Sidebar -->
        <aside class="col-lg-2 col-md-3 sidebar p-4">

          <!-- Logo -->
          <div class="text-center mb-5">
            <i
              class="bi bi-shop"
              style="font-size:42px;color:#0d6efd"
            ></i>

            <h3 class="text-white mt-3 fw-bold">
              MarketPlace
            </h3>

            <small class="text-secondary">
              Seller Dashboard
            </small>
          </div>

          <ul class="nav flex-column">

            <li class="nav-item">
              <RouterLink
                to="/auth/dashboard"
                class="nav-link"
              >
                <i class="bi bi-speedometer2 me-2"></i>
                Dashboard
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink
                to="/auth/my-products"
                class="nav-link"
              >
                <i class="bi bi-box-seam me-2"></i>
                My Products
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink
                to="/auth/products/edit/:id"
                class="nav-link"
              >
                <i class="bi bi-plus-circle me-2"></i>
                Add Product
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink
                to="/orders"
                class="nav-link"
              >
                <i class="bi bi-bag-check me-2"></i>
                Orders
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink
                to="/auth/profile"
                class="nav-link"
              >
                <i class="bi bi-person-circle me-2"></i>
                Profile
              </RouterLink>
            </li>

            <li class="nav-item">
              <button
                @click="logout"
                class="btn btn-danger w-100"
                :disabled="loggingOut"
              >
                <span
                  v-if="loggingOut"
                  class="spinner-border spinner-border-sm me-2"
                ></span>

                {{ loggingOut ? 'Logging out...' : 'Logout' }}
              </button>
            </li>

          </ul>

        </aside>

        <!-- Main Content -->
        <main class="col-lg-10 col-md-9 p-4">
          <RouterView />
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
    background:#111827;
    display:flex;
    flex-direction:column;
}

.nav{
    flex:1;
}

.nav-link{
    color:#d1d5db;
    padding:14px 18px;
    border-radius:12px;
    margin-bottom:10px;
    transition:all .3s ease;
    text-decoration:none;
    display:flex;
    align-items:center;
    font-weight:500;
}

.nav-link:hover{
    background:#1f2937;
    color:#fff;
}

.router-link-active{
    background:#0d6efd;
    color:#fff;
}

.btn-danger{
    border-radius:12px;
    padding:12px;
}

.card{
    border-radius:16px;
}

.stats-card{
    border:none;
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
}

.table th{
    font-weight:600;
}

.table td{
    vertical-align:middle;
}
</style>