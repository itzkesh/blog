<template>
<nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-3">

  <div class="container">

    <!-- Logo -->
    <RouterLink
      to="/"
      class="navbar-brand fw-bold fs-1 text-dark"
    >
      <span class="text-primary">Market</span>Hub
    </RouterLink>

    <!-- Search -->
    <form
      class="search-box mx-auto"
      @submit.prevent
    >

      <div class="input-group">

        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>

        <input
          v-model="search"
          type="search"
          class="form-control"
          placeholder="Search products, brands and categories"
        >

        <button class="btn btn-warning px-4">
          Search
        </button>

      </div>

    </form>

    <!-- Right Menu -->

    <div class="d-flex align-items-center gap-4">

      <RouterLink
        to="/account"
        class="nav-link icon-link"
      >
        <i class="bi bi-person fs-4"></i>

        <span>Account</span>
      </RouterLink>

      <RouterLink
        to="/help"
        class="nav-link icon-link"
      >
        <i class="bi bi-question-circle fs-4"></i>

        <span>Help</span>
      </RouterLink>

      <RouterLink
        to="/cart"
        class="nav-link position-relative icon-link"
      >

        <i class="bi bi-cart3 fs-3"></i>

        <span>Cart</span>

        <span
          v-if="cart.totalItems"
          class="badge bg-danger rounded-pill cart-badge"
        >
          {{ cart.totalItems }}
        </span>

      </RouterLink>

    </div>

  </div>

</nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

const search = ref('')
</script>

<style scoped>

.navbar{
    border-bottom:1px solid #eee;
}

.navbar-brand{
    font-weight:900;
}

.search-box{
    width:55%;
}

.input-group{
    background:#f5f5f5;
    border-radius:40px;
    overflow:hidden;
    border:2px solid transparent;
    transition:.3s;
}

.input-group:focus-within{
    border-color:#f68b1e;
}

.input-group-text{
    background:transparent;
    border:none;
    padding-left:18px;
}

.form-control{
    border:none;
    background:transparent;
    box-shadow:none;
    height:56px;
}

.btn-warning{
    background:#f68b1e;
    border:none;
    color:#fff;
    font-weight:600;
    border-radius:35px;
    margin:6px;
}

.btn-warning:hover{
    background:#e07a15;
}

.icon-link{
    display:flex;
    align-items:center;
    gap:8px;
    color:#222;
    text-decoration:none;
    font-weight:500;
}

.icon-link:hover{
    color:#f68b1e;
}

.cart-badge{
    position:absolute;
    top:-8px;
    right:-10px;
}

@media(max-width:992px){

.search-box{
    width:100%;
    margin:20px 0;
}

.navbar .container{
    gap:20px;
}

}

</style>