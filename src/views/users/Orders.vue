<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

<div class="container-fluid py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

            <h2 class="fw-bold">
                Orders
            </h2>

            <p class="text-muted">
                Orders placed by customers.
            </p>

        </div>

    </div>

    <div
        v-if="loading"
        class="text-center py-5"
    >

        <div class="spinner-border text-primary"></div>

    </div>

    <div
        v-else-if="orders.length===0"
        class="alert alert-info"
    >
        No orders yet.
    </div>

    <div
        v-else
        class="row g-4"
    >

        <div
            v-for="order in orders"
            :key="order.id"
            class="col-lg-6"
        >

            <div class="card shadow border-0 h-100">

                <div class="card-body">

                    <div class="d-flex">

                        <img
                            :src="order.products?.image_url"
                            width="120"
                            height="120"
                            class="rounded me-3"
                            style="object-fit:cover"
                        >

                        <div>

                            <h5 class="fw-bold">
                                {{ order.products?.name }}
                            </h5>

                            <p class="text-primary fw-bold">
                                ₦{{ Number(order.total_amount).toLocaleString() }}
                            </p>

                            <span class="badge bg-dark">
                                {{ order.order_code }}
                            </span>

                        </div>

                    </div>

                    <hr>

                    <h6 class="fw-bold">
                        Customer Information
                    </h6>

                    <p class="mb-1">
                        <strong>Name:</strong>
                        {{ order.customer_name }}
                    </p>

                    <p class="mb-1">
                        <strong>Email:</strong>
                        {{ order.customer_email }}
                    </p>

                    <p class="mb-1">
                        <strong>Phone:</strong>
                        {{ order.customer_phone }}
                    </p>

                    <p class="mb-1">
                        <strong>Address:</strong>
                        {{ order.customer_address }}
                    </p>

                    <p class="mb-3">
                        <strong>Quantity:</strong>
                        {{ order.quantity }}
                    </p>

                    <div class="row">

                        <div class="col-md-6">

                            <label class="form-label">
                                Order Status
                            </label>

                            <select
                                v-model="order.status"
                                class="form-select"
                            >

                                <option>Pending</option>
                                <option>Confirmed</option>
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>

                            </select>

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">
                                Payment
                            </label>

                            <input
                                class="form-control"
                                :value="order.payment_status"
                                disabled
                            >

                        </div>

                    </div>

                    <button
                        class="btn btn-primary mt-4 w-100"
                        @click="updateStatus(order)"
                    >
                        Update Order
                    </button>

                </div>

            </div>

        </div>

    </div>

</div>

</template>

<style scoped>
.card{
    border-radius:20px;
    transition:.3s;
}

.card:hover{
    transform:translateY(-5px);
}

img{
    border:1px solid #eee;
}

.badge{
    font-size:.8rem;
}

.form-select,
.form-control{
    border-radius:10px;
}

.btn{
    border-radius:10px;
}
</style>