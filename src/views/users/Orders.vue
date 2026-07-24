<script setup lang="ts">
import { ref } from 'vue'

const orders = ref([
  {
    id: 1,
    customer: 'John Doe',
    product: 'iPhone 15 Pro',
    quantity: 1,
    amount: 1350000,
    status: 'Pending',
    date: '2026-07-23'
  },
  {
    id: 2,
    customer: 'Mary Johnson',
    product: 'MacBook Air M3',
    quantity: 2,
    amount: 4200000,
    status: 'Completed',
    date: '2026-07-22'
  }
])

const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString()}`
}
</script>

<template>
  <div class="container-fluid py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Orders</h2>
        <p class="text-muted">
          Manage all orders placed for your products.
        </p>
      </div>
    </div>

    <div class="card shadow-sm border-0 rounded-4">

      <div class="table-responsive">

        <table class="table table-hover align-middle mb-0">

          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="(order, index) in orders"
              :key="order.id"
            >
              <td>{{ index + 1 }}</td>

              <td>{{ order.customer }}</td>

              <td>{{ order.product }}</td>

              <td>{{ order.quantity }}</td>

              <td>{{ formatCurrency(order.amount) }}</td>

              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-warning': order.status === 'Pending',
                    'bg-success': order.status === 'Completed',
                    'bg-danger': order.status === 'Cancelled'
                  }"
                >
                  {{ order.status }}
                </span>
              </td>

              <td>{{ order.date }}</td>

            </tr>

            <tr v-if="orders.length === 0">
              <td colspan="7" class="text-center py-5">
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
  font-size: 0.85rem;
}
</style>