<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { useCartStore } from '../../stores/cart'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

interface Category {
  id: number
  name: string
  slug: string
}

interface Seller {
  username: string
  email?: string
  phone_number: string | null
  address: string | null
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  image_url: string
  category_id: number
  seller_id: string
  created_at?: string
  product_categories: Category | null
  seller_profiles: Seller | null
}

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref('')
const addingToCart = ref(false)

const getProduct = async () => {
  loading.value = true
  error.value = ''

  const { data, error: supabaseError } = await supabase
    .from('products')
    .select(`
      *,
      product_categories(
        id,
        name,
        slug
      ),
      seller_profiles(
        username,
        email,
        phone_number,
        address
      )
    `)
    .eq('id', route.params.id)
    .single()

  if (supabaseError) {
    console.error(supabaseError.message)
    error.value = 'We could not load this product.'
  } else {
    product.value = data as Product
  }

  loading.value = false
}

const addToCart = () => {
  if (!product.value) return

  if (product.value.quantity <= 0) {
    alert('This product is currently out of stock.')
    return
  }

  addingToCart.value = true

  cart.addToCart({
    id: product.value.id,
    seller_id: product.value.seller_id,
    name: product.value.name,
    price: Number(product.value.price),
    image_url: product.value.image_url,
    quantity: 1
  })

  setTimeout(() => {
    addingToCart.value = false
  }, 500)
}

const buyNow = () => {
  if (!product.value) return

  if (product.value.quantity <= 0) {
    alert('This product is currently out of stock.')
    return
  }

  cart.addToCart({
    id: product.value.id,
    seller_id: product.value.seller_id,
    name: product.value.name,
    price: Number(product.value.price),
    image_url: product.value.image_url,
    quantity: 1
  })

  router.push('/checkout')
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  getProduct()
})
</script>

