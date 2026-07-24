<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

interface Product {
  id: number
  seller_id: string
  name: string
  category: string
  price: number
  quantity: number
  image_url: string
  created_at: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const search = ref('')

const fetchProducts = async () => {
  loading.value = true

  // Get logged-in user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    loading.value = false
    return
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error.message)
  } else {
    products.value = data || []
  }

  loading.value = false
}

const deleteProduct = async (id: number) => {
  if (!confirm('Delete this product?')) return

  try {
    // Get the product first
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    console.log(product.image_url)
    // Delete image from Storage
    if (product?.image_url) {
      // Extract the file path from the public URL
      const imagePath = product.image_url.split('/products/')[1]

      console.log(imagePath)

      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from('products')
          .remove([imagePath])

        if (storageError) {
          console.error(storageError.message)
        }
      }
    }

    // Delete product from database
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    alert('Product deleted successfully.')

    fetchProducts()

  } catch (err: any) {
    alert(err.message)
  }
}

const filteredProducts = computed(() => {
  return products.value.filter(product =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(fetchProducts)
</script>

<template>
  <div class="container-fluid py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">

      <div>
        <h2 class="fw-bold mb-1">My Products</h2>
        <p class="text-muted">
          Manage your marketplace products
        </p>
      </div>

      <RouterLink
        to="/auth/products/add"
        class="btn btn-primary"
      >
        <i class="bi bi-plus-circle me-2"></i>
        Add Product
      </RouterLink>

    </div>

    <!-- Search -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">

        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search products..."
        >

      </div>
    </div>

    <!-- Products Table -->
    <div class="card border-0 shadow-sm">

      <div class="table-responsive">

        <table class="table table-hover align-middle mb-0">

          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Date</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr v-if="loading">
              <td colspan="8" class="text-center py-5">
                Loading products...
              </td>
            </tr>

            <tr
              v-for="(product, index) in filteredProducts"
              :key="product.id"
            >

              <td>{{ index + 1 }}</td>

              <td>
                <img
                  :src="product.image_url"
                  class="rounded"
                  width="60"
                  height="60"
                  style="object-fit:cover"
                >
              </td>

              <td>
                <strong>{{ product.name }}</strong>
              </td>

              <td>{{ product.category }}</td>

              <td>
                ₦{{ product.price.toLocaleString() }}
              </td>

              <td>{{ product.quantity }}</td>

              <td>{{ formatDate(product.created_at) }}</td>

              <td>

                <RouterLink
                  :to="`/products/${product.id}/edit`"
                  class="btn btn-sm btn-primary me-2"
                >
                  Edit
                </RouterLink>

                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteProduct(product.id)"
                >
                  Delete
                </button>

              </td>

            </tr>

            <tr
              v-if="!loading && filteredProducts.length === 0"
            >
              <td colspan="8" class="text-center py-5">
                No products found.
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>
</template>

<style scoped>
.card{
    border-radius:18px;
}

.table th{
    font-weight:600;
}

.table td{
    vertical-align:middle;
}

.form-control{
    border-radius:10px;
}

.btn{
    border-radius:10px;
}

img{
    border:1px solid #eee;
}
</style>