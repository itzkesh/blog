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
  <div class="marketplace-page">

    <!-- Hero -->
    <section class="hero-section">

      <div class="container">

        <div class="hero-content text-center">

          <span class="hero-badge">
            🛒 Welcome to the Marketplace
          </span>

          <h1 class="display-4 fw-bold mt-4">
            Discover Amazing Products
          </h1>

          <p class="hero-text">
            Shop thousands of quality products from trusted sellers across different categories.
          </p>

        </div>

      </div>

      <div class="hero-shape hero-shape-1"></div>
      <div class="hero-shape hero-shape-2"></div>

    </section>

    <div class="container py-5">

      <!-- Loading -->
      <div
        v-if="loading"
        class="text-center py-5"
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
        class="alert alert-info text-center"
      >
        No products available.
      </div>

      <!-- Categories -->
      <section
        v-for="category in productsByCategory"
        :key="category.id"
        class="category-section"
      >

        <div class="category-header">

          <div>

            <span class="category-badge">
              {{ category.products.length }} Products
            </span>

            <h2 class="mt-3">
              {{ category.name }}
            </h2>

          </div>

        </div>

        <div
          v-if="category.products.length === 0"
          class="empty-category"
        >
          No products available in this category.
        </div>

        <div
          v-else
          class="row g-4"
        >

          <div
            v-for="product in category.products"
            :key="product.id"
            class="col-xl-3 col-lg-4 col-md-6"
          >

            <div class="product-card">

              <div class="image-wrapper">

                <img
                  :src="product.image_url"
                  class="card-img-top"
                >

                <span class="new-badge">
                  New
                </span>

              </div>

              <div class="card-body">

                <h5>
                  {{ product.name }}
                </h5>

                <p class="description">
                  {{ product.description.substring(0,90) }}...
                </p>

                <div class="price-row">

                  <h4>
                    ₦{{ Number(product.price).toLocaleString() }}
                  </h4>

                  <span>
                    {{ product.quantity }} left
                  </span>

                </div>

                <RouterLink
                  :to="`/public-view/${product.id}`"
                  class="btn btn-shop w-100"
                >
                  View Product
                </RouterLink>
                <RouterLink
               :to="`/place-order/${product.id}`"
                class="btn btn-success btn-lg w-100"
>
               Buy Now
                 </RouterLink>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  </div>
</template>

<style scoped>

.marketplace-page{

    background:#f4f8ff;

    min-height:100vh;

}

/* HERO */

.hero-section{

    position:relative;

    overflow:hidden;

    padding:100px 0;

    background:linear-gradient(135deg,#2563eb,#4f46e5);

}

.hero-content{

    position:relative;

    z-index:2;

}

.hero-badge{

    display:inline-block;

    background:white;

    color:#2563eb;

    padding:10px 25px;

    border-radius:50px;

    font-weight:700;

    box-shadow:0 10px 30px rgba(0,0,0,.15);

}

.hero-section h1{

    color:white;

}

.hero-text{

    max-width:650px;

    margin:auto;

    color:#e5e7eb;

    font-size:18px;

}

.hero-shape{

    position:absolute;

    border-radius:50%;

    background:rgba(255,255,255,.08);

}

.hero-shape-1{

    width:350px;

    height:350px;

    top:-120px;

    left:-120px;

}

.hero-shape-2{

    width:280px;

    height:280px;

    bottom:-100px;

    right:-80px;

}

/* CATEGORY */

.category-section{

    margin-bottom:80px;

}

.category-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:35px;

}

.category-header h2{

    font-weight:700;

    color:#1f2937;

}

.category-badge{

    background:#dbeafe;

    color:#1d4ed8;

    padding:8px 18px;

    border-radius:50px;

    font-weight:600;

}

/* CARD */

.product-card{

    background:white;

    border-radius:22px;

    overflow:hidden;

    transition:.4s;

    box-shadow:0 15px 35px rgba(0,0,0,.08);

    height:100%;

}

.product-card:hover{

    transform:translateY(-12px);

    box-shadow:0 25px 60px rgba(0,0,0,.15);

}

.image-wrapper{

    position:relative;

    overflow:hidden;

    height:240px;

}

.card-img-top{

    width:100%;

    height:100%;

    object-fit:cover;

    transition:.5s;

}

.product-card:hover .card-img-top{

    transform:scale(1.08);

}

.new-badge{

    position:absolute;

    top:15px;

    right:15px;

    background:#ef4444;

    color:white;

    padding:8px 15px;

    border-radius:30px;

    font-size:13px;

    font-weight:600;

}

.card-body{

    padding:24px;

}

.card-body h5{

    font-weight:700;

    margin-bottom:10px;

}

.description{

    color:#6b7280;

    min-height:60px;

}

.price-row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin:25px 0;

}

.price-row h4{

    color:#2563eb;

    font-weight:700;

}

.price-row span{

    background:#dcfce7;

    color:#15803d;

    padding:6px 12px;

    border-radius:30px;

    font-size:13px;

    font-weight:600;

}

/* BUTTON */

.btn-shop{

    background:linear-gradient(135deg,#2563eb,#4f46e5);

    border:none;

    border-radius:12px;

    color:white;

    padding:12px;

    font-weight:600;

    transition:.3s;

}

.btn-shop:hover{

    transform:translateY(-3px);

    box-shadow:0 12px 30px rgba(37,99,235,.35);

}

/* EMPTY */

.empty-category{

    background:white;

    border-radius:15px;

    padding:40px;

    text-align:center;

    color:#6b7280;

    box-shadow:0 10px 25px rgba(0,0,0,.05);

}

/* ANIMATIONS */

.product-card{

    animation:fadeUp .7s ease;

}

.category-header{

    animation:slideIn .7s ease;

}

@keyframes fadeUp{

    from{

        opacity:0;

        transform:translateY(40px);

    }

    to{

        opacity:1;

        transform:translateY(0);

    }

}

@keyframes slideIn{

    from{

        opacity:0;

        transform:translateX(-40px);

    }

    to{

        opacity:1;

        transform:translateX(0);

    }

}

/* RESPONSIVE */

@media(max-width:768px){

    .hero-section{

        padding:70px 0;

    }

    .hero-section h1{

        font-size:2.2rem;

    }

    .image-wrapper{

        height:200px;

    }

}

</style>
