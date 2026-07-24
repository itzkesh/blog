<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

interface SellerProfile {
  id: string
  username: string
  email: string
  phone_number: string | null
  address: string | null
}

const profile = ref<SellerProfile | null>(null)
const loading = ref(true)

const getProfile = async () => {
  loading.value = true

  // Get the authenticated user
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error(authError?.message || 'User not found')
    loading.value = false
    return
  }

  // Fetch the user's profile
  const { data, error } = await supabase
    .from('seller_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error(error.message)
  } else {
    profile.value = data
  }

  loading.value = false
}

onMounted(() => {
  getProfile()
})
</script>

<template>
  <!-- Header -->
  <div class="d-flex justify-content-between align-items-center mb-5">
    <div>
      <h2 class="fw-bold">
         Dashboard 👋
      </h2>
<p class="text-muted" v-if="profile">
  Welcome back,
  <strong>{{ profile.username }}</strong>
</p>

<p class="text-muted" v-else>
  Loading profile...
</p>
    </div>

    <div class="d-flex gap-3">
      <input
        type="search"
        class="form-control"
        placeholder="Search products..."
        style="width:250px"
      >

      <RouterLink
        to="/auth/products/add"
        class="btn btn-primary"
      >
        <i class="bi bi-plus-lg me-2"></i>
        Add Product
      </RouterLink>
    </div>
  </div>

  <!-- Stats -->
  <div class="row g-4 mb-5">

    <div class="col-lg-3 col-md-6">
      <div class="card stats-card shadow-sm">
        <div class="card-body text-center">
          <div class="icon bg-primary mb-3">
            <i class="bi bi-box-seam"></i>
          </div>

          <h2>0</h2>
          <p>My Products</p>
        </div>
      </div>
    </div>

    <div class="col-lg-3 col-md-6">
      <div class="card stats-card shadow-sm">
        <div class="card-body text-center">
          <div class="icon bg-success mb-3">
            <i class="bi bi-bag-check"></i>
          </div>

          <h2>0</h2>
          <p>Orders</p>
        </div>
      </div>
    </div>

    <div class="col-lg-3 col-md-6">
      <div class="card stats-card shadow-sm">
        <div class="card-body text-center">
          <div class="icon bg-warning mb-3">
            <i class="bi bi-cash-stack"></i>
          </div>

          <h2>₦0</h2>
          <p>Revenue</p>
        </div>
      </div>
    </div>

    <div class="col-lg-3 col-md-6">
      <div class="card stats-card shadow-sm">
        <div class="card-body text-center">
          <div class="icon bg-danger mb-3">
            <i class="bi bi-heart"></i>
          </div>

          <h2>0</h2>
          <p>Wishlist</p>
        </div>
      </div>
    </div>

  </div>

  <!-- Recent Products -->
  <div class="card shadow-sm border-0">

    <div class="card-header bg-white d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        Recent Products
      </h5>

      <RouterLink
        to="/products"
        class="btn btn-sm btn-outline-primary"
      >
        View All
      </RouterLink>
    </div>

    <div class="table-responsive">
      <table class="table table-hover mb-0">

        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>iPhone 15 Pro</td>
            <td>Phones</td>
            <td>₦1,350,000</td>
            <td>8</td>

            <td>
              <RouterLink
                to="/products/1/edit"
                class="btn btn-sm btn-primary me-2"
              >
                Edit
              </RouterLink>

              <button class="btn btn-sm btn-danger">
                Delete
              </button>
            </td>
          </tr>

          <tr>
            <td>MacBook Air M3</td>
            <td>Laptops</td>
            <td>₦2,100,000</td>
            <td>5</td>

            <td>
              <RouterLink
                to="/products/2/edit"
                class="btn btn-sm btn-primary me-2"
              >
                Edit
              </RouterLink>

              <button class="btn btn-sm btn-danger">
                Delete
              </button>
            </td>
          </tr>

        </tbody>

      </table>
    </div>

  </div>
</template>