<script setup lang="ts">
import navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

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

const cartOpen = ref(false)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')
const search = ref('')
const selectedCategory = ref<number | null>(null)

const addProduct = (product: Product) => {
  cart.addToCart({
    id: product.id,
    seller_id: product.seller_id,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url,
    quantity: 1
  })

  alert('Product added to cart')
}

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
        .order('created_at', {
          ascending: false
        })
    ])

  categories.value = categoryData || []
  products.value = productData || []

  loading.value = false
}

const filteredProducts = computed(() => {

  let data = products.value

  if (selectedCategory.value) {
    data = data.filter(
      p => p.category_id === selectedCategory.value
    )
  }

  if (search.value) {
    data = data.filter(product =>
      product.name
        .toLowerCase()
        .includes(search.value.toLowerCase())
    )
  }

  return data
})

const groupedProducts = computed(() => {

  if (selectedCategory.value) {

    return [{
      id: selectedCategory.value,
      name:
        categories.value.find(
          c => c.id === selectedCategory.value
        )?.name,
      products: filteredProducts.value
    }]
  }

  return categories.value.map(category => ({
    ...category,
    products: filteredProducts.value.filter(
      p => p.category_id === category.id
    )
  }))
})

onMounted(getData)
</script>

<template>
   <navbar />

  

<div class="marketplace">

    <!-- HERO -->

    <section class="hero">

        <div class="container">

            <div class="row align-items-center">

                <div class="col-lg-6">

                    <span class="hero-tag">
                        🔥 Biggest Marketplace
                    </span>

                    <h1 class="display-3 fw-bold mt-4">

                        Shop The Best
                        Products
                        Online

                    </h1>

                    <p class="hero-text">

                        Discover thousands of quality
                        products from verified sellers.

                    </p>

                    <div class="hero-search">

                        <input
                            v-model="search"
                            class="form-control"
                            placeholder="Search products..."
                        />

                        <button>

                            <i class="bi bi-search"></i>

                        </button>

                    </div>

                </div>

                <div class="col-lg-6 text-center">

                    <img
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900"
                        class="hero-image"
                    >

                </div>

            </div>

        </div>

        <div class="circle circle1"></div>
        <div class="circle circle2"></div>

    </section>

    <!-- CATEGORY MENU -->

    <section class="category-menu">

        <div class="container">

            <div class="category-scroll">

                <button
                    class="category-pill"
                    :class="{
                        active:selectedCategory===null
                    }"
                    @click="selectedCategory=null"
                >

                    All Products

                </button>

                <button
                    v-for="category in categories"
                    :key="category.id"
                    class="category-pill"
                    :class="{
                        active:selectedCategory===category.id
                    }"
                    @click="selectedCategory=category.id"
                >

                    {{ category.name }}

                </button>

            </div>

        </div>

    </section>

    <!-- FEATURED BANNER -->

    <section class="container py-5">

        <div class="featured-banner">

            <div class="row align-items-center">

                <div class="col-lg-7">

                    <span class="sale-badge">

                        Up to 50% OFF

                    </span>

                    <h2>

                        Amazing Deals
                        Every Day

                    </h2>

                    <p>

                        Find the latest gadgets,
                        fashion,
                        automobiles,
                        beauty products
                        and much more.

                    </p>

                    <button class="btn btn-light btn-lg">

                        Shop Now

                    </button>

                </div>

                <div class="col-lg-5 text-center">

                    <img
                        src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900"
                        class="featured-image"
                    >

                </div>

            </div>

        </div>

    </section>
        <!-- PRODUCTS -->

    <section class="container pb-5">

        <div
            v-for="category in groupedProducts"
            :key="category.id"
            class="mb-5"
        >

            <div
                v-if="category.products.length"
                class="section-header"
            >

                <div>

                    <span class="section-tag">

                        {{ category.products.length }} Products

                    </span>

                    <h2 class="section-title">

                        {{ category.name }}

                    </h2>

                </div>

                <RouterLink
                    to="/"
                    class="see-all"
                >

                    See All

                    <i class="bi bi-arrow-right ms-2"></i>

                </RouterLink>

            </div>

            <div class="row g-4">

                <div
                    v-for="product in category.products"
                    :key="product.id"
                    class="col-xl-3 col-lg-4 col-md-6"
                >

                    <div class="product-card">

                        <div class="product-image">

                            <img
                                :src="product.image_url"
                            >

                            <span class="discount">

                                -20%

                            </span>

                            <button class="wishlist">

                                <i class="bi bi-heart"></i>

                            </button>

                        </div>

                        <div class="product-body">

                            <small class="category-name">

                                {{ product.product_categories.name }}

                            </small>

                            <h5>

                                {{ product.name }}

                            </h5>

                            <p>

                                {{
                                    product.description.substring(0,70)
                                }}...

                            </p>

                            <div class="rating">

                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-half"></i>

                                <span>

                                    (4.8)

                                </span>

                            </div>

                            <div class="price-area">

                                <div>

                                    <h4>

                                        ₦{{ Number(product.price).toLocaleString() }}

                                    </h4>

                                    <small>

                                        Stock:
                                        {{ product.quantity }}

                                    </small>

                                </div>

                                <span class="old-price">

                                    ₦{{ Number(product.price * 1.2).toLocaleString() }}

                                </span>

                            </div>

                            <div class="d-grid gap-2 mt-4">

                                <RouterLink
                                    :to="`/public-view/${product.id}`"
                                    class="btn btn-view"
                                >

                                    View Product

                                </RouterLink>

                                <button
                                    class="btn btn-cart"
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

        </div>

    </section>

    <!-- Floating Cart Button -->
