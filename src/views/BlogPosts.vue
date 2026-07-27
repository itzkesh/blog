<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  image_url: string
  category_id: number
  product_categories: Category
}

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')

const getData = async () => {
  loading.value = true

  const [{ data: categoryData }, { data: productData }] =
    await Promise.all([
      supabase
        .from('product_categories')
        .select('*')
        .order('name'),

      supabase
        .from('products')
        .select(`
          *,
          product_categories(*)
        `)
        .order('created_at', { ascending: false })
    ])

  categories.value = categoryData || []
  products.value = productData || []

  loading.value = false
}

const productsByCategory = computed(() => {
  return categories.value.map(category => ({
    ...category,
    products: products.value.filter(
      product => product.category_id === category.id
    )
  }))
})

onMounted(getData)

</script>

<template>
  <div class="container my-5">

    <div class="text-center mb-5">
      <h1 class="fw-bold">Marketplace</h1>
      <p class="text-muted">
        Discover products from trusted sellers.
      </p>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="d-flex justify-content-center py-5"
    >
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <!-- Empty -->
    <div
      v-else-if="products.length === 0"
      class="alert alert-info"
    >
      No products available.
    </div>

    <!-- Products -->
    <div
      v-else
      class="row g-4"
    >

      <div
    v-for="category in productsByCategory"
  :key="category.id"
  class="mb-5"
>
  <h2 class="fw-bold mb-4">
    {{ category.name }}
  </h2>

  <div class="row g-4">

    <div
      v-for="product in category.products"
      :key="product.id"
      class="col-lg-3 col-md-4 col-sm-6"
    >
      <div class="card h-100 shadow-sm border-0">

        <img
          :src="product.image_url"
          class="card-img-top"
          style="height:220px;object-fit:cover"
        >

        <div class="card-body d-flex flex-column">

          <h5>{{ product.name }}</h5>

          <p class="text-muted small">
            {{ product.description.substring(0,80) }}...
          </p>

          <div class="mt-auto">

            <h4 class="text-primary">
              ₦{{ Number(product.price).toLocaleString() }}
            </h4>

            <RouterLink
              :to="`/public-view/${product.id}`"
              class="btn btn-primary w-100"
            >
              View Product
            </RouterLink>

          </div>

        </div>

      </div>
    </div>

  </div>
</div>

    </div>

  </div>
</template>

<style scoped>
.card{
    transition:.3s;
    border-radius:18px;
}

.card:hover{
    transform:translateY(-8px);
    box-shadow:0 15px 40px rgba(0,0,0,.12);
}

.card-img-top{
    border-top-left-radius:18px;
    border-top-right-radius:18px;
}

.btn{
    border-radius:10px;
}
</style>