<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const placing = ref(false)

const product = ref<any>(null)

const customer_name = ref('')
const customer_email = ref('')
const customer_phone = ref('')
const customer_address = ref('')
const quantity = ref(1)

const orderCode = () => {
  return (
    'ORD-' +
    Date.now().toString().slice(-6) +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  )
}

const total = computed(() => {
  if (!product.value) return 0
  return Number(product.value.price) * quantity.value
})

const getProduct = async () => {
  loading.value = true

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      seller_profiles(username)
    `)
    .eq('id', route.params.id)
    .single()

  if (error) {
    alert(error.message)
  } else {
    product.value = data
  }

  loading.value = false
}

const placeOrder = async () => {
  if (!product.value) return

  placing.value = true

  const { error } = await supabase
    .from('orders')
    .insert({
      order_code: orderCode(),

      product_id: product.value.id,

      seller_id: product.value.seller_id,

      customer_name: customer_name.value,

      customer_email: customer_email.value,

      customer_phone: customer_phone.value,

      customer_address: customer_address.value,

      quantity: quantity.value,

      total_amount: total.value,

      status: 'Pending',

      payment_status: 'Pending'
    })

  placing.value = false

  if (error) {
    alert(error.message)
    console.error(error)
    return
  }

  alert('Order placed successfully!')

  router.push('/')

}

onMounted(() => {
  getProduct()
})
</script>

<template>
<div class="container py-5">

<div v-if="loading" class="text-center py-5">
<div class="spinner-border text-primary"></div>
</div>

<div
v-else
class="row g-5"
>

<div class="col-lg-5">

<div class="card border-0 shadow-lg rounded-4">

<img
:src="product.image_url"
class="card-img-top"
style="height:420px;object-fit:cover"
/>

<div class="card-body">

<h3 class="fw-bold">
{{ product.name }}
</h3>

<p class="text-muted">
{{ product.description }}
</p>

<h2 class="text-primary fw-bold">
₦{{ Number(product.price).toLocaleString() }}
</h2>

<p class="mb-0">
Available:
<strong>{{ product.quantity }}</strong>
</p>

</div>

</div>

</div>

<div class="col-lg-7">

<div class="card shadow-lg border-0 rounded-4">

<div class="card-body p-5">

<h2 class="fw-bold mb-4">
Place Order
</h2>

<form @submit.prevent="placeOrder">

<div class="row">

<div class="col-md-6 mb-3">

<label class="form-label">
Full Name
</label>

<input
v-model="customer_name"
class="form-control"
required
/>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">
Email
</label>

<input
type="email"
v-model="customer_email"
class="form-control"
required
/>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">
Phone Number
</label>

<input
v-model="customer_phone"
class="form-control"
required
/>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">
Quantity
</label>

<input
type="number"
min="1"
:max="product.quantity"
v-model="quantity"
class="form-control"
/>

</div>

</div>

<div class="mb-3">

<label class="form-label">
Delivery Address
</label>

<textarea
rows="4"
v-model="customer_address"
class="form-control"
required
></textarea>

</div>

<div class="alert alert-light border">

<div class="d-flex justify-content-between">

<span>Unit Price</span>

<strong>
₦{{ Number(product.price).toLocaleString() }}
</strong>

</div>

<hr>

<div class="d-flex justify-content-between">

<h5>Total</h5>

<h4 class="text-primary">
₦{{ total.toLocaleString() }}
</h4>

</div>

</div>

<button
class="btn btn-primary btn-lg w-100"
:disabled="placing"
>

<span
v-if="placing"
class="spinner-border spinner-border-sm me-2"
></span>

{{ placing ? 'Placing Order...' : 'Place Order' }}

</button>

</form>

</div>

</div>

</div>

</div>

</div>
</template>

<style scoped>
.card{
border-radius:20px;
overflow:hidden;
}

.form-control{
border-radius:12px;
padding:12px;
}

.btn{
border-radius:12px;
padding:14px;
font-weight:600;
}

.card:hover{
transform:translateY(-3px);
transition:.3s;
}

img{
border-bottom:1px solid #eee;
}
</style>