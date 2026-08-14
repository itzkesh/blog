<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const product = ref<any>(null)
const error = ref('')

const fetchProduct = async () => {
  loading.value = true
  error.value = ''

  const { data, error: fetchError } = await supabase
    .from('products')
    .select(`
      *,
      product_categories(name),
      seller_profiles(
        username,
        email,
        phone_number,
        address
      )
    `)
    .eq('id', route.params.id)
    .single()

  if (fetchError) {
    console.error(fetchError.message)
    error.value = fetchError.message
  } else {
    product.value = data
  }

  loading.value = false
}

const formatPrice = (price: number) => {
  return `₦${Number(price).toLocaleString()}`
}

const goBack = () => {
  router.back()
}

const buyProduct = () => {
  router.push(`/place-order/${product.value.id}`)
}

onMounted(fetchProduct)
</script>

<template>
  <div class="product-page">

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="spinner-border text-primary"></div>
      <p>Loading product...</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="container py-5"
    >
      <div class="error-card">
        <i class="bi bi-exclamation-circle"></i>

        <h4>Unable to load product</h4>

        <p>
          {{ error }}
        </p>

        <button
          class="btn btn-primary"
          @click="fetchProduct"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Product -->
    <div
      v-else-if="product"
      class="container py-5"
    >

      <!-- Back -->
      <button
        class="back-button"
        @click="goBack"
      >
        <i class="bi bi-arrow-left"></i>
        Back to Marketplace
      </button>

      <div class="product-wrapper">

        <!-- =========================
             IMAGE
        ========================== -->

        <div class="product-image-section">

          <div class="image-card">

            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="product-image"
            >

            <div
              v-else
              class="no-image"
            >
              <i class="bi bi-image"></i>
              <span>No Image Available</span>
            </div>

            <!-- Image Badge -->

            <div class="image-badge">
              <i class="bi bi-shield-check"></i>
              Verified Product
            </div>

          </div>

        </div>


        <!-- =========================
             PRODUCT DETAILS
        ========================== -->

        <div class="product-details">

          <!-- Category -->

          <div class="category-label">

            <i class="bi bi-tag"></i>

            {{ product.product_categories?.name || 'General' }}

          </div>


          <!-- Product Name -->

          <h1 class="product-title">
            {{ product.name }}
          </h1>


          <!-- Rating -->

          <div class="product-meta">

            <span>
              <i class="bi bi-star-fill"></i>
              4.8
            </span>

            <span class="divider"></span>

            <span>
              <i class="bi bi-box-seam"></i>
              {{ product.quantity }} available
            </span>

          </div>


          <!-- Price -->

          <div class="price-section">

            <span class="price-label">
              Price
            </span>

            <h2>
              {{ formatPrice(product.price) }}
            </h2>

          </div>


          <!-- Stock -->

          <div
            class="stock-box"
            :class="{
              'stock-danger': product.quantity === 0,
              'stock-warning':
                product.quantity > 0 &&
                product.quantity <= 5
            }"
          >

            <div class="stock-icon">

              <i
                v-if="product.quantity > 5"
                class="bi bi-check-circle"
              ></i>

              <i
                v-else-if="product.quantity > 0"
                class="bi bi-exclamation-circle"
              ></i>

              <i
                v-else
                class="bi bi-x-circle"
              ></i>

            </div>

            <div>

              <strong v-if="product.quantity > 5">
                In Stock
              </strong>

              <strong v-else-if="product.quantity > 0">
                Low Stock
              </strong>

              <strong v-else>
                Out of Stock
              </strong>

              <p v-if="product.quantity > 0">
                {{ product.quantity }} units available
              </p>

              <p v-else>
                This product is currently unavailable
              </p>

            </div>

          </div>


          <!-- Description -->

          <div class="description-section">

            <h5>
              Product Description
            </h5>

            <p>
              {{ product.description || 'No description available for this product.' }}
            </p>

          </div>


          <!-- Actions -->

          <div class="action-section">

            <button
              class="buy-button"
              :disabled="product.quantity <= 0"
              @click="buyProduct"
            >

              <i class="bi bi-bag-check"></i>

              {{
                product.quantity > 0
                  ? 'Buy Now'
                  : 'Out of Stock'
              }}

            </button>

            <button
              class="cart-button"
              :disabled="product.quantity <= 0"
            >

              <i class="bi bi-cart-plus"></i>

              Add to Cart

            </button>

          </div>


          <!-- Product Information -->

          <div class="product-information">

            <div class="info-item">

              <div class="info-icon">
                <i class="bi bi-box-seam"></i>
              </div>

              <div>
                <small>Product ID</small>
                <strong>#{{ product.id }}</strong>
              </div>

            </div>


            <div class="info-item">

              <div class="info-icon">
                <i class="bi bi-calendar3"></i>
              </div>

              <div>
                <small>Added</small>

                <strong>
                  {{
                    product.created_at
                      ? new Date(
                          product.created_at
                        ).toLocaleDateString()
                      : 'N/A'
                  }}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- =========================
           SELLER
      ========================== -->

      <div class="seller-card">

        <div class="seller-left">

          <div class="seller-avatar">

            {{
              product.seller_profiles?.username
                ?.charAt(0)
                ?.toUpperCase() || 'S'
            }}

          </div>

          <div>

            <span class="seller-label">
              SOLD BY
            </span>

            <h5>
              {{
                product.seller_profiles?.username ||
                'Seller'
              }}
            </h5>

            <p>
              <i class="bi bi-geo-alt"></i>

              {{
                product.seller_profiles?.address ||
                'Location not provided'
              }}
            </p>

          </div>

        </div>


        <div class="seller-actions">

          <a
            v-if="product.seller_profiles?.phone_number"
            :href="`tel:${product.seller_profiles.phone_number}`"
            class="contact-button"
          >
            <i class="bi bi-telephone"></i>
            Contact Seller
          </a>

          <a
            v-if="product.seller_profiles?.email"
            :href="`mailto:${product.seller_profiles.email}`"
            class="contact-button secondary"
          >
            <i class="bi bi-envelope"></i>
            Email Seller
          </a>

        </div>

      </div>

    </div>

  </div>
