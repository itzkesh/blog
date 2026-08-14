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
  image_url: string | null
  created_at: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const deleting = ref<number | null>(null)
const search = ref('')

/* =========================
   FETCH PRODUCTS
========================= */

const fetchProducts = async () => {
  loading.value = true

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      products.value = []
      return
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', {
        ascending: false
      })

    if (error) throw error

    products.value = data || []

  } catch (error: any) {
    console.error(error.message)
    alert(error.message)
  } finally {
    loading.value = false
  }
}


/* =========================
   SEARCH
========================= */

const filteredProducts = computed(() => {

  const keyword = search.value
    .trim()
    .toLowerCase()

  if (!keyword) {
    return products.value
  }

  return products.value.filter(product => {

    return (
      product.name?.toLowerCase().includes(keyword) ||
      product.category?.toLowerCase().includes(keyword)
    )

  })
})


/* =========================
   DELETE PRODUCT
========================= */

const deleteProduct = async (id: number) => {

  if (
    !confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    )
  ) {
    return
  }

  deleting.value = id

  try {

    /* Get image URL */

    const {
      data: product,
      error: fetchError
    } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw fetchError
    }


    /* =========================
       DELETE IMAGE
    ========================= */

    if (product?.image_url) {

      const imagePath =
        product.image_url.split('/products/')[1]

      if (imagePath) {

        const {
          error: storageError
        } = await supabase.storage
          .from('products')
          .remove([imagePath])

        if (storageError) {
          console.warn(
            'Image deletion failed:',
            storageError.message
          )
        }

      }

    }


    /* =========================
       DELETE PRODUCT
    ========================= */

    const {
      error
    } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }


    /* Remove immediately from UI */

    products.value =
      products.value.filter(
        product => product.id !== id
      )

    alert('Product deleted successfully.')

  } catch (error: any) {

    console.error(error)

    alert(error.message)

  } finally {

    deleting.value = null

  }

}


/* =========================
   FORMAT DATE
========================= */

const formatDate = (date: string) => {

  return new Date(date).toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  )

}


/* =========================
   STOCK STATUS
========================= */

const getStockClass = (quantity: number) => {

  if (quantity === 0) {
    return 'stock-out'
  }

  if (quantity <= 5) {
    return 'stock-low'
  }

  return 'stock-good'

}


const getStockText = (quantity: number) => {

  if (quantity === 0) {
    return 'Out of stock'
  }

  if (quantity <= 5) {
    return 'Low stock'
  }

  return 'In stock'

}


/* =========================
   ON MOUNT
========================= */

onMounted(() => {
  fetchProducts()
})
</script>


<template>

  <div class="products-page">


    <!-- =========================
         HEADER
    ========================== -->

    <div class="page-header">

      <div>

        <span class="page-label">
          YOUR STORE
        </span>

        <h1>
          My Products
        </h1>

        <p>
          Manage your products, inventory and listings.
        </p>

      </div>


      <RouterLink
        to="/auth/products/add"
        class="add-product-btn"
      >

        <i class="bi bi-plus-lg"></i>

        Add Product

      </RouterLink>

    </div>


    <!-- =========================
         SEARCH BAR
    ========================== -->

    <div class="toolbar">

      <div class="search-box">

        <i class="bi bi-search"></i>

        <input
          v-model="search"
          type="search"
          placeholder="Search products or categories..."
        >

        <button
          v-if="search"
          class="clear-search"
          @click="search = ''"
        >

          <i class="bi bi-x"></i>

        </button>

      </div>


      <div class="product-count">

        <i class="bi bi-box-seam"></i>

        {{ filteredProducts.length }}
        {{ filteredProducts.length === 1 ? 'Product' : 'Products' }}

      </div>

    </div>


    <!-- =========================
         PRODUCTS CARD
    ========================== -->

    <div class="products-card">

      <div class="table-responsive">

        <table class="table products-table">


          <!-- TABLE HEADER -->

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
                Added
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>


            <!-- =========================
                 LOADING
            ========================== -->

            <tr v-if="loading">

              <td
                colspan="7"
                class="loading-row"
              >

                <div class="spinner-border text-primary"></div>

                <p>
                  Loading your products...
                </p>

              </td>

            </tr>


            <!-- =========================
                 EMPTY
            ========================== -->

            <tr
              v-else-if="filteredProducts.length === 0"
            >

              <td
                colspan="7"
                class="empty-row"
              >

                <div class="empty-icon">

                  <i
                    class="bi"
                    :class="
                      search
                        ? 'bi-search'
                        : 'bi-box-seam'
                    "
                  ></i>

                </div>


                <h4>
                  {{
                    search
                      ? 'No products found'
                      : 'No products yet'
                  }}
                </h4>


                <p>

                  {{
                    search
                      ? 'Try searching for another product.'
                      : 'Start selling by adding your first product.'
                  }}

                </p>


                <button
                  v-if="search"
                  class="btn btn-outline-primary"
                  @click="search = ''"
                >

                  Clear Search

                </button>


                <RouterLink
                  v-else
                  to="/auth/products/add"
                  class="btn btn-primary"
                >

                  <i class="bi bi-plus-lg me-2"></i>

                  Add Product

                </RouterLink>

              </td>

            </tr>


            <!-- =========================
                 PRODUCTS
            ========================== -->

            <tr
              v-for="product in filteredProducts"
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


                  <div class="product-name">

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

                <span class="category-pill">

                  {{ product.category || 'Uncategorized' }}

                </span>

              </td>


              <!-- PRICE -->

              <td>

                <strong class="product-price">

                  ₦{{ Number(product.price).toLocaleString() }}

                </strong>

              </td>


              <!-- STOCK -->

              <td>

                <strong>
                  {{ product.quantity }}
                </strong>

                <span class="units">
                  units
                </span>

              </td>


              <!-- DATE -->

              <td>

                <span class="date">

                  {{ formatDate(product.created_at) }}

                </span>

              </td>


              <!-- STATUS -->

              <td>

                <span
                  class="stock-status"
                  :class="getStockClass(product.quantity)"
                >

                  <span class="status-dot"></span>

                  {{ getStockText(product.quantity) }}

                </span>

              </td>


              <!-- ACTIONS -->

              <td>

                <div class="action-buttons">


                  <!-- VIEW -->

                  <RouterLink
                    :to="`/auth/my-product/${product.id}`"
                    class="action-btn view"
                    title="View Product"
                  >

                    <i class="bi bi-eye"></i>

                  </RouterLink>


                  <!-- EDIT -->

                  <RouterLink
                    :to="`/auth/edit/${product.id}`"
                    class="action-btn edit"
                    title="Edit Product"
                  >

                    <i class="bi bi-pencil"></i>

                  </RouterLink>


                  <!-- DELETE -->

                  <button
                    class="action-btn delete"
                    title="Delete Product"
                    :disabled="deleting === product.id"
                    @click="deleteProduct(product.id)"
                  >

                    <span
                      v-if="deleting === product.id"
                      class="spinner-border spinner-border-sm"
                    ></span>

                    <i
                      v-else
                      class="bi bi-trash"
                    ></i>

                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>

