<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cart = useCartStore()

/* =========================
   CUSTOMER INFORMATION
========================= */

const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const customerAddress = ref('')

const placing = ref(false)
const errorMessage = ref('')

/* =========================
   DELIVERY
========================= */

const deliveryFee = ref(0)

/* =========================
   TOTALS
========================= */

const subtotal = computed(() => {
  return cart.items.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  )
})

const total = computed(() => {
  return subtotal.value + deliveryFee.value
})


/* =========================
   FORMAT MONEY
========================= */

const formatMoney = (amount: number) => {
  return Number(amount).toLocaleString('en-NG')
}


/* =========================
   VALIDATE FORM
========================= */

const validateForm = () => {

  errorMessage.value = ''

  if (!customerName.value.trim()) {
    errorMessage.value = 'Please enter your full name.'
    return false
  }

  if (!customerEmail.value.trim()) {
    errorMessage.value = 'Please enter your email address.'
    return false
  }

  if (!customerPhone.value.trim()) {
    errorMessage.value = 'Please enter your phone number.'
    return false
  }

  if (!customerAddress.value.trim()) {
    errorMessage.value = 'Please enter your delivery address.'
    return false
  }

  if (!/^\S+@\S+\.\S+$/.test(customerEmail.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    return false
  }

  if (cart.items.length === 0) {
    errorMessage.value = 'Your cart is empty.'
    return false
  }

  return true
}


/* =========================
   PAYSTACK
========================= */

const payNow = () => {

  if (!validateForm()) {
    return
  }

  placing.value = true

  try {

    const PaystackPop = (window as any).PaystackPop

    if (!PaystackPop) {
      errorMessage.value =
        'Paystack could not be loaded. Please refresh the page and try again.'

      placing.value = false
      return
    }

    const handler = PaystackPop.setup({

      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

      email: customerEmail.value,

      amount: Math.round(total.value * 100),

      currency: 'NGN',

      metadata: {
        customer_name: customerName.value,
        phone: customerPhone.value,
        address: customerAddress.value
      },

      callback: function (response: any) {

        console.log('Payment successful:', response)

        alert(
          `Payment successful!\n\nReference: ${response.reference}`
        )

        /*
         * You can create the order here after payment.
         */

        cart.clearCart()

        router.push('/')
      },

      onClose: function () {

        placing.value = false

        console.log('Payment window closed')
      }

    })

    handler.openIframe()

  } catch (error) {

    console.error(error)

    errorMessage.value =
      'Something went wrong while starting payment.'

    placing.value = false
  }
}


/* =========================
   REMOVE ITEM
========================= */

const removeItem = (id: number) => {
  cart.removeFromCart(id)
}


/* =========================
   CLEAR CART
========================= */

const clearCart = () => {

  if (cart.items.length === 0) {
    router.push('/')
    return
  }

  const confirmClear = confirm(
    'Are you sure you want to clear your cart?'
  )

  if (!confirmClear) {
    return
  }

  cart.clearCart()

  router.push('/')
}


/* =========================
   UPDATE QUANTITY
========================= */

const increaseQuantity = (id: number) => {
  cart.increaseQty(id)
}

const decreaseQuantity = (id: number) => {
  cart.decreaseQty(id)
}
</script>


<template>

  <div class="checkout-page">

    <!-- =========================
         HEADER
    ========================== -->

    <section class="checkout-header">

      <div class="container">

        <div class="header-content">

          <div>

            <span class="checkout-badge">
              <i class="bi bi-shield-check"></i>
              Secure Checkout
            </span>

            <h1>
              Complete Your Order
            </h1>

            <p>
              Enter your details below and complete your payment securely.
            </p>

          </div>

          <div class="checkout-icon">
            <i class="bi bi-bag-check"></i>
          </div>

        </div>

      </div>

    </section>


    <!-- =========================
         MAIN CONTENT
    ========================== -->

    <div class="container checkout-container">

      <!-- EMPTY CART -->

      <div
        v-if="cart.items.length === 0"
        class="empty-checkout"
      >

        <div class="empty-icon">
          <i class="bi bi-cart-x"></i>
        </div>

        <h2>
          Your cart is empty
        </h2>

        <p>
          Add some products to your cart before checking out.
        </p>

        <button
          class="btn-primary-custom"
          @click="router.push('/')"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Continue Shopping
        </button>

      </div>


      <!-- CHECKOUT -->

      <div
        v-else
        class="row g-4 g-lg-5"
      >

        <!-- =========================
             CUSTOMER DETAILS
        ========================== -->

        <div class="col-lg-7">

          <div class="checkout-card">

            <div class="card-heading">

              <div class="heading-icon">
                <i class="bi bi-person"></i>
              </div>

              <div>

                <h3>
                  Customer Information
                </h3>

                <p>
                  Where should we deliver your order?
                </p>

              </div>

            </div>


            <!-- ERROR -->

            <div
              v-if="errorMessage"
              class="error-box"
            >
              <i class="bi bi-exclamation-circle"></i>

              <span>
                {{ errorMessage }}
              </span>
            </div>


            <form @submit.prevent="payNow">

              <!-- NAME -->

              <div class="form-group">

                <label>
                  Full Name
                  <span>*</span>
                </label>

                <div class="input-wrapper">

                  <i class="bi bi-person"></i>

                  <input
                    v-model="customerName"
                    type="text"
                    placeholder="Enter your full name"
                    autocomplete="name"
                  >

                </div>

              </div>


              <div class="row">

                <!-- EMAIL -->

                <div class="col-md-6">

                  <div class="form-group">

                    <label>
                      Email Address
                      <span>*</span>
                    </label>

                    <div class="input-wrapper">

                      <i class="bi bi-envelope"></i>

                      <input
                        v-model="customerEmail"
                        type="email"
                        placeholder="you@example.com"
                        autocomplete="email"
                      >

                    </div>

                  </div>

                </div>


                <!-- PHONE -->

                <div class="col-md-6">

                  <div class="form-group">

                    <label>
                      Phone Number
                      <span>*</span>
                    </label>

                    <div class="input-wrapper">

                      <i class="bi bi-telephone"></i>

                      <input
                        v-model="customerPhone"
                        type="tel"
                        placeholder="08012345678"
                        autocomplete="tel"
                      >

                    </div>

                  </div>

                </div>

              </div>


              <!-- ADDRESS -->

              <div class="form-group">

                <label>
                  Delivery Address
                  <span>*</span>
                </label>

                <div class="textarea-wrapper">

                  <i class="bi bi-geo-alt"></i>

                  <textarea
                    v-model="customerAddress"
                    rows="4"
                    placeholder="Enter your complete delivery address"
                    autocomplete="street-address"
                  ></textarea>

                </div>

              </div>


              <!-- SECURITY -->

              <div class="security-box">

                <div class="security-icon">
                  <i class="bi bi-shield-lock"></i>
                </div>

                <div>

                  <strong>
                    Your information is secure
                  </strong>

                  <p>
                    Your personal information is only used to process
                    and deliver your order.
                  </p>

                </div>

              </div>

            </form>

          </div>

        </div>


        <!-- =========================
             ORDER SUMMARY
        ========================== -->

        <div class="col-lg-5">

          <div class="summary-card">

            <div class="summary-header">

              <div>

                <h3>
                  Order Summary
                </h3>

                <span>
                  {{ cart.totalItems }}
                  item{{ cart.totalItems !== 1 ? 's' : '' }}
                </span>

              </div>

              <i class="bi bi-receipt"></i>

            </div>


            <!-- ITEMS -->

            <div class="order-items">

              <div
                v-for="item in cart.items"
                :key="item.id"
                class="order-item"
              >

                <div class="product-image">

                  <img
                    :src="item.image_url"
                    :alt="item.name"
                  >

                </div>


                <div class="product-info">

                  <h5>
                    {{ item.name }}
                  </h5>

                  <span>
                    ₦{{ formatMoney(Number(item.price)) }}
                  </span>


                  <div class="quantity-control">

                    <button
                      type="button"
                      @click="decreaseQuantity(item.id)"
                    >
                      −
                    </button>

                    <strong>
                      {{ item.quantity }}
                    </strong>

                    <button
                      type="button"
                      @click="increaseQuantity(item.id)"
                    >
                      +
                    </button>

                  </div>

                </div>


                <div class="item-right">

                  <strong>
                    ₦{{
                      formatMoney(
                        Number(item.price) *
                        Number(item.quantity)
                      )
                    }}
                  </strong>

                  <button
                    class="remove-btn"
                    type="button"
                    @click="removeItem(item.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>

                </div>

              </div>

            </div>


            <!-- TOTALS -->

            <div class="price-summary">

              <div class="price-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₦{{ formatMoney(subtotal) }}
                </strong>

              </div>


              <div class="price-row">

                <span>
                  Delivery
                </span>

                <strong>
                  ₦{{ formatMoney(deliveryFee) }}
                </strong>

              </div>


              <hr>


              <div class="total-row">

                <span>
                  Total
                </span>

                <strong>
                  ₦{{ formatMoney(total) }}
                </strong>

              </div>

            </div>


            <!-- PAY BUTTON -->

            <button
              class="pay-button"
              type="button"
              :disabled="placing"
              @click="payNow"
            >

              <span v-if="placing">

                <span class="spinner-border spinner-border-sm me-2"></span>

                Opening Payment...

              </span>

              <span v-else>

                <i class="bi bi-lock-fill me-2"></i>

                Pay ₦{{ formatMoney(total) }}

              </span>

              <i
                v-if="!placing"
                class="bi bi-arrow-right"
              ></i>

            </button>


            <div class="payment-note">

              <i class="bi bi-shield-check"></i>

              <span>
                Secure payment powered by Paystack
              </span>

            </div>


            <!-- CANCEL -->

            <button
              class="cancel-button"
              type="button"
              @click="clearCart"
            >

              <i class="bi bi-x-circle me-2"></i>

              Cancel Order & Clear Cart

            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>


<style scoped>

/* =========================================
   PAGE
========================================= */

.checkout-page {
  min-height: 100vh;
  background: #f5f7fb;
  padding-bottom: 80px;
}


/* =========================================
   HEADER
========================================= */

.checkout-header {
  position: relative;
  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  padding: 65px 0;

  color: white;
}

.checkout-header::before {
  content: "";

  position: absolute;

  width: 350px;
  height: 350px;

  border-radius: 50%;

  background: rgba(255,255,255,.08);

  top: -180px;
  right: -80px;
}

.checkout-header::after {
  content: "";

  position: absolute;

  width: 250px;
  height: 250px;

  border-radius: 50%;

  background: rgba(255,255,255,.06);

  bottom: -170px;
  left: -70px;
}

.header-content {
  position: relative;
  z-index: 2;

  display: flex;

  align-items: center;

  justify-content: space-between;
}

.checkout-badge {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 8px 16px;

  background: rgba(255,255,255,.15);

  border: 1px solid rgba(255,255,255,.2);

  border-radius: 50px;

  font-size: 13px;

  font-weight: 700;

  margin-bottom: 18px;
}

.header-content h1 {
  font-size: 42px;

  font-weight: 800;

  margin-bottom: 10px;
}

.header-content p {
  margin: 0;

  color: rgba(255,255,255,.8);

  font-size: 16px;
}

.checkout-icon {
  width: 100px;
  height: 100px;

  border-radius: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: rgba(255,255,255,.12);

  font-size: 45px;
}


/* =========================================
   CONTAINER
========================================= */

.checkout-container {
  margin-top: 45px;
}


/* =========================================
   CHECKOUT CARD
========================================= */

.checkout-card,
.summary-card {
  background: white;

  border-radius: 24px;

  box-shadow:
    0 15px 45px rgba(15,23,42,.07);

  border: 1px solid #eef2f7;
}


/* =========================================
   CUSTOMER CARD
========================================= */

.checkout-card {
  padding: 35px;
}

.card-heading {
  display: flex;

  align-items: center;

  gap: 15px;

  margin-bottom: 30px;
}

.heading-icon {
  width: 52px;
  height: 52px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 15px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 22px;
}

.card-heading h3 {
  margin: 0;

  font-size: 21px;

  font-weight: 800;
}

.card-heading p {
  margin: 3px 0 0;

  color: #64748b;

  font-size: 14px;
}


/* =========================================
   ERROR
========================================= */

.error-box {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 13px 15px;

  margin-bottom: 20px;

  border-radius: 12px;

  background: #fef2f2;

  border: 1px solid #fecaca;

  color: #dc2626;

  font-size: 14px;

  font-weight: 600;
}


/* =========================================
   FORM
========================================= */

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 14px;

  font-weight: 700;

  color: #334155;
}