<template>
  <div class="product-page">

    <!-- =========================
         LOADING
    ========================== -->
    <div
      v-if="loading"
      class="loading-screen"
    >
      <div class="loading-card">
        <div class="spinner-border text-primary"></div>

        <p class="mt-3 mb-0">
          Loading product...
        </p>
      </div>
    </div>


    <!-- =========================
         ERROR
    ========================== -->
    <div
      v-else-if="error"
      class="container py-5"
    >
      <div class="error-card text-center">

        <div class="error-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>

        <h3>
          Product unavailable
        </h3>

        <p>
          {{ error }}
        </p>

        <button
          class="btn btn-primary"
          @click="goBack"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Go Back
        </button>

      </div>
    </div>


    <!-- =========================
         PRODUCT
    ========================== -->
    <main
      v-else-if="product"
      class="container py-4 py-lg-5"
    >

      <!-- Breadcrumb -->
      <div class="breadcrumb-area mb-4">

        <button
          class="back-button"
          @click="goBack"
        >
          <i class="bi bi-arrow-left"></i>
        </button>

        <span>
          Marketplace
        </span>

        <i class="bi bi-chevron-right"></i>

        <span>
          {{ product.product_categories?.name }}
        </span>

        <i class="bi bi-chevron-right"></i>

        <strong>
          {{ product.name }}
        </strong>

      </div>


      <!-- Main Product Card -->
      <div class="product-container">

        <div class="row g-0">


          <!-- =========================
               IMAGE
          ========================== -->
          <div class="col-lg-6">

            <div class="image-section">

              <div class="image-background"></div>

              <div class="product-image-container">

                <img
                  :src="product.image_url"
                  :alt="product.name"
                  class="product-image"
                >

              </div>


              <!-- Category -->
              <div class="image-category">

                <i class="bi bi-grid-fill me-2"></i>

                {{ product.product_categories?.name }}

              </div>


              <!-- Stock -->
              <div
                class="stock-label"
                :class="product.quantity > 0
                  ? 'stock-available'
                  : 'stock-empty'"
              >

                <span class="stock-dot"></span>

                {{
                  product.quantity > 0
                    ? 'In Stock'
                    : 'Out of Stock'
                }}

              </div>

            </div>

          </div>


          <!-- =========================
               DETAILS
          ========================== -->
          <div class="col-lg-6">

            <div class="details-section">


              <!-- Category -->
              <div class="category-title">

                {{ product.product_categories?.name }}

              </div>


              <!-- Product Name -->
              <h1 class="product-title">
                {{ product.name }}
              </h1>


              <!-- Rating -->
              <div class="rating-row">

                <div class="stars">
                  ★★★★★
                </div>

                <span>
                  Trusted Seller Product
                </span>

              </div>


              <!-- Price -->
              <div class="price-area">

                <span class="price">
                  ₦{{ Number(product.price).toLocaleString() }}
                </span>

                <span class="price-label">
                  Best Price
                </span>

              </div>


              <!-- Description -->
              <div class="description-box">

                <h5>
                  About this product
                </h5>

                <p>
                  {{ product.description }}
                </p>

              </div>


              <!-- Availability -->
              <div class="availability">

                <div class="availability-icon">
                  <i class="bi bi-box-seam"></i>
                </div>

                <div>

                  <small>
                    Availability
                  </small>

                  <strong>
                    {{ product.quantity }} units available
                  </strong>

                </div>

              </div>


              <!-- Seller -->
              <div class="seller-box">

                <div class="seller-avatar">

                  <i class="bi bi-person-fill"></i>

                </div>

                <div class="seller-info">

                  <small>
                    Sold by
                  </small>

                  <h5>
                    {{ product.seller_profiles?.username }}
                  </h5>

                  <div class="seller-location">

                    <span
                      v-if="product.seller_profiles?.address"
                    >
                      <i class="bi bi-geo-alt-fill"></i>

                      {{ product.seller_profiles?.address }}
                    </span>

                    <span
                      v-if="product.seller_profiles?.phone_number"
                    >
                      <i class="bi bi-telephone-fill"></i>

                      {{ product.seller_profiles?.phone_number }}
                    </span>

                  </div>

                </div>

              </div>


              <!-- Actions -->
              <div class="action-buttons">

                <button
                  class="cart-button"
                  :disabled="
                    product.quantity <= 0 ||
                    addingToCart
                  "
                  @click="addToCart"
                >

                  <i
                    class="bi"
                    :class="
                      addingToCart
                        ? 'bi-check-lg'
                        : 'bi-cart-plus'
                    "
                  ></i>

                  {{
                    addingToCart
                      ? 'Added to Cart'
                      : 'Add to Cart'
                  }}

                </button>


                <button
                  class="buy-button"
                  :disabled="product.quantity <= 0"
                  @click="buyNow"
                >

                  <i class="bi bi-lightning-fill"></i>

                  Buy Now

                </button>

              </div>


              <!-- Trust Features -->
              <div class="trust-grid">

                <div class="trust-item">

                  <div class="trust-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>

                  <div>
                    <strong>
                      Secure Shopping
                    </strong>

                    <small>
                      Safe & protected
                    </small>
                  </div>

                </div>


                <div class="trust-item">

                  <div class="trust-icon">
                    <i class="bi bi-truck"></i>
                  </div>

                  <div>
                    <strong>
                      Reliable Delivery
                    </strong>

                    <small>
                      Delivered to you
                    </small>
                  </div>

                </div>


                <div class="trust-item">

                  <div class="trust-icon">
                    <i class="bi bi-headset"></i>
                  </div>

                  <div>
                    <strong>
                      Seller Support
                    </strong>

                    <small>
                      Contact seller
                    </small>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- =========================
           BOTTOM INFORMATION
      ========================== -->
      <div class="bottom-section">

        <div class="row g-4">

          <div class="col-md-4">

            <div class="info-card">

              <div class="info-icon blue">
                <i class="bi bi-shield-lock"></i>
              </div>

              <div>

                <h5>
                  Secure Shopping
                </h5>

                <p>
                  Shop confidently with secure checkout.
                </p>

              </div>

            </div>

          </div>


          <div class="col-md-4">

            <div class="info-card">

              <div class="info-icon green">
                <i class="bi bi-box-seam"></i>
              </div>

              <div>

                <h5>
                  Quality Products
                </h5>

                <p>
                  Discover products from trusted sellers.
                </p>

              </div>

            </div>

          </div>


          <div class="col-md-4">

            <div class="info-card">

              <div class="info-icon purple">
                <i class="bi bi-chat-dots"></i>
              </div>

              <div>

                <h5>
                  Direct Contact
                </h5>

                <p>
                  Easily connect with the seller.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>


    <!-- Floating Cart -->
    <RouterLink
      to="/cart"
      class="floating-cart"
    >

      <i class="bi bi-cart3"></i>

      <span
        v-if="cart.totalItems > 0"
        class="cart-count"
      >
        {{ cart.totalItems }}
      </span>

    </RouterLink>

  </div>