</template>


<style scoped>

/* =========================
   PAGE
========================= */

.products-page {
  padding: 10px 5px 50px;
  background: #f7f9fc;
  min-height: 100vh;
}


/* =========================
   HEADER
========================= */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.page-label {
  display: block;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 7px;
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.add-product-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 20px;
  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: .3s;
  box-shadow: 0 8px 20px rgba(37,99,235,.18);
}

.add-product-btn:hover {
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 13px 28px rgba(37,99,235,.25);
}


/* =========================
   TOOLBAR
========================= */

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-box > i {
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 2;
}

.search-box input {
  width: 100%;
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  background: white;
  padding: 0 45px;
  outline: none;
  color: #0f172a;
  transition: .3s;
}

.search-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37,99,235,.08);
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
}

.product-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.product-count i {
  color: #2563eb;
}


/* =========================
   PRODUCTS CARD
========================= */

.products-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(15,23,42,.06);
}


/* =========================
   TABLE
========================= */

.products-table {
  margin: 0;
  min-width: 1000px;
}

.products-table thead {
  background: #f8fafc;
}

.products-table th {
  padding: 17px 20px;
  border: 0;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .6px;
  white-space: nowrap;
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
  min-width: 230px;
}

.product-image {
  width: 55px;
  height: 55px;
  min-width: 55px;
  border-radius: 13px;
  overflow: hidden;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 20px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name strong {
  display: block;
  color: #0f172a;
  font-size: 14px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-name small {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  margin-top: 4px;
}


/* =========================
   CATEGORY
========================= */

.category-pill {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 50px;
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}


/* =========================
   PRICE
========================= */

.product-price {
  color: #2563eb;
  white-space: nowrap;
}


/* =========================
   STOCK
========================= */

.units {
  color: #94a3b8;
  font-size: 12px;
  margin-left: 3px;
}

.stock-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
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
   DATE
========================= */

.date {
  color: #64748b;
  font-size: 13px;
  white-space: nowrap;
}


/* =========================
   ACTIONS
========================= */

.action-buttons {
  display: flex;
  align-items: center;
  gap: 7px;
}

.action-btn {
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: .25s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.view {
  background: #eff6ff;
  color: #2563eb;
}

.action-btn.edit {
  background: #f0fdf4;
  color: #16a34a;
}

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
  transform: none;
}


/* =========================
   LOADING
========================= */

.loading-row {
  text-align: center;
  padding: 70px 20px !important;
}

.loading-row p {
  color: #64748b;
  margin: 15px 0 0;
}


/* =========================
   EMPTY
========================= */

.empty-row {
  text-align: center;
  padding: 70px 20px !important;
}

.empty-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  font-size: 26px;
}

.empty-row h4 {
  font-weight: 800;
  color: #0f172a;
}

.empty-row p {
  color: #64748b;
  margin-bottom: 20px;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {

  .products-page {
    padding: 5px 0 30px;
  }

  .page-header {
    display: block;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .add-product-btn {
    margin-top: 20px;
  }

  .toolbar {
    display: block;
  }

  .search-box {
    max-width: none;
  }

  .product-count {
    margin-top: 12px;
  }

  .products-card {
    border-radius: 15px;
  }

}

</style>