</template>


<style scoped>

/* =========================
   PAGE
========================= */

.product-page {
  min-height: 100vh;
  background: #f6f8fc;
}


/* =========================
   LOADING
========================= */

.loading-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: #64748b;
}


/* =========================
   ERROR
========================= */

.error-card {
  background: white;
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(15, 23, 42, .08);
}

.error-card > i {
  font-size: 50px;
  color: #ef4444;
}

.error-card h4 {
  margin-top: 15px;
  font-weight: 800;
}

.error-card p {
  color: #64748b;
}


/* =========================
   BACK BUTTON
========================= */

.back-button {
  border: none;
  background: transparent;
  color: #475569;
  font-weight: 600;
  margin-bottom: 25px;
  padding: 8px 0;
  transition: .25s;
}

.back-button:hover {
  color: #2563eb;
  transform: translateX(-4px);
}

.back-button i {
  margin-right: 8px;
}


/* =========================
   PRODUCT WRAPPER
========================= */

.product-wrapper {
  display: grid;
  grid-template-columns: 48% 52%;
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(15, 23, 42, .08);
}


/* =========================
   IMAGE
========================= */

.product-image-section {
  padding: 25px;
  background: #f1f5f9;
}

.image-card {
  height: 100%;
  min-height: 650px;
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background: white;
}

.product-image {
  width: 100%;
  height: 100%;
  min-height: 650px;
  object-fit: cover;
  display: block;
}

.no-image {
  min-height: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 10px;
}

.no-image i {
  font-size: 60px;
}


/* IMAGE BADGE */

.image-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border-radius: 50px;
  background: rgba(255,255,255,.95);
  color: #15803d;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(0,0,0,.1);
}


/* =========================
   DETAILS
========================= */

.product-details {
  padding: 55px 50px;
}

.category-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #eff6ff;
  color: #2563eb;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
}

.product-title {
  font-size: 42px;
  line-height: 1.15;
  font-weight: 800;
  color: #0f172a;
  margin: 20px 0 15px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #64748b;
  font-size: 14px;
}

.product-meta i {
  color: #f59e0b;
}

.product-meta span:last-child i {
  color: #2563eb;
}

.divider {
  width: 5px;
  height: 5px;
  background: #cbd5e1;
  border-radius: 50%;
}