<button
  class="floating-cart"
  @click="cartOpen = true"
>
  <i class="bi bi-cart3"></i>

  <span
    v-if="cart.totalItems > 0"
    class="cart-count"
  >
    {{ cart.totalItems }}
  </span>
</button>

</div>
<!-- CART OVERLAY -->
<Transition name="cart-fade">

  <div
    v-if="cartOpen"
    class="cart-overlay"
    @click.self="cartOpen = false"
  >

    <!-- CART DRAWER -->
    <Transition name="cart-slide">

      <div class="cart-drawer">

        <!-- Header -->
        <div class="cart-header">

          <div>
            <h3>
              <i class="bi bi-cart3 me-2"></i>
              Your Cart
            </h3>

            <small>
              {{ cart.totalItems }} item{{ cart.totalItems !== 1 ? 's' : '' }}
            </small>
          </div>

          <button
            class="close-cart"
            @click="cartOpen = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <!-- Empty Cart -->
        <div
          v-if="cart.items.length === 0"
          class="empty-cart"
        >

          <div class="empty-cart-icon">
            <i class="bi bi-cart-x"></i>
          </div>

          <h4>
            Your cart is empty
          </h4>

          <p>
            Looks like you haven't added anything yet.
          </p>

          <button
            class="btn btn-primary"
            @click="cartOpen = false"
          >
            Continue Shopping
          </button>

        </div>


        <!-- Cart Items -->
        <div
          v-else
          class="cart-content"
        >

          <div
            v-for="item in cart.items"
            :key="item.id"
            class="cart-item"
          >

            <!-- Image -->
            <img
              :src="item.image_url"
              :alt="item.name"
            >

            <!-- Details -->
            <div class="cart-item-details">

              <h6>
                {{ item.name }}
              </h6>

              <div class="cart-price">
                ₦{{ Number(item.price).toLocaleString() }}
              </div>


              <!-- Quantity -->
              <div class="quantity-control">

                <button
                  @click="cart.decreaseQty(item.id)"
                >
                  −
                </button>

                <span>
                  {{ item.quantity }}
                </span>

                <button
                  @click="cart.increaseQty(item.id)"
                >
                  +
                </button>

              </div>

            </div>


            <!-- Remove -->
            <button
              class="remove-item"
              @click="cart.removeFromCart(item.id)"
            >
              <i class="bi bi-trash"></i>
            </button>

          </div>


          <!-- Summary -->
          <div class="cart-summary">

            <div class="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₦{{ cart.totalPrice.toLocaleString() }}
              </strong>

            </div>


            <div class="summary-row">

              <span>
                Delivery
              </span>

              <strong>
                ₦0
              </strong>

            </div>

            <hr>


            <div class="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₦{{ cart.totalPrice.toLocaleString() }}
              </strong>

            </div>


            <!-- Checkout -->
            <RouterLink
              to="/checkout"
              class="checkout-button"
              @click="cartOpen = false"
            >

              <span>
                Proceed to Checkout
              </span>

              <i class="bi bi-arrow-right"></i>

            </RouterLink>


            <button
              class="continue-shopping"
              @click="cartOpen = false"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>

    </Transition>

  </div>