</template>


<style scoped>

/* =================================
   PAGE
================================= */

.product-page {
  min-height: 100vh;

  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(37, 99, 235, 0.06),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 30%,
      rgba(79, 70, 229, 0.06),
      transparent 30%
    ),
    #f8fafc;

  color: #111827;
}


/* =================================
   LOADING
================================= */

.loading-screen {
  min-height: 70vh;

  display: flex;

  align-items: center;

  justify-content: center;
}

.loading-card {
  text-align: center;

  color: #6b7280;
}


/* =================================
   ERROR
================================= */

.error-card {
  max-width: 500px;

  margin: 80px auto;

  padding: 50px 30px;

  background: white;

  border-radius: 25px;

  box-shadow:
    0 20px 60px rgba(0, 0, 0, .08);
}

.error-icon {
  width: 70px;
  height: 70px;

  margin: 0 auto 20px;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #fee2e2;

  color: #dc2626;

  font-size: 30px;
}


/* =================================
   BREADCRUMB
================================= */

.breadcrumb-area {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-wrap: wrap;

  color: #94a3b8;

  font-size: 14px;
}

.breadcrumb-area strong {
  color: #334155;
}

.back-button {
  width: 40px;
  height: 40px;

  border: 1px solid #e2e8f0;

  background: white;

  border-radius: 12px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-right: 8px;

  transition: .3s;
}

.back-button:hover {
  background: #2563eb;

  color: white;

  border-color: #2563eb;

  transform: translateX(-3px);
}


/* =================================
   MAIN CONTAINER
================================= */

.product-container {
  background: white;

  border-radius: 30px;

  overflow: hidden;

  box-shadow:
    0 25px 80px rgba(15, 23, 42, .08);
}


/* =================================
   IMAGE SECTION
================================= */

.image-section {
  position: relative;

  min-height: 650px;

  padding: 35px;

  background:
    linear-gradient(
      145deg,
      #eef4ff,
      #f8fafc
    );

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;
}

.image-background {
  position: absolute;

  width: 420px;
  height: 420px;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      rgba(37, 99, 235, .12),
      rgba(79, 70, 229, .08)
    );

  filter: blur(2px);
}

.product-image-container {
  position: relative;

  width: 85%;

  height: 500px;

  border-radius: 25px;

  overflow: hidden;

  background: white;

  box-shadow:
    0 25px 60px rgba(15, 23, 42, .15);
}

.product-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform .6s ease;
}

.product-image-container:hover .product-image {
  transform: scale(1.05);
}


/* =================================
   IMAGE BADGES
================================= */

.image-category {
  position: absolute;

  top: 30px;
  left: 30px;

  padding: 10px 17px;

  border-radius: 50px;

  background: white;

  color: #2563eb;

  font-size: 13px;

  font-weight: 700;

  box-shadow:
    0 10px 30px rgba(0,0,0,.12);
}