/* =========================
   PRICE
========================= */

.price-section {
  margin-top: 35px;
}

.price-label {
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
}

.price-section h2 {
  margin: 5px 0;
  color: #2563eb;
  font-size: 35px;
  font-weight: 800;
}


/* =========================
   STOCK
========================= */

.stock-box {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 17px;
  margin: 25px 0;
  border-radius: 15px;
  background: #f0fdf4;
  color: #166534;
}

.stock-warning {
  background: #fffbeb;
  color: #a16207;
}

.stock-danger {
  background: #fef2f2;
  color: #b91c1c;
}

.stock-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255,255,255,.7);
  font-size: 20px;
}

.stock-box strong {
  display: block;
  font-size: 14px;
}

.stock-box p {
  margin: 3px 0 0;
  font-size: 12px;
  opacity: .8;
}


/* =========================
   DESCRIPTION
========================= */

.description-section {
  margin-top: 30px;
}

.description-section h5 {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 10px;
}

.description-section p {
  color: #64748b;
  line-height: 1.8;
}


/* =========================
   ACTIONS
========================= */

.action-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 30px;
}

.buy-button,
.cart-button {
  border: none;
  padding: 15px;
  border-radius: 13px;
  font-weight: 700;
  font-size: 15px;
  transition: .3s;
}

.buy-button {
  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );
  color: white;
}

.cart-button {
  background: #f1f5f9;
  color: #334155;
}

.buy-button:hover,
.cart-button:hover {
  transform: translateY(-3px);
}

.buy-button:hover {
  box-shadow: 0 12px 25px rgba(37,99,235,.25);
}

.buy-button:disabled,
.cart-button:disabled {
  opacity: .5;
  cursor: not-allowed;
  transform: none;
}


/* =========================
   PRODUCT INFO
========================= */

.product-information {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 35px;
  padding-top: 25px;
  border-top: 1px solid #e2e8f0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #2563eb;
  border-radius: 10px;
}

.info-item small {
  display: block;
  color: #94a3b8;
  font-size: 11px;
}

.info-item strong {
  font-size: 13px;
  color: #334155;
}


/* =========================
   SELLER CARD
========================= */

.seller-card {
  margin-top: 25px;
  padding: 25px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 35px rgba(15,23,42,.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.seller-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.seller-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #2563eb,
    #7c3aed
  );
  color: white;
  font-size: 22px;
  font-weight: 800;
}

.seller-label {
  font-size: 10px;
  letter-spacing: 1px;
  color: #94a3b8;
  font-weight: 800;
}

.seller-card h5 {
  margin: 3px 0;
  font-weight: 800;
}

.seller-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.seller-card p i {
  color: #2563eb;
}

.seller-actions {
  display: flex;
  gap: 10px;
}

.contact-button {
  text-decoration: none;
  padding: 11px 17px;
  border-radius: 11px;
  background: #2563eb;
  color: white;
  font-size: 13px;
  font-weight: 700;
  transition: .25s;
}

.contact-button.secondary {
  background: #eff6ff;
  color: #2563eb;
}

.contact-button:hover {
  transform: translateY(-2px);
}


/* =========================
   RESPONSIVE
========================= */

@media(max-width: 992px) {

  .product-wrapper {
    grid-template-columns: 1fr;
  }

  .image-card,
  .product-image {
    min-height: 500px;
  }

  .product-details {
    padding: 40px 30px;
  }

  .product-title {
    font-size: 34px;
  }

  .seller-card {
    flex-direction: column;
    align-items: flex-start;
  }

}

@media(max-width: 576px) {

  .container {
    padding-left: 15px;
    padding-right: 15px;
  }

  .product-image-section {
    padding: 12px;
  }

  .image-card,
  .product-image {
    min-height: 350px;
  }

  .product-details {
    padding: 30px 20px;
  }

  .product-title {
    font-size: 28px;
  }

  .price-section h2 {
    font-size: 29px;
  }

  .action-section {
    grid-template-columns: 1fr;
  }

  .product-information {
    grid-template-columns: 1fr;
  }

  .seller-actions {
    width: 100%;
    flex-direction: column;
  }

  .contact-button {
    text-align: center;
  }

}

</style>