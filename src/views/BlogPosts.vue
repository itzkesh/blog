<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

const search = ref('')

const addProduct = (product: any) => {
  cart.addToCart({
    id: product.id,
    seller_id: product.seller_id,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url,
    quantity: 1
  })

  alert('Product added to cart!')
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  seller_id: string
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

const filteredProducts = computed(() => {
  if (!search.value) return products.value

  return products.value.filter(product =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const productsByCategory = computed(() => {
  return categories.value.map(category => ({
    ...category,
    products: filteredProducts.value.filter(
      product => product.category_id === category.id
    )
  }))
})

onMounted(getData)
</script>

<template>

<div class="marketplace">

  <!-- HERO -->

  <section class="hero">

    <div class="container">

      <div class="row align-items-center">

        <div class="col-lg-6">

          <span class="hero-tag">
            TRENDING NOW
          </span>

          <h1 class="hero-title">
            Discover Products
            <br>
            You'll Love
          </h1>

          <p class="hero-text">
            Shop the latest products from trusted sellers.
            Browse electronics, fashion, automobiles,
            beauty, furniture and much more.
          </p>

          <div class="hero-buttons">

            <RouterLink
              to="#products"
              class="btn btn-warning btn-lg"
            >
              Shop Now
            </RouterLink>

            <button
              class="btn btn-light btn-lg ms-3"
            >
              Explore Categories
            </button>

          </div>

          <div class="hero-stats mt-5">

            <div>

              <h3>{{ products.length }}+</h3>

              <small>Products</small>

            </div>

            <div>

              <h3>{{ categories.length }}</h3>

              <small>Categories</small>

            </div>

            <div>

              <h3>100%</h3>

              <small>Trusted Sellers</small>

            </div>

          </div>

        </div>

        <!-- HERO IMAGE -->

        <div class="col-lg-6">

          <div class="hero-image">

            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900"
              class="img-fluid rounded-5"
            >

            <div class="floating-card card-one">

              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"
              >

              <div>

                <h6>Nike Air Max</h6>

                <small>₦299,000</small>

              </div>

            </div>

            <div class="floating-card card-two">

              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"
              >

              <div>

                <h6>iPhone</h6>

                <small>₦1,200,000</small>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>

  <!-- SEARCH -->

  <section class="container py-5">

    <div class="search-box">

      <i class="bi bi-search"></i>

      <input
        v-model="search"
        class="form-control"
        placeholder="Search for products..."
      >

      <RouterLink
        to="/cart"
        class="btn btn-dark position-relative"
      >

        <i class="bi bi-cart3"></i>

        <span
          v-if="cart.totalItems"
          class="badge bg-danger position-absolute top-0 start-100 translate-middle"
        >
          {{ cart.totalItems }}
        </span>

      </RouterLink>

    </div>

  </section>

  <!-- PRODUCTS -->

<section
  id="products"
  class="container pb-5"
>

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
    class="alert alert-info"
  >
    No products found.
  </div>

  <!-- CATEGORY LOOP -->

  <section
    v-for="category in productsByCategory"
    :key="category.id"
    class="mb-5"
  >

    <!-- CATEGORY HEADER -->

    <div class="d-flex justify-content-between align-items-center mb-4">

      <div>

        <span class="category-label">
          {{ category.products.length }} Products
        </span>

        <h2 class="fw-bold mt-2">
          {{ category.name }}
        </h2>

      </div>

      <RouterLink
        :to="`/category/${category.slug}`"
        class="view-all"
      >
        View All
        <i class="bi bi-arrow-right"></i>
      </RouterLink>

    </div>

    <!-- EMPTY CATEGORY -->

    <div
      v-if="category.products.length === 0"
      class="empty-box"
    >
      <i class="bi bi-box fs-1 mb-3"></i>

      <h5>No Products</h5>

      <p class="text-muted mb-0">
        There are currently no products in this category.
      </p>

    </div>

    <!-- PRODUCTS -->

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

          <!-- IMAGE -->

          <div class="product-image">

            <img
              :src="product.image_url"
              class="img-fluid"
            >

            <span class="sale-badge">
              New
            </span>

            <button class="wishlist-btn">

              <i class="bi bi-heart"></i>

            </button>

          </div>

          <!-- BODY -->

          <div class="product-body">

            <small class="text-primary fw-semibold">

              {{ category.name }}

            </small>

            <h5 class="mt-2">

              {{ product.name }}

            </h5>

            <p class="text-muted">

              {{ product.description.substring(0,70) }}...

            </p>

            <!-- PRICE -->

            <div class="price-section">

              <div>

                <h4>

                  ₦{{ Number(product.price).toLocaleString() }}

                </h4>

                <small>

                  {{ product.quantity }} left

                </small>

              </div>

              <div class="rating">

                ⭐ 4.9

              </div>

            </div>

            <!-- BUTTONS -->

            <div class="d-grid gap-2 mt-4">

              <RouterLink
                :to="`/public-view/${product.id}`"
                class="btn btn-outline-primary"
              >
                <i class="bi bi-eye me-2"></i>

                View Product
              </RouterLink>

              <button
                class="btn btn-warning"
                @click="addProduct(product)"
              >

                <i class="bi bi-cart-plus me-2"></i>

                Add To Cart

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>

</section>

</div>

</template>

<style scoped>

/* ===========================
   GLOBAL
=========================== */

.marketplace{
    background:#f5f7fb;
    min-height:100vh;
}

.container{
    max-width:1320px;
}

/* ===========================
   HERO
=========================== */

.hero{
    position:relative;
    overflow:hidden;
    background:linear-gradient(135deg,#2563eb,#4338ca);
    padding:100px 0;
    color:#fff;
}

.hero::before{
    content:"";
    position:absolute;
    width:450px;
    height:450px;
    background:rgba(255,255,255,.08);
    border-radius:50%;
    top:-180px;
    right:-100px;
}

.hero::after{
    content:"";
    position:absolute;
    width:300px;
    height:300px;
    background:rgba(255,255,255,.05);
    border-radius:50%;
    bottom:-120px;
    left:-120px;
}

.hero-tag{
    display:inline-block;
    background:#fff;
    color:#2563eb;
    padding:10px 24px;
    border-radius:40px;
    font-weight:700;
    letter-spacing:.5px;
}

.hero-title{
    font-size:4rem;
    font-weight:800;
    line-height:1.1;
    margin-top:25px;
}

.hero-text{
    margin-top:25px;
    font-size:18px;
    color:#e8ecff;
    max-width:520px;
}

.hero-buttons{
    margin-top:40px;
}

.hero-buttons .btn{
    border-radius:50px;
    padding:14px 35px;
    font-weight:600;
}

.hero-stats{
    display:flex;
    gap:50px;
}

.hero-stats h3{
    font-weight:700;
    margin-bottom:4px;
}

.hero-stats small{
    color:#d8dfff;
}

/* ===========================
 HERO IMAGE
=========================== */

.hero-image{
    position:relative;
}

.hero-image img{
    border-radius:30px;
    box-shadow:0 30px 60px rgba(0,0,0,.25);
}

.floating-card{
    position:absolute;
    background:#fff;
    display:flex;
    gap:15px;
    align-items:center;
    padding:15px;
    border-radius:18px;
    box-shadow:0 20px 45px rgba(0,0,0,.12);
    animation:float 4s ease-in-out infinite;
}

.floating-card img{
    width:60px;
    height:60px;
    object-fit:cover;
    border-radius:12px;
}

.card-one{
    left:-40px;
    top:80px;
}

.card-two{
    right:-35px;
    bottom:70px;
}

/* ===========================
 SEARCH
=========================== */

.search-box{
    background:#fff;
    padding:18px;
    border-radius:18px;
    display:flex;
    align-items:center;
    gap:15px;
    box-shadow:0 12px 35px rgba(0,0,0,.08);
    margin-top:-50px;
    position:relative;
    z-index:100;
}

.search-box i{
    font-size:22px;
    color:#2563eb;
}

.search-box input{
    border:none;
    box-shadow:none;
    font-size:16px;
}

.search-box .btn{
    border-radius:12px;
    width:55px;
    height:55px;
}

/* ===========================
 CATEGORY
=========================== */

.category-label{
    display:inline-block;
    background:#dbeafe;
    color:#2563eb;
    padding:8px 18px;
    border-radius:50px;
    font-size:14px;
    font-weight:700;
}

.view-all{
    color:#2563eb;
    font-weight:600;
    text-decoration:none;
}

.view-all:hover{
    color:#1d4ed8;
}

/* ===========================
 PRODUCT CARD
=========================== */

.product-card{
    background:#fff;
    border-radius:24px;
    overflow:hidden;
    transition:.35s;
    box-shadow:0 15px 40px rgba(0,0,0,.08);
    height:100%;
}

.product-card:hover{
    transform:translateY(-12px);
    box-shadow:0 25px 60px rgba(0,0,0,.16);
}

.product-image{
    position:relative;
    overflow:hidden;
    height:260px;
}

.product-image img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition:.5s;
}

.product-card:hover img{
    transform:scale(1.08);
}

/* ===========================
 BADGES
=========================== */

.sale-badge{
    position:absolute;
    top:18px;
    left:18px;
    background:#ef4444;
    color:#fff;
    padding:8px 16px;
    border-radius:30px;
    font-size:13px;
    font-weight:600;
}

.wishlist-btn{
    position:absolute;
    right:18px;
    top:18px;
    width:42px;
    height:42px;
    border:none;
    border-radius:50%;
    background:#fff;
    box-shadow:0 10px 25px rgba(0,0,0,.12);
    transition:.3s;
}

.wishlist-btn:hover{
    background:#ef4444;
    color:#fff;
}

/* ===========================
 BODY
=========================== */

.product-body{
    padding:24px;
}

.product-body h5{
    font-weight:700;
    margin:10px 0;
}

.product-body p{
    min-height:60px;
}

/* ===========================
 PRICE
=========================== */

.price-section{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-top:20px;
}

.price-section h4{
    color:#2563eb;
    font-weight:700;
}

.rating{
    background:#fff7d6;
    color:#d97706;
    padding:8px 14px;
    border-radius:30px;
    font-size:14px;
    font-weight:600;
}

/* ===========================
 BUTTONS
=========================== */

.btn-warning{
    background:#fbbf24;
    border:none;
    color:#111827;
    font-weight:600;
}

.btn-warning:hover{
    background:#f59e0b;
}

.btn-outline-primary{
    border-radius:12px;
}

.btn-warning,
.btn-outline-primary{
    padding:12px;
    border-radius:12px;
    transition:.3s;
}

.btn-warning:hover,
.btn-outline-primary:hover{
    transform:translateY(-2px);
}

/* ===========================
 EMPTY STATE
=========================== */

.empty-box{
    background:#fff;
    padding:70px 30px;
    text-align:center;
    border-radius:20px;
    box-shadow:0 15px 35px rgba(0,0,0,.08);
}

/* ===========================
 ANIMATIONS
=========================== */

@keyframes float{

    0%{
        transform:translateY(0);
    }

    50%{
        transform:translateY(-15px);
    }

    100%{
        transform:translateY(0);
    }

}

.product-card{
    animation:fadeUp .8s ease;
}

@keyframes fadeUp{

    from{
        opacity:0;
        transform:translateY(50px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }

}

/* ===========================
 RESPONSIVE
=========================== */

@media(max-width:992px){

    .hero{
        text-align:center;
        padding:80px 0;
    }

    .hero-title{
        font-size:3rem;
    }

    .hero-text{
        margin:auto;
    }

    .hero-buttons{
        justify-content:center;
    }

    .hero-stats{
        justify-content:center;
        flex-wrap:wrap;
    }

    .floating-card{
        display:none;
    }

}

@media(max-width:768px){

    .hero-title{
        font-size:2.3rem;
    }

    .search-box{
        flex-direction:column;
    }

    .product-image{
        height:220px;
    }

}

</style>