.stock-label {
  position: absolute;

  right: 30px;
  top: 30px;

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 10px 16px;

  border-radius: 50px;

  background: white;

  font-size: 13px;

  font-weight: 700;

  box-shadow:
    0 10px 30px rgba(0,0,0,.12);
}

.stock-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;
}

.stock-available {
  color: #15803d;
}

.stock-available .stock-dot {
  background: #22c55e;
}

.stock-empty {
  color: #dc2626;
}

.stock-empty .stock-dot {
  background: #ef4444;
}


/* =================================
   DETAILS
================================= */

.details-section {
  padding: 55px 50px;
}

.category-title {
  display: inline-block;

  padding: 7px 14px;

  background: #eff6ff;

  color: #2563eb;

  border-radius: 50px;

  text-transform: uppercase;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1px;
}

.product-title {
  margin-top: 18px;

  font-size: 2.8rem;

  line-height: 1.1;

  font-weight: 800;

  letter-spacing: -.8px;

  color: #0f172a;
}


/* =================================
   RATING
================================= */

.rating-row {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-top: 15px;

  color: #64748b;

  font-size: 13px;
}

.stars {
  color: #f59e0b;

  letter-spacing: 3px;

  font-size: 16px;
}


/* =================================
   PRICE
================================= */

.price-area {
  display: flex;

  align-items: center;

  gap: 15px;

  flex-wrap: wrap;

  margin-top: 25px;
}

.price {
  color: #2563eb;

  font-size: 2.3rem;

  font-weight: 800;
}

.price-label {
  padding: 6px 12px;

  background: #dcfce7;

  color: #15803d;

  border-radius: 50px;

  font-size: 12px;

  font-weight: 700;
}


/* =================================
   DESCRIPTION
================================= */

.description-box {
  margin-top: 30px;
}

.description-box h5 {
  font-weight: 800;

  margin-bottom: 12px;
}

.description-box p {
  color: #64748b;

  line-height: 1.8;

  font-size: 15px;
}


/* =================================
   AVAILABILITY
================================= */

.availability {
  display: flex;

  align-items: center;

  gap: 14px;

  margin-top: 25px;

  padding: 15px;

  border-radius: 16px;

  background: #f8fafc;

  border: 1px solid #e2e8f0;
}

.availability-icon {
  width: 45px;
  height: 45px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #dbeafe;

  color: #2563eb;

  font-size: 20px;
}

.availability small {
  display: block;

  color: #94a3b8;

  margin-bottom: 3px;
}

.availability strong {
  display: block;

  color: #334155;
}


/* =================================
   SELLER
================================= */

.seller-box {
  display: flex;

  align-items: center;

  gap: 15px;

  margin-top: 20px;

  padding: 18px;

  border: 1px solid #e2e8f0;

  border-radius: 18px;

  background: white;
}

.seller-avatar {
  flex-shrink: 0;

  width: 55px;
  height: 55px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: white;

  font-size: 22px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );
}

.seller-info small {
  color: #94a3b8;

  display: block;
}

.seller-info h5 {
  margin: 3px 0 7px;

  font-weight: 800;
}

.seller-location {
  display: flex;

  flex-wrap: wrap;

  gap: 12px;

  color: #64748b;

  font-size: 12px;
}

.seller-location i {
  color: #2563eb;

  margin-right: 4px;
}


/* =================================
   ACTIONS
================================= */

.action-buttons {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;

  margin-top: 25px;
}

.cart-button,
.buy-button {
  border: none;

  border-radius: 14px;

  padding: 15px;

  font-weight: 700;

  transition: all .3s ease;
}

.cart-button {
  background: #f1f5f9;

  color: #1e293b;
}

.cart-button:hover:not(:disabled) {
  background: #e2e8f0;

  transform: translateY(-2px);
}