.form-group label span {
  color: #ef4444;
}

.input-wrapper,
.textarea-wrapper {
  position: relative;
}

.input-wrapper i,
.textarea-wrapper i {
  position: absolute;

  left: 16px;
  top: 50%;

  transform: translateY(-50%);

  color: #94a3b8;

  z-index: 2;
}

.textarea-wrapper i {
  top: 20px;

  transform: none;
}

.input-wrapper input,
.textarea-wrapper textarea {
  width: 100%;

  border: 1px solid #e2e8f0;

  background: #f8fafc;

  border-radius: 13px;

  padding: 13px 15px 13px 45px;

  outline: none;

  font-size: 14px;

  transition: .25s;
}

.textarea-wrapper textarea {
  resize: vertical;

  padding-top: 15px;
}

.input-wrapper input:focus,
.textarea-wrapper textarea:focus {
  background: white;

  border-color: #2563eb;

  box-shadow:
    0 0 0 4px rgba(37,99,235,.08);
}


/* =========================================
   SECURITY
========================================= */

.security-box {
  display: flex;

  align-items: flex-start;

  gap: 13px;

  padding: 17px;

  background: #f0fdf4;

  border: 1px solid #bbf7d0;

  border-radius: 14px;

  margin-top: 10px;
}

.security-icon {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #dcfce7;

  color: #16a34a;
}

