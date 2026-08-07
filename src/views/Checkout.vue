<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { supabase } from '../lib/supabase'
declare const PaystackPop: any

const cart = useCartStore()
const router = useRouter()
const placing = ref(false)

const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const customerAddress = ref('')
const notes = ref('')

const orderCode = () => {
  return (
    'ORD-' +
    Date.now().toString().slice(-6) +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  )
}

const cancelOrder = () => {
  const confirmed = confirm(
    'Are you sure you want to cancel this order? Your cart will be cleared.'
  )

  if (!confirmed) return

  cart.clearCart()

  router.push('/')
}

const subtotal = computed(() => cart.totalPrice)
const deliveryFee = computed(() => 2500)
const total = computed(() => subtotal.value + deliveryFee.value)

const validateForm = () => {
  if (!customerName.value.trim()) {
    alert('Please enter your full name.')
    return false
  }

  if (!customerEmail.value.trim()) {
    alert('Please enter your email address.')
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(customerEmail.value)) {
    alert('Please enter a valid email address.')
    return false
  }

  if (!customerPhone.value.trim()) {
    alert('Please enter your phone number.')
    return false
  }

  if (!customerAddress.value.trim()) {
    alert('Please enter your delivery address.')
    return false
  }

  if (cart.items.length === 0) {
    alert('Your cart is empty.')
    return false
  }

  return true
}

const payNow = () => {

    if (!validateForm()) return

  const handler = PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

    email: customerEmail.value,

    amount: total.value * 100, // Kobo

    currency: 'NGN',

    firstname: customerName.value,

    metadata: {
      phone: customerPhone.value,
      address: customerAddress.value
    },

    callback: function (response: any) {
      alert('Payment Successful!')

      // Save order after payment
      placeOrder(response.reference)
    },

    onClose: function () {
      alert('Payment window closed.')
    }
  })

  handler.openIframe()
}

const placeOrder = async (reference: string) => {
  placing.value = true

  const { error } = await supabase
    .from('orders')
    .insert(
      cart.items.map(item => ({
        order_code: orderCode(),
        product_id: item.id,
        seller_id: item.seller_id,
        customer_name: customerName.value,
        customer_email: customerEmail.value,
        customer_phone: customerPhone.value,
        customer_address: customerAddress.value,
        quantity: item.quantity,
        total_amount: item.price * item.quantity,
        payment_status: 'Paid',
        payment_reference: reference,
        status: 'Pending'
      }))
    )

  placing.value = false

  if (error) {
    alert(error.message)
    return
  }

  cart.clearCart()
  router.push('/')
}
</script>

<template>
<div class="checkout-page py-5">

<div class="container">

<div class="mb-5">

<span class="badge bg-primary px-3 py-2">
Checkout
</span>

<h1 class="fw-bold mt-3">
Complete Your Order
</h1>

<p class="text-muted">
Fill in your details to complete your purchase.
</p>

</div>

<div class="row g-5">

<!-- Customer Information -->

<div class="col-lg-7">

<div class="card border-0 shadow-lg">

<div class="card-body p-5">

<h3 class="fw-bold mb-4">
Customer Information
</h3>

<form>

<div class="row">

<div class="col-md-6 mb-3">

<label class="form-label">
Full Name
</label>

<input
v-model="customerName"
type="text"
class="form-control"
placeholder="John Doe"
required
/>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">
Email
</label>

<input
v-model="customerEmail"
type="email"
class="form-control"
placeholder="john@example.com"
/>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">
Phone Number
</label>

<input
v-model="customerPhone"
type="text"
class="form-control"
placeholder="+234..."
/>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">
Delivery City
</label>

<input
class="form-control"
placeholder="Port Harcourt"
/>

</div>

</div>

<div class="mb-3">

<label class="form-label">
Delivery Address
</label>

<textarea
rows="4"
v-model="customerAddress"
class="form-control"
placeholder="Enter full address"
></textarea>

</div>

<div>

<label class="form-label">
Order Notes (Optional)
</label>

<textarea
rows="3"
v-model="notes"
class="form-control"
placeholder="Anything we should know?"
></textarea>

</div>

</form>

</div>

</div>

</div>

<!-- Order Summary -->

<div class="col-lg-5">

<div class="card border-0 shadow-lg sticky-top">

<div class="card-body p-4">

<h3 class="fw-bold mb-4">
Order Summary
</h3>

<div
v-for="item in cart.items"
:key="item.id"
class="product-item"
>

<img
:src="item.image_url"
class="product-image"
/>

<div class="flex-grow-1">

<h6 class="mb-1">
{{ item.name }}
</h6>

<small class="text-muted">
Qty: {{ item.quantity }}
</small>

</div>

<strong>

₦{{ (item.price * item.quantity).toLocaleString() }}

</strong>

</div>

<hr>

<div class="summary-row">

<span>Subtotal</span>

<strong>

₦{{ subtotal.toLocaleString() }}

</strong>

</div>

<div class="summary-row">

<span>Delivery</span>

<strong>

₦{{ deliveryFee.toLocaleString() }}

</strong>

</div>

<hr>

<div class="summary-row total">

<span>Total</span>

<h3>

₦{{ total.toLocaleString() }}

</h3>

</div>

<div class="row mt-4 g-3">

  <div class="col-6">
    <button
      class="btn btn-outline-danger w-100 btn-lg"
      @click="cancelOrder"
    >
      <i class="bi bi-trash3 me-2"></i>
      Cancel
    </button>
  </div>

  <div class="col-6">
    <button
      class="btn btn-primary btn-lg w-100"
      @click="payNow"
    >
      <i class="bi bi-lock-fill me-2"></i>
      Place Order
    </button>
  </div>

  <div class="text-center mt-3 text-muted small">
    <i class="bi bi-shield-lock-fill me-1"></i>
    Secure Checkout
  </div>

</div>
</div>
</div>

</div>

</div>

</div>

</div>
</template>

<style scoped>

.checkout-page{

background:#f5f7fb;

min-height:100vh;

}

.card{

border-radius:20px;

overflow:hidden;

}

.form-control{

border-radius:12px;

padding:14px;

border:1px solid #e5e7eb;

}

.form-control:focus{

box-shadow:0 0 0 .25rem rgba(13,110,253,.15);

}

.product-item{

display:flex;

align-items:center;

gap:15px;

margin-bottom:20px;

}

.product-image{

width:70px;

height:70px;

border-radius:12px;

object-fit:cover;

}

.summary-row{

display:flex;

justify-content:space-between;

margin-bottom:15px;

}

.total{

align-items:center;

font-weight:bold;

}

.btn{

border-radius:12px;

padding:15px;

font-weight:600;

transition:.3s;

}

.btn:hover{

transform:translateY(-3px);

}

.sticky-top{

top:100px;

}

.badge{

font-size:.9rem;

}

</style>