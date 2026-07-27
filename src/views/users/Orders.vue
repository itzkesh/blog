<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

interface Order {
  id: number
  buyer_id: string
  seller_id: string
  product_id: number
  quantity: number
  amount: number
  status: string
  created_at: string
  products?: {
    name: string
  }
}

const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref('')

const fetchOrders = async () => {
  loading.value = true
  error.value = ''

  // Get logged in seller
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    loading.value = false
    return
  }

  const { data, error: supabaseError } = await supabase
    .from('orders')
    .select(`
      *,
      products(name)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (supabaseError) {
    error.value = supabaseError.message
  } else {
    orders.value = data || []
  }

  loading.value = false
}

const formatCurrency = (amount: number) => {
  return `₦${Number(amount).toLocaleString()}`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="container-fluid py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Orders</h2>
        <p class="text-muted">
          Manage orders placed for your products.
        </p>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <div class="card shadow-sm border-0 rounded-4">

      <div class="table-responsive">

        <table class="table table-hover align-middle mb-0">

          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Buyer</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            <tr v-if="loading">
              <td colspan="7" class="text-center py-5">
                Loading orders...
              </td>
            </tr>

            <tr
              v-else-if="orders.length === 0"
            >
              <td colspan="7" class="text-center py-5">
                No orders available.
              </td>
            </tr>

            <tr
              v-for="(order, index) in orders"
              :key="order.id"
            >
              <td>{{ index + 1 }}</td>

              <td>
                {{ order.products?.name }}
              </td>

              <td>
                {{ order.buyer_id }}
              </td>

              <td>
                {{ order.quantity }}
              </td>

              <td>
                {{ formatCurrency(order.amount) }}
              </td>

              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-warning text-dark': order.status === 'Pending',
                    'bg-success': order.status === 'Completed',
                    'bg-danger': order.status === 'Cancelled'
                  }"
                >
                  {{ order.status }}
                </span>
              </td>

              <td>
                {{ formatDate(order.created_at) }}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>
</template>

<style scoped>
.card {
  border-radius: 18px;
}

.table th {
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

.badge {
  padding: 8px 12px;
  font-size: .85rem;
}
</style>