.security-box strong {
  display: block;

  font-size: 14px;

  color: #166534;
}

.security-box p {
  margin: 3px 0 0;

  font-size: 12px;

  color: #4d7c0f;
}


/* =========================================
   SUMMARY
========================================= */

.summary-card {
  overflow: hidden;

  position: sticky;

  top: 25px;
}

.summary-header {
  padding: 25px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom: 1px solid #eef2f7;
}

.summary-header h3 {
  margin: 0;

  font-size: 20px;

  font-weight: 800;
}

.summary-header span {
  font-size: 13px;

  color: #64748b;
}

.summary-header > i {
  font-size: 25px;

  color: #2563eb;
}


/* =========================================
   ORDER ITEMS
========================================= */

.order-items {
  padding: 10px 25px;
}

.order-item {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 15px 0;

  border-bottom: 1px solid #f1f5f9;
}

.product-image {
  width: 68px;
  height: 68px;

  flex-shrink: 0;

  border-radius: 13px;

  overflow: hidden;

  background: #f1f5f9;
}

.product-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.product-info {
  flex: 1;

  min-width: 0;
}

.product-info h5 {
  margin: 0 0 4px;

  font-size: 14px;

  font-weight: 700;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.product-info > span {
  color: #2563eb;

  font-size: 13px;

  font-weight: 700;
}


/* =========================================
   QUANTITY
========================================= */

.quantity-control {
  display: flex;

  align-items: center;

  width: fit-content;

  margin-top: 8px;

  border: 1px solid #e2e8f0;

  border-radius: 8px;

  overflow: hidden;
}

.quantity-control button {
  width: 27px;
  height: 27px;

  border: none;

  background: #f8fafc;

  font-weight: 700;

  cursor: pointer;
}

.quantity-control strong {
  width: 28px;

  text-align: center;

  font-size: 12px;
}


/* =========================================
   ITEM RIGHT
========================================= */

.item-right {
  text-align: right;

  align-self: flex-start;
}

.item-right > strong {
  display: block;

  font-size: 13px;

  color: #1e293b;
}

.remove-btn {
  border: none;

  background: transparent;

  color: #94a3b8;

  margin-top: 8px;

  cursor: pointer;

  transition: .2s;
}

.remove-btn:hover {
  color: #ef4444;
}


/* =========================================
   PRICE SUMMARY
========================================= */

.price-summary {
  padding: 20px 25px;
}

.price-row {
  display: flex;

  justify-content: space-between;

  margin-bottom: 13px;

  color: #64748b;

  font-size: 14px;
}

.price-row strong {
  color: #334155;
}

.price-summary hr {
  border-color: #eef2f7;

  margin: 18px 0;
}

.total-row {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.total-row span {
  font-size: 18px;

  font-weight: 800;
}

.total-row strong {
  font-size: 25px;

  font-weight: 800;

  color: #2563eb;
}


/* =========================================
   PAY BUTTON
========================================= */

.pay-button {
  width: calc(100% - 50px);

  margin: 0 25px;

  padding: 16px;

  border: none;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  font-size: 15px;

  font-weight: 800;

  display: flex;

  align-items: center;

  justify-content: space-between;

  cursor: pointer;

  transition: .3s;

  box-shadow:
    0 10px 25px rgba(37,99,235,.25);
}

.pay-button:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow:
    0 15px 35px rgba(37,99,235,.35);
}

.pay-button:disabled {
  opacity: .7;

  cursor: not-allowed;
}


/* =========================================
   PAYMENT NOTE
========================================= */

.payment-note {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding: 15px;

  color: #64748b;

  font-size: 12px;
}

.payment-note i {
  color: #16a34a;
}


/* =========================================
   CANCEL
========================================= */

.cancel-button {
  width: 100%;

  border: none;

  border-top: 1px solid #eef2f7;

  background: transparent;

  padding: 15px;

  color: #64748b;

  font-weight: 600;

  cursor: pointer;

  transition: .2s;
}

.cancel-button:hover {
  color: #ef4444;

  background: #fef2f2;
}


/* =========================================
   EMPTY
========================================= */

.empty-checkout {
  background: white;

  border-radius: 25px;

  padding: 80px 30px;

  text-align: center;

  box-shadow:
    0 15px 45px rgba(15,23,42,.07);
}

.empty-icon {
  width: 90px;
  height: 90px;

  margin: auto auto 20px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 38px;
}

.empty-checkout h2 {
  font-weight: 800;
}

.empty-checkout p {
  color: #64748b;

  margin-bottom: 25px;
}


/* =========================================
   CUSTOM BUTTON
========================================= */

.btn-primary-custom {
  border: none;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  padding: 13px 22px;

  border-radius: 12px;

  font-weight: 700;

  cursor: pointer;

  transition: .3s;
}

.btn-primary-custom:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 25px rgba(37,99,235,.3);
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 991px) {

  .summary-card {
    position: static;
  }

}

@media (max-width: 768px) {

  .header-content {
    display: block;
  }

  .checkout-icon {
    display: none;
  }

  .header-content h1 {
    font-size: 32px;
  }

  .checkout-card {
    padding: 25px;
  }

}

@media (max-width: 480px) {

  .checkout-header {
    padding: 45px 0;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .checkout-container {
    margin-top: 25px;
  }

  .checkout-card {
    padding: 20px;
  }

  .summary-header,
  .order-items,
  .price-summary {
    padding-left: 18px;
    padding-right: 18px;
  }

  .pay-button {
    width: calc(100% - 36px);

    margin-left: 18px;
    margin-right: 18px;
  }

}
</style>