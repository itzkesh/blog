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

interface Order {
  id: number
  total_amount: number
  status: string
  payment_status: string
}

const profile = ref<SellerProfile | null>(null)

const recentProducts = ref<Product[]>([])

const loading = ref(true)
const loadingProducts = ref(true)

const totalProducts = ref(0)
const totalValue = ref(0)

const totalOrders = ref(0)
const totalEarnings = ref(0)


/* =========================
   GET DASHBOARD
========================= */

const getDashboard = async () => {

  loading.value = true
  loadingProducts.value = true


  /* =========================
     GET USER
  ========================== */

  const {
    data: { user },
  } = await supabase.auth.getUser()


  if (!user) {

    loading.value = false
    loadingProducts.value = false

    return

  }


  /* =========================
     SELLER PROFILE
  ========================== */

  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from('seller_profiles')
    .select('*')
    .eq('id', user.id)
    .single()


  if (profileError) {

    console.error(
      'Profile error:',
      profileError.message
    )

  }


  profile.value = profileData


  /* =========================
     RECENT PRODUCTS
  ========================== */

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from('products')
    .select(`
      *,
      product_categories(name)
    `)
    .eq('seller_id', user.id)
    .order('created_at', {
      ascending: false
    })
    .limit(5)


  if (productsError) {

    console.error(
      'Products error:',
      productsError.message
    )

  }


  recentProducts.value = products || []


  /* =========================
     PRODUCT STATISTICS
  ========================== */

  const {
    data: stats,
    error: statsError,
  } = await supabase
    .from('products')
    .select('price, quantity')
    .eq('seller_id', user.id)


  if (statsError) {

    console.error(
      'Product statistics error:',
      statsError.message
    )

  }


  /* TOTAL PRODUCTS */

  totalProducts.value =
    stats?.length || 0


  /* INVENTORY VALUE */

  totalValue.value =
    stats?.reduce(
      (sum, item) => {

        return (
          sum +
          Number(item.price) *
          Number(item.quantity || 0)
        )

      },
      0
    ) || 0



  /* =========================
     ORDERS
  ========================== */

  const {
    data: orders,
    error: ordersError,
  } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      payment_status
    `)
    .eq('seller_id', user.id)


  if (ordersError) {

    console.error(
      'Orders error:',
      ordersError.message
    )

  }


  const sellerOrders =
    (orders || []) as Order[]


  /* =========================
     TOTAL ORDERS
  ========================== */

  totalOrders.value =
    sellerOrders.length



  /* =========================
     TOTAL EARNINGS
  ========================= */

  totalEarnings.value =
    sellerOrders
      .filter(order => {

        return (
          order.payment_status &&
          order.payment_status.toLowerCase() === 'paid'
        )

      })
      .reduce(
        (sum, order) => {

          return (
            sum +
            Number(order.total_amount || 0)
          )

        },
        0
      )


  loading.value = false
  loadingProducts.value = false

}


/* =========================
   STOCK STATUS
========================= */

const getStockClass = (
  quantity: number
) => {

  if (quantity === 0) {
    return 'stock-out'
  }

  if (quantity <= 5) {
    return 'stock-low'
  }

  return 'stock-good'

}


const getStockText = (
  quantity: number
) => {

  if (quantity === 0) {
    return 'Out of stock'
  }

  if (quantity <= 5) {
    return 'Low stock'
  }

  return 'In stock'

}


/* =========================
   LOAD DASHBOARD
========================= */

onMounted(() => {

  getDashboard()

})

</script>


<template>

<div class="dashboard-page">


  <!-- =========================
       WELCOME HEADER
  ========================== -->

  <div class="welcome-card">

    <div class="welcome-content">

      <div>

        <span class="welcome-badge">

          <i class="bi bi-stars"></i>

          Seller Dashboard

        </span>


        <h1>

          Welcome back,

          <span>
            {{ profile?.username || 'Seller' }}
          </span>

          👋

        </h1>


        <p>

          Manage your products,
          track your store and grow
          your business.

        </p>

      </div>


      <div class="welcome-actions">

        <RouterLink
          to="/auth/products/add"
          class="add-product-btn"
        >

          <i class="bi bi-plus-lg"></i>

          Add Product

        </RouterLink>

      </div>

    </div>


    <div
      class="welcome-circle circle-one"
    ></div>


    <div
      class="welcome-circle circle-two"
    ></div>

  </div>



  <!-- =========================
       SEARCH
  ========================== -->

  <div class="dashboard-toolbar">

    <div class="search-box">

      <i class="bi bi-search"></i>

      <input
        type="search"
        placeholder="Search your products..."
      >

    </div>


    <button class="filter-btn">

      <i class="bi bi-funnel"></i>

      Filter

    </button>

  </div>



  <!-- =========================
       STATISTICS
  ========================== -->

  <div class="row g-4 stats-row">


    <!-- PRODUCTS -->

    <div class="col-xl-3 col-md-6">

      <div class="stat-card products-stat">

        <div class="stat-top">

          <div class="stat-icon">

            <i class="bi bi-box-seam"></i>

          </div>


          <span class="stat-label">

            Products

          </span>

        </div>


        <div class="stat-bottom">

          <h2>

            {{ totalProducts }}

          </h2>


          <span class="stat-description">

            Total products

          </span>

        </div>

      </div>

    </div>



    <!-- ORDERS -->

    <div class="col-xl-3 col-md-6">

      <div class="stat-card orders-stat">

        <div class="stat-top">

          <div class="stat-icon">

            <i class="bi bi-bag-check"></i>

          </div>


          <span class="stat-label">

            Orders

          </span>

        </div>


        <div class="stat-bottom">

          <h2>

            {{ totalOrders }}

          </h2>


          <span class="stat-description">

            Total orders

          </span>

        </div>

      </div>

    </div>



    <!-- REVENUE -->

    <div class="col-xl-3 col-md-6">

      <div class="stat-card revenue-stat">

        <div class="stat-top">

          <div class="stat-icon">

            <i class="bi bi-wallet2"></i>

          </div>


          <span class="stat-label">

            Revenue

          </span>

        </div>


        <div class="stat-bottom">

          <h2>

            ₦{{ totalEarnings.toLocaleString() }}

          </h2>


          <span class="stat-description">

            Total earnings

          </span>

        </div>

      </div>

    </div>

  </div>



  <!-- =========================
       INVENTORY VALUE
  ========================== -->

  <div class="value-banner">

    <div class="value-icon">

      <i class="bi bi-graph-up-arrow"></i>

    </div>


    <div>

      <span>

        Inventory Value

      </span>


      <h3>

        ₦{{ totalValue.toLocaleString() }}

      </h3>

    </div>


    <div class="value-info">

      <i class="bi bi-info-circle"></i>

      Estimated value of your current stock

    </div>

  </div>



  <!-- =========================
       RECENT PRODUCTS
  ========================== -->

  <div class="products-section">

    <div class="section-heading">

      <div>

        <span class="section-label">

          YOUR STORE

        </span>


        <h2>

          Recent Products

        </h2>


        <p>

          Manage your latest products
          and inventory.

        </p>

      </div>


      <RouterLink
        to="/products"
        class="view-all-btn"
      >

        View All

        <i class="bi bi-arrow-right"></i>

      </RouterLink>

    </div>



    <div class="products-card">

      <div class="table-responsive">

        <table class="table products-table">


          <thead>

            <tr>

              <th>
                Product
              </th>

              <th>
                Category
              </th>

              <th>
                Price
              </th>

              <th>
                Stock
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>



          <tbody>


            <!-- LOADING -->

            <tr v-if="loadingProducts">

              <td
                colspan="6"
                class="loading-row"
              >

                <div
                  class="spinner-border text-primary"
                ></div>


                <p>
                  Loading products...
                </p>

              </td>

            </tr>



            <!-- EMPTY -->

            <tr
              v-else-if="
                recentProducts.length === 0
              "
            >

              <td
                colspan="6"
                class="empty-row"
              >

                <div class="empty-icon">

                  <i class="bi bi-box"></i>

                </div>


                <h5>
                  No products yet
                </h5>


                <p>

                  Start selling by adding
                  your first product.

                </p>


                <RouterLink
                  to="/auth/products/add"
                  class="btn btn-primary"
                >

                  Add Product

                </RouterLink>

              </td>

            </tr>



            <!-- PRODUCTS -->

            <tr
              v-for="product in recentProducts"
              :key="product.id"
              class="product-row"
            >


              <!-- PRODUCT -->

              <td>

                <div class="product-info">

                  <div class="product-image">

                    <img
                      v-if="product.image_url"
                      :src="product.image_url"
                      :alt="product.name"
                    >


                    <i
                      v-else
                      class="bi bi-image"
                    ></i>

                  </div>


                  <div>

                    <strong>

                      {{ product.name }}

                    </strong>


                    <small>

                      #{{ product.id }}

                    </small>

                  </div>

                </div>

              </td>



              <!-- CATEGORY -->

              <td>

                <span
                  class="category-pill"
                >

                  {{
                    product.product_categories?.name ||
                    'Uncategorized'
                  }}

                </span>

              </td>



              <!-- PRICE -->

              <td>

                <strong
                  class="product-price"
                >

                  ₦{{
                    Number(
                      product.price
                    ).toLocaleString()
                  }}

                </strong>

              </td>



              <!-- STOCK -->

              <td>

                <strong>

                  {{ product.quantity }}

                </strong>

                units

              </td>



              <!-- STATUS -->

              <td>

                <span
                  class="stock-status"
                  :class="
                    getStockClass(
                      product.quantity
                    )
                  "
                >

                  <span
                    class="status-dot"
                  ></span>


                  {{
                    getStockText(
                      product.quantity
                    )
                  }}

                </span>

              </td>



              <!-- ACTIONS -->

              <td>

                <div class="action-buttons">


                  <RouterLink
                    :to="
                      `/auth/my-product/${product.id}`
                    "
                    class="action-btn view"
                    title="View"
                  >

                    <i
                      class="bi bi-eye"
                    ></i>

                  </RouterLink>


                  <RouterLink
                    :to="
                      `/auth/edit/${product.id}`
                    "
                    class="action-btn edit"
                    title="Edit"
                  >

                    <i
                      class="bi bi-pencil"
                    ></i>

                  </RouterLink>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>

</div>

</template>


<style scoped>

/* =========================
   PAGE
========================= */

.dashboard-page {

  padding: 10px 5px 50px;

  background: #f7f9fc;

  min-height: 100vh;

}


/* =========================
   WELCOME
========================= */

.welcome-card {

  position: relative;

  overflow: hidden;

  padding: 42px;

  margin-bottom: 28px;

  border-radius: 24px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5,
      #7c3aed
    );

  color: white;

  box-shadow:
    0 20px 50px
    rgba(37, 99, 235, .22);

}


.welcome-content {

  position: relative;

  z-index: 2;

  display: flex;

  justify-content: space-between;

  align-items: center;

}


.welcome-badge {

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 8px 15px;

  border-radius: 50px;

  background:
    rgba(255,255,255,.15);

  backdrop-filter: blur(10px);

  font-size: 13px;

  font-weight: 600;

  margin-bottom: 18px;

}


.welcome-card h1 {

  font-size: 34px;

  font-weight: 800;

  margin-bottom: 10px;

}


.welcome-card h1 span {

  color: #facc15;

}


.welcome-card p {

  margin: 0;

  color:
    rgba(255,255,255,.8);

  font-size: 16px;

}


.add-product-btn {

  display: inline-flex;

  align-items: center;

  gap: 9px;

  background: white;

  color: #2563eb;

  text-decoration: none;

  padding: 13px 21px;

  border-radius: 12px;

  font-weight: 700;

  transition: .3s;

}


.add-product-btn:hover {

  transform:
    translateY(-3px);

  box-shadow:
    0 12px 25px
    rgba(0,0,0,.15);

}


.welcome-circle {

  position: absolute;

  border-radius: 50%;

  background:
    rgba(255,255,255,.08);

}


.circle-one {

  width: 280px;

  height: 280px;

  right: -100px;

  top: -120px;

}


.circle-two {

  width: 180px;

  height: 180px;

  left: 42%;

  bottom: -120px;

}


/* =========================
   TOOLBAR
========================= */

.dashboard-toolbar {

  display: flex;

  justify-content:
    space-between;

  gap: 15px;

  margin-bottom: 28px;

}


.search-box {

  width: 100%;

  max-width: 420px;

  position: relative;

}


.search-box i {

  position: absolute;

  left: 17px;

  top: 50%;

  transform:
    translateY(-50%);

  color: #94a3b8;

}


.search-box input {

  width: 100%;

  border:
    1px solid #e2e8f0;

  background: white;

  border-radius: 13px;

  padding:
    13px 18px 13px 45px;

  outline: none;

  transition: .3s;

}


.search-box input:focus {

  border-color: #2563eb;

  box-shadow:
    0 0 0 4px
    rgba(37,99,235,.08);

}


.filter-btn {

  border:
    1px solid #e2e8f0;

  background: white;

  border-radius: 12px;

  padding: 0 20px;

  font-weight: 600;

  color: #475569;

}


/* =========================
   STATS
========================= */

.stats-row {

  margin-bottom: 25px;

}


.stat-card {

  position: relative;

  overflow: hidden;

  border: 0;

  border-radius: 20px;

  padding: 25px;

  background: white;

  box-shadow:
    0 8px 30px
    rgba(15,23,42,.06);

  transition: .35s;

  animation:
    fadeUp .6s ease both;

}


.stat-card:hover {

  transform:
    translateY(-7px);

  box-shadow:
    0 18px 40px
    rgba(15,23,42,.12);

}


.stat-top {

  display: flex;

  align-items: center;

  justify-content:
    space-between;

}


.stat-icon {

  width: 50px;

  height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  font-size: 22px;

}


.products-stat
.stat-icon {

  background: #dbeafe;

  color: #2563eb;

}


.orders-stat
.stat-icon {

  background: #dcfce7;

  color: #16a34a;

}


.revenue-stat
.stat-icon {

  background: #fef3c7;

  color: #d97706;

}


.wishlist-stat
.stat-icon {

  background: #fee2e2;

  color: #dc2626;

}


.stat-label {

  font-size: 13px;

  color: #64748b;

  font-weight: 600;

}


.stat-bottom {

  margin-top: 25px;

}


.stat-bottom h2 {

  font-size: 30px;

  font-weight: 800;

  color: #0f172a;

  margin:
    0 0 5px;

}


.stat-description {

  color: #94a3b8;

  font-size: 13px;

}


/* =========================
   VALUE
========================= */

.value-banner {

  display: flex;

  align-items: center;

  gap: 18px;

  background: white;

  border-radius: 20px;

  padding: 22px 25px;

  margin-bottom: 40px;

  box-shadow:
    0 8px 30px
    rgba(15,23,42,.05);

}


.value-icon {

  width: 55px;

  height: 55px;

  border-radius: 16px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #ede9fe;

  color: #7c3aed;

  font-size: 23px;

}


.value-banner span {

  color: #64748b;

  font-size: 13px;

}


.value-banner h3 {

  margin:
    3px 0 0;

  font-weight: 800;

}


.value-info {

  margin-left: auto;

  color: #94a3b8;

  font-size: 13px;

}


/* =========================
   SECTION
========================= */

.section-heading {

  display: flex;

  align-items: flex-end;

  justify-content:
    space-between;

  margin-bottom: 20px;

}


.section-label {

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1.5px;

  color: #2563eb;

}


.section-heading h2 {

  font-size: 24px;

  font-weight: 800;

  margin:
    5px 0;

}


.section-heading p {

  color: #64748b;

  margin: 0;

}


.view-all-btn {

  display: inline-flex;

  align-items: center;

  gap: 8px;

  text-decoration: none;

  font-weight: 700;

  color: #2563eb;

}


/* =========================
   TABLE
========================= */

.products-card {

  background: white;

  border-radius: 20px;

  overflow: hidden;

  box-shadow:
    0 8px 30px
    rgba(15,23,42,.06);

}


.products-table {

  margin: 0;

}


.products-table thead {

  background: #f8fafc;

}


.products-table th {

  padding: 18px 20px;

  border: 0;

  color: #64748b;

  font-size: 12px;

  text-transform:
    uppercase;

  letter-spacing: .5px;

}


.products-table td {

  padding: 18px 20px;

  vertical-align: middle;

  border-color: #f1f5f9;

}


.product-row {

  transition: .25s;

}


.product-row:hover {

  background: #f8fbff;

}


/* =========================
   PRODUCT INFO
========================= */

.product-info {

  display: flex;

  align-items: center;

  gap: 13px;

}


.product-image {

  width: 55px;

  height: 55px;

  border-radius: 13px;

  overflow: hidden;

  background: #f1f5f9;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #94a3b8;

}


.product-image img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


.product-info strong {

  display: block;

  color: #0f172a;

}


.product-info small {

  display: block;

  color: #94a3b8;

  margin-top: 3px;

}


/* =========================
   CATEGORY
========================= */

.category-pill {

  background: #eff6ff;

  color: #2563eb;

  border-radius: 50px;

  padding: 7px 12px;

  font-size: 12px;

  font-weight: 700;

}


.product-price {

  color: #2563eb;

}


/* =========================
   STOCK
========================= */

.stock-status {

  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 6px 11px;

  border-radius: 50px;

  font-size: 12px;

  font-weight: 700;

}


.status-dot {

  width: 7px;

  height: 7px;

  border-radius: 50%;

}


.stock-good {

  color: #15803d;

  background: #dcfce7;

}


.stock-good .status-dot {

  background: #16a34a;

}


.stock-low {

  color: #b45309;

  background: #fef3c7;

}


.stock-low .status-dot {

  background: #f59e0b;

}


.stock-out {

  color: #b91c1c;

  background: #fee2e2;

}


.stock-out .status-dot {

  background: #ef4444;

}


/* =========================
   ACTIONS
========================= */

.action-buttons {

  display: flex;

  gap: 7px;

}


.action-btn {

  width: 35px;

  height: 35px;

  border-radius: 9px;

  display: flex;

  align-items: center;

  justify-content: center;

  text-decoration: none;

  transition: .25s;

}


.action-btn.view {

  background: #eff6ff;

  color: #2563eb;

}


.action-btn.edit {

  background: #f0fdf4;

  color: #16a34a;

}


.action-btn:hover {

  transform:
    translateY(-2px);

}


/* =========================
   EMPTY
========================= */

.loading-row,
.empty-row {

  text-align: center;

  padding: 50px !important;

}


.empty-icon {

  width: 65px;

  height: 65px;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  display: flex;

  align-items: center;

  justify-content: center;

  margin:
    0 auto 15px;

  font-size: 25px;

}


.empty-row p {

  color: #64748b;

}


/* =========================
   ANIMATION
========================= */

@keyframes fadeUp {

  from {

    opacity: 0;

    transform:
      translateY(20px);

  }

  to {

    opacity: 1;

    transform:
      translateY(0);

  }

}


/* =========================
   MOBILE
========================= */

@media(max-width: 768px) {

  .dashboard-page {

    padding:
      5px 0 30px;

  }


  .welcome-card {

    padding:
      28px 22px;

  }


  .welcome-content {

    display: block;

  }


  .welcome-card h1 {

    font-size: 27px;

  }


  .welcome-actions {

    margin-top: 25px;

  }


  .dashboard-toolbar {

    flex-direction: column;

  }


  .search-box {

    max-width: none;

  }


  .filter-btn {

    height: 45px;

  }


  .value-banner {

    flex-wrap: wrap;

  }


  .value-info {

    width: 100%;

    margin-left: 0;

  }


  .section-heading {

    align-items: flex-start;

    gap: 15px;

  }


  .section-heading h2 {

    font-size: 21px;

  }


  .products-card {

    border-radius: 15px;

  }

}

</style>