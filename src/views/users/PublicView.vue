<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../../lib/supabase'

const route = useRoute()

const loading = ref(true)
const product = ref<any>(null)

const getProduct = async () => {
  loading.value = true

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_categories(name),
      seller_profiles(username,email,phone_number,address)
    `)
    .eq('id', route.params.id)
    .single()

  if (error) {
    console.error(error.message)
  } else {
    product.value = data
  }

  loading.value = false
}

onMounted(getProduct)
</script>

<template>
  <div class="container py-5">

    <div
      v-if="loading"
      class="text-center py-5"
    >
      <div class="spinner-border"></div>
    </div>

    <div
      v-else-if="product"
      class="row g-5"
    >

      <!-- Image -->
      <div class="col-lg-6">
        <img
          :src="product.image_url"
          class="img-fluid rounded shadow"
        >
      </div>

      <!-- Details -->
      <div class="col-lg-6">

        <span class="badge bg-primary mb-3">
          {{ product.product_categories?.name }}
        </span>

        <h2 class="fw-bold">
          {{ product.name }}
        </h2>

        <h3 class="text-primary my-3">
          ₦{{ Number(product.price).toLocaleString() }}
        </h3>

        <p>
          {{ product.description }}
        </p>

        <p>
          <strong>Available:</strong>
          {{ product.quantity }}
        </p>

        <hr>

        <h5>Seller</h5>

        <p>
          <strong>{{ product.seller_profiles?.username }}</strong>
        </p>

        <p>
          {{ product.seller_profiles?.address }}
        </p>

        <p>
          {{ product.seller_profiles?.phone_number }}
        </p>

        <button class="btn btn-primary btn-lg">
          Contact Seller
        </button>

      </div>

    </div>

  </div>
</template>