<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

interface Order {
  id: number
  order_code: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  quantity: number
  total_amount: number
  status: string
  payment_status: string
  created_at: string

  products: {
    name: string
    image_url: string
  } | null
}

const orders = ref<Order[]>([])
const loading = ref(true)
const search = ref('')

const fetchOrders = async () => {
  loading.value = true

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    loading.value = false
    return
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products(
        name,
        image_url
      )
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error.message)
  } else {
    orders.value = data as Order[]
  }

  loading.value = false
}

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const keyword = search.value.toLowerCase()

    return (
      order.order_code.toLowerCase().includes(keyword) ||
      order.customer_name.toLowerCase().includes(keyword) ||
      order.products?.name.toLowerCase().includes(keyword)
    )
  })
})

const updateStatus = async (order: Order) => {
  const { error } = await supabase
    .from('orders')
    .update({
      status: order.status
    })
    .eq('id', order.id)

  if (error) {
    alert(error.message)
  }
}

onMounted(fetchOrders)
</script>

<template>

<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>
            <h2 class="fw-bold">Orders</h2>
            <p class="text-muted">
                Manage customer orders
            </p>
        </div>

        <input
            v-model="search"
            type="text"
            class="form-control search-box"
            placeholder="Search orders..."
        >

    </div>

    <div
        v-if="loading"
        class="text-center py-5"
    >
        <div class="spinner-border text-primary"></div>
    </div>

    <div
        v-else
        class="card shadow-sm border-0"
    >

        <div class="table-responsive">

            <table class="table table-hover align-middle mb-0">

                <thead class="table-light">

                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>

                    <tr
                        v-for="order in filteredOrders"
                        :key="order.id"
                    >

                        <td>
                            <strong>{{ order.order_code }}</strong>
                        </td>

                        <td>

                            <div>{{ order.customer_name }}</div>

                            <small class="text-muted">
                                {{ order.customer_email }}
                            </small>

                        </td>

                        <td>

                            <div class="d-flex align-items-center">

                                <img
                                    :src="order.products?.image_url"
                                    width="50"
                                    height="50"
                                    class="rounded me-3"
                                    style="object-fit:cover"
                                >

                                {{ order.products?.name }}

                            </div>

                        </td>

                        <td>
                            {{ order.quantity }}
                        </td>

                        <td>
                            ₦{{ Number(order.total_amount).toLocaleString() }}
                        </td>

                        <td>

                            <select
                                v-model="order.status"
                                class="form-select"
                                @change="updateStatus(order)"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                        </td>

                        <td>
                            {{ new Date(order.created_at).toLocaleDateString() }}
                        </td>

                    </tr>

                    <tr v-if="filteredOrders.length === 0">

                        <td
                            colspan="7"
                            class="text-center py-5"
                        >
                            No orders found.
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

.search-box{
    width:320px;
    border-radius:10px;
}

.table th{
    font-weight:600;
}

.table td{
    vertical-align:middle;
}

img{
    border:1px solid #eee;
}

.form-select{
    border-radius:10px;
    min-width:150px;
}

.btn{
    border-radius:10px;
}
</style>