</Transition>
 <Footer />

</template>

<style scoped>

:root{
  --primary:#5b21b6;
  --secondary:#7c3aed;
  --accent:#f97316;
  --light:#f8f9ff;
  --dark:#111827;
}

.marketplace{
  background:#f5f7ff;
  min-height:100vh;
}

/* ================= HERO ================= */

.hero{
  position:relative;
  overflow:hidden;
  padding:90px 0 110px;
  background:linear-gradient(135deg,#5b21b6,#7c3aed,#8b5cf6);
}

.hero::before{
  content:'';
  position:absolute;
  inset:0;
  background:url("https://www.transparenttextures.com/patterns/cubes.png");
  opacity:.08;
}

.hero>.container{
  position:relative;
  z-index:2;
}

.hero-tag{
  display:inline-flex;
  align-items:center;
  gap:10px;
  background:white;
  color:#5b21b6;
  padding:10px 22px;
  border-radius:40px;
  font-weight:700;
  box-shadow:0 15px 40px rgba(0,0,0,.15);
}

.hero h1{
  color:#fff;
  line-height:1.15;
}

.hero-text{
  color:#ece8ff;
  font-size:18px;
  margin:25px 0;
  max-width:520px;
}

.hero-search{
  display:flex;
  background:#fff;
  border-radius:60px;
  overflow:hidden;
  max-width:520px;
  box-shadow:0 25px 50px rgba(0,0,0,.15);
}

.hero-search input{
  border:none;
  height:65px;
  box-shadow:none;
  padding-left:25px;
}

.hero-search button{
  width:70px;
  border:none;
  background:var(--accent);
  color:#fff;
  font-size:22px;
}

.hero-image{
  width:100%;
  max-width:520px;
  animation:float 4s ease-in-out infinite;
  filter:drop-shadow(0 35px 45px rgba(0,0,0,.3));
}

.circle{
  position:absolute;
  border-radius:50%;
  background:rgba(255,255,255,.08);
}

.circle1{
  width:380px;
  height:380px;
  left:-120px;
  top:-120px;
}

.circle2{
  width:260px;
  height:260px;
  right:-70px;
  bottom:-70px;
}

/* ================= CATEGORY ================= */

.category-menu{
  margin-top:-35px;
  position:relative;
  z-index:20;
}

.category-scroll{
  background:#fff;
  padding:18px;
  border-radius:20px;
  display:flex;
  gap:15px;
  overflow-x:auto;
  box-shadow:0 15px 35px rgba(0,0,0,.08);
}

.category-scroll::-webkit-scrollbar{
  display:none;
}

.category-pill{
  border:none;
  background:#eef2ff;
  color:#5b21b6;
  font-weight:600;
  padding:12px 24px;
  border-radius:40px;
  white-space:nowrap;
  transition:.3s;
}

.category-pill:hover{
  background:#5b21b6;
  color:#fff;
}

.category-pill.active{
  background:#5b21b6;
  color:#fff;
}

/* ================= FEATURED ================= */

.featured-banner{
  background:linear-gradient(135deg,#5b21b6,#8b5cf6);
  border-radius:30px;
  padding:60px;
  color:#fff;
  overflow:hidden;
  position:relative;
  box-shadow:0 25px 50px rgba(91,33,182,.3);
}

.featured-banner::before{
  content:'';
  position:absolute;
  right:-120px;
  top:-80px;
  width:320px;
  height:320px;
  border-radius:50%;
  background:rgba(255,255,255,.08);
}

.sale-badge{
  display:inline-block;
  background:#fff;
  color:#5b21b6;
  padding:10px 20px;
  border-radius:40px;
  font-weight:700;
}

.featured-banner h2{
  font-size:3rem;
  margin:25px 0;
}

.featured-banner p{
  color:#ece8ff;
  font-size:18px;
}

.featured-image{
  width:100%;
  max-width:350px;
  animation:float 5s ease infinite;
}
/* ================= SECTION HEADER ================= */

.section-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
}

.section-tag{
  display:inline-block;
  padding:8px 18px;
  background:#ede9fe;
  color:#5b21b6;
  border-radius:30px;
  font-weight:600;
  font-size:.9rem;
}

.section-title{
  font-size:2rem;
  font-weight:800;
  color:#111827;
  margin-top:10px;
}

.see-all{
  text-decoration:none;
  color:#5b21b6;
  font-weight:700;
  transition:.3s;
}

.see-all:hover{
  color:#7c3aed;
}

/* ================= PRODUCT CARD ================= */

.product-card{
  background:#fff;
  border-radius:22px;
  overflow:hidden;
  box-shadow:0 15px 40px rgba(0,0,0,.08);
  transition:.35s;
  height:100%;
}

.product-card:hover{
  transform:translateY(-10px);
  box-shadow:0 30px 60px rgba(0,0,0,.15);
}

.product-image{
  position:relative;
  height:250px;
  overflow:hidden;
}

.product-image img{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:.4s;
}

.product-card:hover img{
  transform:scale(1.08);
}

.discount{
  position:absolute;
  left:15px;
  top:15px;
  background:#ef4444;
  color:#fff;
  padding:6px 14px;
  border-radius:30px;
  font-size:.8rem;
  font-weight:700;
}

.wishlist{
  position:absolute;
  right:15px;
  top:15px;
  width:42px;
  height:42px;
  border:none;
  border-radius:50%;
  background:#fff;
  color:#ef4444;
  font-size:18px;
  box-shadow:0 8px 20px rgba(0,0,0,.15);
  transition:.3s;
}

.wishlist:hover{
  background:#ef4444;
  color:#fff;
}

.product-body{
  padding:24px;
}

.category-name{
  color:#7c3aed;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.5px;
}

.product-body h5{
  margin-top:10px;
  font-weight:700;
  color:#111827;
}

.product-body p{
  color:#6b7280;
  min-height:55px;
  margin:15px 0;
}

.rating{
  color:#f59e0b;
  margin-bottom:18px;
}

.rating span{
  color:#6b7280;
  margin-left:8px;
}

.price-area{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.price-area h4{
  color:#5b21b6;
  font-weight:800;
}

.old-price{
  text-decoration:line-through;
  color:#9ca3af;
}

/* ================= BUTTONS ================= */

.btn-view{
  background:#5b21b6;
  color:#fff;
  border:none;
  border-radius:12px;
  padding:12px;
  font-weight:600;
}

.btn-view:hover{
  background:#6d28d9;
  color:#fff;
}

.btn-cart{
  background:#f59e0b;
  color:#fff;
  border:none;
  border-radius:12px;
  padding:12px;
  font-weight:600;
}

.btn-cart:hover{
  background:#ea580c;
  color:#fff;
}

.btn-buy{
  background:#16a34a;
  color:#fff;
  border:none;
  border-radius:12px;
  padding:12px;
  font-weight:600;
}

.btn-buy:hover{
  background:#15803d;
  color:#fff;
}

/* ================= FLOATING CART ================= */

.floating-cart{
  position:fixed;
  right:30px;
  bottom:30px;
  width:70px;
  height:70px;
  border-radius:50%;
  background:linear-gradient(135deg,#5b21b6,#7c3aed);
  display:flex;
  justify-content:center;
  align-items:center;
  color:#fff;
  text-decoration:none;
  font-size:28px;
  box-shadow:0 20px 45px rgba(91,33,182,.35);
  z-index:999;
  transition:.3s;
}

.floating-cart:hover{
  transform:translateY(-6px) scale(1.08);
  color:#fff;
}

.cart-count{
  position:absolute;
  top:-6px;
  right:-6px;
  width:28px;
  height:28px;
  border-radius:50%;
  background:#ef4444;
  color:#fff;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:.75rem;
  font-weight:700;
}

/* ================= ANIMATIONS ================= */

@keyframes float{
  0%{transform:translateY(0);}
  50%{transform:translateY(-15px);}
  100%{transform:translateY(0);}
}

.product-card{
  animation:fadeUp .6s ease;
}

@keyframes fadeUp{
  from{
    opacity:0;
    transform:translateY(35px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

/* ================= RESPONSIVE ================= */

@media (max-width:992px){

  .hero{
    text-align:center;
    padding:70px 0;
  }

  .hero-search{
    margin:auto;
  }

  .featured-banner{
    padding:35px;
    text-align:center;
  }

  .featured-banner h2{
    font-size:2.2rem;
  }

  .featured-image{
    margin-top:30px;
  }

  .section-header{
    flex-direction:column;
    align-items:flex-start;
    gap:15px;
  }

}

@media(max-width:768px){

  .hero h1{
    font-size:2.3rem;
  }

  .hero-image{
    margin-top:40px;
  }

  .product-image{
    height:220px;
  }

  .floating-cart{
    width:60px;
    height:60px;
    font-size:24px;
    right:20px;
    bottom:20px;
  }

}

/* ========================================
   FLOATING CART
======================================== */

.floating-cart {
  position: fixed;

  right: 25px;
  bottom: 25px;

  width: 62px;
  height: 62px;

  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );

  color: white;

  font-size: 24px;

  cursor: pointer;

  box-shadow:
    0 15px 35px rgba(37, 99, 235, .35);

  z-index: 1000;

  transition: .3s;
}

.floating-cart:hover {
  transform: translateY(-5px) scale(1.05);

  box-shadow:
    0 20px 40px rgba(37, 99, 235, .45);
}


/* CART COUNT */

.cart-count {
  position: absolute;

  top: -4px;
  right: -4px;

  min-width: 23px;
  height: 23px;

  padding: 2px 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ef4444;

  color: white;

  border-radius: 50px;

  font-size: 11px;

  font-weight: 800;

  border: 2px solid white;
}


/* ========================================
   OVERLAY
======================================== */

.cart-overlay {
  position: fixed;

  inset: 0;

  background: rgba(15, 23, 42, .55);

  backdrop-filter: blur(4px);

  z-index: 9999;

  display: flex;

  justify-content: flex-end;
}


/* ========================================
   CART DRAWER
======================================== */

.cart-drawer {
  width: 440px;

  max-width: 100%;

  height: 100vh;

  background: white;

  display: flex;

  flex-direction: column;

  box-shadow:
    -15px 0 50px rgba(0,0,0,.15);
}


/* ========================================
   HEADER
======================================== */

.cart-header {
  padding: 25px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom: 1px solid #e5e7eb;
}

.cart-header h3 {
  margin: 0;

  font-weight: 800;

  color: #111827;
}

.cart-header h3 i {
  color: #2563eb;
}

.cart-header small {
  color: #6b7280;
}

.close-cart {
  width: 40px;
  height: 40px;

  border: none;

  border-radius: 50%;

  background: #f1f5f9;

  color: #475569;

  display: flex;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: .3s;
}

.close-cart:hover {
  background: #fee2e2;

  color: #dc2626;

  transform: rotate(90deg);
}


/* ========================================
   CART CONTENT
======================================== */

.cart-content {
  flex: 1;

  overflow-y: auto;

  padding: 20px;
}


/* ========================================
   CART ITEM
======================================== */

.cart-item {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 15px 0;

  border-bottom: 1px solid #eef2f7;
}

.cart-item img {
  width: 75px;
  height: 75px;

  object-fit: cover;

  border-radius: 14px;

  flex-shrink: 0;
}

.cart-item-details {
  flex: 1;

  min-width: 0;
}

.cart-item-details h6 {
  margin: 0 0 5px;

  font-weight: 700;

  color: #1e293b;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.cart-price {
  color: #2563eb;

  font-size: 14px;

  font-weight: 700;

  margin-bottom: 8px;
}


/* ========================================
   QUANTITY
======================================== */

.quantity-control {
  display: inline-flex;

  align-items: center;

  border: 1px solid #e2e8f0;

  border-radius: 8px;

  overflow: hidden;
}

.quantity-control button {
  width: 28px;
  height: 28px;

  border: none;

  background: #f8fafc;

  cursor: pointer;

  font-weight: 700;

  color: #334155;
}

.quantity-control button:hover {
  background: #e2e8f0;
}

.quantity-control span {
  min-width: 30px;

  text-align: center;

  font-size: 13px;

  font-weight: 700;
}


/* ========================================
   REMOVE
======================================== */

.remove-item {
  border: none;

  background: transparent;

  color: #94a3b8;

  cursor: pointer;

  padding: 8px;

  transition: .3s;
}

.remove-item:hover {
  color: #ef4444;

  transform: scale(1.15);
}


/* ========================================
   SUMMARY
======================================== */

.cart-summary {
  padding: 20px;

  border-top: 1px solid #e5e7eb;

  background: #fff;
}

.summary-row {
  display: flex;

  justify-content: space-between;

  margin-bottom: 12px;

  color: #64748b;
}

.summary-row strong {
  color: #334155;
}

.summary-total {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 20px;
}

.summary-total span {
  font-size: 18px;

  font-weight: 700;
}

.summary-total strong {
  font-size: 24px;

  font-weight: 800;

  color: #2563eb;
}


/* ========================================
   CHECKOUT BUTTON
======================================== */

.checkout-button {
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 15px 18px;

  border-radius: 13px;

  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );

  color: white;

  text-decoration: none;

  font-weight: 700;

  box-shadow:
    0 10px 25px rgba(37,99,235,.25);

  transition: .3s;
}

.checkout-button:hover {
  color: white;

  transform: translateY(-2px);

  box-shadow:
    0 15px 30px rgba(37,99,235,.35);
}


/* ========================================
   CONTINUE SHOPPING
======================================== */

.continue-shopping {
  width: 100%;

  margin-top: 10px;

  padding: 12px;

  border: none;

  background: transparent;

  color: #64748b;

  font-weight: 600;

  cursor: pointer;
}

.continue-shopping:hover {
  color: #2563eb;
}


/* ========================================
   EMPTY CART
======================================== */

.empty-cart {
  flex: 1;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 40px;
}

.empty-cart-icon {
  width: 90px;
  height: 90px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 38px;

  margin-bottom: 20px;
}

.empty-cart h4 {
  font-weight: 800;
}

.empty-cart p {
  color: #64748b;

  margin-bottom: 25px;
}


/* ========================================
   ANIMATIONS
======================================== */

.cart-fade-enter-active,
.cart-fade-leave-active {
  transition: opacity .3s ease;
}

.cart-fade-enter-from,
.cart-fade-leave-to {
  opacity: 0;
}


.cart-slide-enter-active,
.cart-slide-leave-active {
  transition: transform .35s ease;
}

.cart-slide-enter-from,
.cart-slide-leave-to {
  transform: translateX(100%);
}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 576px) {

  .cart-drawer {
    width: 100%;
  }

  .floating-cart {
    right: 18px;
    bottom: 18px;

    width: 56px;
    height: 56px;
  }

}

</style>