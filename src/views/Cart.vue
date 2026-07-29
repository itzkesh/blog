<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
</script>

<template>

<div class="container py-5">

<h2 class="fw-bold mb-4">
Shopping Cart
</h2>

<div
v-if="cart.items.length===0"
class="alert alert-info"
>
Your cart is empty.
</div>

<div
v-else
class="row"
>

<div class="col-lg-8">

<div
v-for="item in cart.items"
:key="item.id"
class="card mb-3"
>

<div class="card-body">

<div class="row align-items-center">

<div class="col-md-2">

<img
:src="item.image_url"
class="img-fluid rounded"
/>

</div>

<div class="col-md-4">

<h5>{{ item.name }}</h5>

<p>
₦{{ item.price.toLocaleString() }}
</p>

</div>

<div class="col-md-3">

<div class="btn-group">

<button
class="btn btn-light"
@click="cart.decreaseQty(item.id)"
>
-
</button>

<button class="btn btn-light">
{{ item.quantity }}
</button>

<button
class="btn btn-light"
@click="cart.increaseQty(item.id)"
>
+
</button>

</div>

</div>

<div class="col-md-2">

<strong>

₦{{ (item.price * item.quantity).toLocaleString() }}

</strong>

</div>

<div class="col-md-1">

<button
class="btn btn-danger btn-sm"
@click="cart.removeFromCart(item.id)"
>
<i class="bi bi-trash"></i>
</button>

</div>

</div>

</div>

</div>

</div>

<div class="col-lg-4">

<div class="card">

<div class="card-body">

<h4>Summary</h4>

<hr>

<p>

Items

<strong class="float-end">

{{ cart.totalItems }}

</strong>

</p>

<h3>

₦{{ cart.totalPrice.toLocaleString() }}

</h3>

<RouterLink
to="/checkout"
class="btn btn-primary w-100"
>

Proceed to Checkout

</RouterLink>

</div>

</div>

</div>

</div>

</div>

</template>