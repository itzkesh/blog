<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const router = useRouter()

const categories = ref<any[]>([])

const loading = ref(false)

const name = ref('')
const category = ref('')
const description = ref('')
const price = ref<number | null>(null)
const quantity = ref<number | null>(null)

const image = ref<File | null>(null)

const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name')

  if (!error) {
    categories.value = data
  }
}

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (target.files) {
    image.value = target.files[0]
  }
}

const uploadProduct = async () => {
  try {
    loading.value = true

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Please login.')
    }

    let imageUrl = ''

    if (image.value) {
      const fileName =
        `${Date.now()}-${image.value.name}`

      const { error: uploadError } =
        await supabase.storage
          .from('products')
          .upload(fileName, image.value)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const { error } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        category_id: category.value,
        name: name.value,
        description: description.value,
        price: price.value,
        quantity: quantity.value,
        image_url: imageUrl
      })

    if (error) throw error

    alert('Product uploaded successfully.')

    router.push('/auth/my-products')

  } catch (err: any) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="container py-5">

    <div class="col-lg-8 mx-auto">

      <div class="card shadow border-0 rounded-4">

        <div class="card-body p-4">

          <h2 class="fw-bold mb-2">
            Add New Product
          </h2>

          <p class="text-muted mb-4">
            Fill in the details below to list your product.
          </p>

          <form @submit.prevent="uploadProduct">

            <!-- Product Name -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Product Name
              </label>

              <input
                type="text"
                v-model="name"
                class="form-control"
                placeholder="Enter product name"
              >
            </div>

            <!-- Category -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Category
              </label>

              <select
                  v-model="category"
                  class="form-select"
              >

                  <option disabled value="">
                      Select Category
                  </option>

                  <option
                      v-for="item in categories"
                      :key="item.id"
                      :value="item.id"
                  >
                      {{ item.name }}
                  </option>

              </select>
            </div>

            <!-- Price -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Price (₦)
              </label>

              <input
                type="number"
                v-model="price"
                class="form-control"
                placeholder="Enter product price"
              >
            </div>

            <!-- Quantity -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Quantity
              </label>

              <input
                type="number"
                v-model="quantity"
                class="form-control"
                placeholder="Available quantity"
              >
            </div>

            <!-- Product Image -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Product Image
              </label>

              <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="handleImage"
              />
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="form-label fw-semibold">
                Description
              </label>

              <textarea
                rows="6"
                 v-model="description"
                class="form-control"
                placeholder="Describe your product..."
              ></textarea>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-end gap-3">

              <RouterLink
                to="/auth/my-products"
                class="btn btn-secondary"
              >
                Cancel
              </RouterLink>

              <button
                  class="btn btn-primary"
                  type="submit"
                  :disabled="loading"
              >
                  <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm me-2"
                  ></span>

                  {{ loading ? 'Uploading...' : 'Upload Product' }}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  </div>
</template>
