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

interface Product {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string | null
  product_categories?: {
    name: string
  } | null
}

const profile = ref<SellerProfile | null>(null)

const recentProducts = ref<Product[]>([])

const loading = ref(true)
const loadingProducts = ref(true)

const totalProducts = ref(0)
// const totalStock = ref(0)
const totalValue = ref(0)

const getDashboard = async () => {
  loading.value = true
  loadingProducts.value = true

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    loading.value = false
    loadingProducts.value = false
    return
  }

  // Seller profile
  const { data: profileData } = await supabase
    .from('seller_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  profile.value = profileData

  // Recent products
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      product_categories(name)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  recentProducts.value = products || []

  // Dashboard statistics
  const { data: stats } = await supabase
    .from('products')
    .select('price, quantity')
    .eq('seller_id', user.id)

  totalProducts.value = stats?.length || 0

  // totalStock.value =
  //   stats?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0

  totalValue.value =
    stats?.reduce(
      (sum, item) =>
        sum + Number(item.price) * (item.quantity || 0),
      0
    ) || 0

  loading.value = false
  loadingProducts.value = false
}

onMounted(() => {
  getDashboard()
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

          <h2>{{ totalProducts }}</h2>
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

<tr v-if="loadingProducts">
  <td colspan="5" class="text-center py-5">
    Loading products...
  </td>
</tr>

<tr
  v-else-if="recentProducts.length === 0"
>
  <td colspan="5" class="text-center py-5">
    No products found.
  </td>
</tr>

<tr
  v-for="product in recentProducts"
  :key="product.id"
>

  <td>

    <div class="d-flex align-items-center">

      <img
        :src="product.image_url ?? undefined"
        width="60"
        height="60"
        class="rounded me-3"
        style="object-fit:cover"
      >

      <strong>{{ product.name }}</strong>

    </div>

  </td>

  <td>
    {{ product.product_categories?.name }}
  </td>

  <td>
    ₦{{ Number(product.price).toLocaleString() }}
  </td>

  <td>
    {{ product.quantity }}
  </td>

  <td>

    <RouterLink
      :to="`/auth/my-product/${product.id}`"
      class="btn btn-sm btn-outline-primary me-2"
    >
      View
    </RouterLink>

    <RouterLink
      :to="`/auth/edit/${product.id}`"
      class="btn btn-sm btn-primary"
    >
      Edit
    </RouterLink>

  </td>

</tr>

</tbody>

      </table>
    </div>

  </div>
</template>