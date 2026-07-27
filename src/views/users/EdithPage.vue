<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const categories = ref<any[]>([])

const name = ref('')
const description = ref('')
const price = ref<number | null>(null)
const quantity = ref<number | null>(null)
const category = ref<number | null>(null)

const image = ref<File | null>(null)

const currentImage = ref('')

const fetchCategories = async () => {
  const { data } = await supabase
    .from('product_categories')
    .select('*')
    .order('name')

  categories.value = data || []
}

const fetchProduct = async () => {

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) {
    alert(error.message)
    return
  }

  name.value = data.name
  description.value = data.description
  price.value = data.price
  quantity.value = data.quantity
  category.value = data.category_id
  currentImage.value = data.image_url
}

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (target.files) {
    image.value = target.files[0]
  }
}

const updateProduct = async () => {

  try {

    loading.value = true

    let imageUrl = currentImage.value

    if (image.value) {

      // Delete old image
      if (currentImage.value) {

        const oldPath =
          currentImage.value.split('/products/')[1]

        await supabase.storage
          .from('products')
          .remove([oldPath])
      }

      // Upload new image
      const fileName =
        `${Date.now()}-${image.value.name}`

      const { error: uploadError } =
        await supabase.storage
          .from('products')
          .upload(fileName, image.value)

      if (uploadError) throw uploadError

      const { data } =
        supabase.storage
          .from('products')
          .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: name.value,
        description: description.value,
        category_id: category.value,
        price: price.value,
        quantity: quantity.value,
        image_url: imageUrl,
        updated_at: new Date()
      })
      .eq('id', route.params.id)

    if (error) throw error

    alert('Product updated successfully.')

    router.push('/auth/my-products')

  } catch (err: any) {
    alert(err.message)
  } finally {
    loading.value = false
  }

}

onMounted(() => {
  fetchCategories()
  fetchProduct()
})
</script>

<template>
<div class="container py-5">

<div class="col-lg-8 mx-auto">

<div class="card shadow border-0 rounded-4">

<div class="card-body">

<h2 class="fw-bold mb-4">
Edit Product
</h2>

<form @submit.prevent="updateProduct">

<div class="mb-3">
<label class="form-label">
Product Name
</label>

<input
v-model="name"
class="form-control"
>
</div>

<div class="mb-3">
<label class="form-label">
Category
</label>

<select
v-model="category"
class="form-select"
>

<option
v-for="item in categories"
:key="item.id"
:value="item.id"
>
{{ item.name }}
</option>

</select>
</div>

<div class="mb-3">
<label class="form-label">
Price
</label>

<input
v-model="price"
type="number"
class="form-control"
>
</div>

<div class="mb-3">
<label class="form-label">
Quantity
</label>

<input
v-model="quantity"
type="number"
class="form-control"
>
</div>

<div class="mb-3">

<img
:src="currentImage"
class="img-fluid rounded mb-3"
style="max-height:220px"
>

<input
type="file"
class="form-control"
@change="handleImage"
>

</div>

<div class="mb-4">
<label class="form-label">
Description
</label>

<textarea
v-model="description"
rows="6"
class="form-control"
></textarea>
</div>

<button
class="btn btn-primary"
:disabled="loading"
>

<span
v-if="loading"
class="spinner-border spinner-border-sm me-2"
></span>

{{ loading ? 'Updating...' : 'Update Product' }}

</button>

</form>

</div>

</div>

</div>
</div>
</template>