.buy-button {
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  box-shadow:
    0 12px 25px rgba(37, 99, 235, .25);
}

.buy-button:hover:not(:disabled) {
  transform: translateY(-3px);

  box-shadow:
    0 18px 35px rgba(37, 99, 235, .35);
}

.cart-button:disabled,
.buy-button:disabled {
  opacity: .5;

  cursor: not-allowed;
}


/* =================================
   TRUST
================================= */

.trust-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 10px;

  margin-top: 25px;
}

.trust-item {
  padding: 14px;

  border-radius: 14px;

  background: #f8fafc;

  text-align: center;
}

.trust-icon {
  color: #2563eb;

  font-size: 21px;

  margin-bottom: 5px;
}

.trust-item strong {
  display: block;

  font-size: 11px;

  color: #334155;
}

.trust-item small {
  display: block;

  font-size: 10px;

  color: #94a3b8;

  margin-top: 2px;
}


/* =================================
   BOTTOM INFO
================================= */

.bottom-section {
  margin-top: 30px;
}

.info-card {
  height: 100%;

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 22px;

  background: white;

  border: 1px solid #e2e8f0;

  border-radius: 18px;

  transition: .3s;
}

.info-card:hover {
  transform: translateY(-5px);

  box-shadow:
    0 15px 35px rgba(15, 23, 42, .07);
}

.info-icon {
  flex-shrink: 0;

  width: 50px;
  height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 14px;

  font-size: 22px;
}

.info-icon.blue {
  background: #dbeafe;
  color: #2563eb;
}

.info-icon.green {
  background: #dcfce7;
  color: #16a34a;
}

.info-icon.purple {
  background: #ede9fe;
  color: #7c3aed;
}

.info-card h5 {
  font-size: 14px;

  font-weight: 800;

  margin: 0 0 4px;
}

.info-card p {
  font-size: 12px;

  color: #94a3b8;

  margin: 0;
}


/* =================================
   FLOATING CART
================================= */

.floating-cart {
  position: fixed;

  right: 25px;
  bottom: 25px;

  width: 60px;
  height: 60px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  font-size: 23px;

  text-decoration: none;

  box-shadow:
    0 15px 35px rgba(37, 99, 235, .35);

  z-index: 1000;

  transition: .3s;
}

.floating-cart:hover {
  color: white;

  transform: translateY(-5px) scale(1.05);
}

.cart-count {
  position: absolute;

  top: -3px;
  right: -3px;

  min-width: 22px;
  height: 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 3px 6px;

  background: #ef4444;

  color: white;

  border-radius: 50px;

  font-size: 11px;

  font-weight: 800;

  border: 2px solid white;
}


/* =================================
   RESPONSIVE
================================= */

@media (max-width: 991px) {

  .image-section {
    min-height: 500px;
  }

  .product-image-container {
    height: 400px;
  }

  .details-section {
    padding: 40px 30px;
  }

  .product-title {
    font-size: 2.3rem;
  }

}

@media (max-width: 767px) {

  .breadcrumb-area {
    font-size: 12px;
  }

  .image-section {
    min-height: 420px;

    padding: 25px;
  }

  .product-image-container {
    width: 100%;
    height: 360px;
  }

  .image-category {
    top: 20px;
    left: 20px;
  }

  .stock-label {
    top: 20px;
    right: 20px;
  }

  .details-section {
    padding: 30px 22px;
  }

  .product-title {
    font-size: 2rem;
  }

  .price {
    font-size: 1.8rem;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .trust-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 480px) {

  .product-container {
    border-radius: 20px;
  }

  .image-section {
    min-height: 350px;
  }

  .product-image-container {
    height: 300px;
  }

  .seller-location {
    flex-direction: column;

    gap: 5px;
  }

  .floating-cart {
    right: 15px;
    bottom: 15px;

    width: 55px;
    height: 55px;
  }

}
</style>