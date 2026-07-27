<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../../lib/supabase'

const route = useRoute()

const loading = ref(true)

const product = ref<any>(null)

const fetchProduct = async () => {

  loading.value = true

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_categories(name)
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

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString()}`
}

onMounted(fetchProduct)
</script>

<template>
  <div class="container py-5">

    <div
      v-if="loading"
      class="text-center py-5"
    >
      <div class="spinner-border text-primary"></div>
    </div>

    <div
      v-else-if="product"
      class="row g-5"
    >

      <!-- Product Image -->
      <div class="col-lg-5">

        <div class="card border-0 shadow rounded-4">

          <img
            :src="product.image_url"
            class="img-fluid rounded-4"
            style="height:500px;object-fit:cover;"
          >

        </div>

      </div>

      <!-- Product Details -->
      <div class="col-lg-7">

        <h2 class="fw-bold mb-3">
          {{ product.name }}
        </h2>

        <span class="badge bg-primary mb-3">
          {{ product.product_categories?.name }}
        </span>

        <h3 class="text-success fw-bold mb-4">
          {{ formatPrice(product.price) }}
        </h3>

        <div class="mb-3">
          <strong>Quantity Available</strong>
          <p>{{ product.quantity }}</p>
        </div>

        <div class="mb-4">
          <strong>Description</strong>

          <p class="text-muted">
            {{ product.description }}
          </p>
        </div>

        <div class="row">

          <div class="col-md-6 mb-3">

            <div class="card border-0 shadow-sm">

              <div class="card-body">

                <small class="text-muted">
                  Product ID
                </small>

                <h6>{{ product.id }}</h6>

              </div>

            </div>

          </div>

          <div class="col-md-6 mb-3">

            <div class="card border-0 shadow-sm">

              <div class="card-body">

                <small class="text-muted">
                  Date Added
                </small>

                <h6>
                  {{ new Date(product.created_at).toLocaleDateString() }}
                </h6>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
img{
    width:100%;
}

.card{
    border-radius:20px;
}

.badge{
    font-size:15px;
    padding:10px 18px;
}

h3{
    color:#198754;
}
</style>