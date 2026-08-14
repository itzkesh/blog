<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const pageLoading = ref(true)

const categories = ref<any[]>([])

const name = ref('')
const description = ref('')
const price = ref<number | null>(null)
const quantity = ref<number | null>(null)
const category = ref<number | null>(null)

const image = ref<File | null>(null)
const currentImage = ref('')

/* =========================
   FETCH CATEGORIES
========================= */

const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error(error.message)
    return
  }

  categories.value = data || []
}

/* =========================
   FETCH PRODUCT
========================= */

const fetchProduct = async () => {
  pageLoading.value = true

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) {
    alert(error.message)
    router.push('/auth/my-products')
    return
  }

  name.value = data.name || ''
  description.value = data.description || ''
  price.value = data.price
  quantity.value = data.quantity
  category.value = data.category_id
  currentImage.value = data.image_url || ''

  pageLoading.value = false
}

/* =========================
   IMAGE
========================= */

const handleImage = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (!target.files || !target.files.length) {
    return
  }

  image.value = target.files[0]
}

/* =========================
   UPDATE PRODUCT
========================= */

const updateProduct = async () => {
  if (!name.value.trim()) {
    alert('Please enter a product name.')
    return
  }

  if (!category.value) {
    alert('Please select a category.')
    return
  }

  if (!price.value || price.value <= 0) {
    alert('Please enter a valid price.')
    return
  }

  if (quantity.value === null || quantity.value < 0) {
    alert('Please enter a valid quantity.')
    return
  }

  try {
    loading.value = true

    let imageUrl = currentImage.value

    /* =========================
       UPLOAD NEW IMAGE
    ========================= */

    if (image.value) {

      // Delete old image
      if (currentImage.value) {

        try {

          const oldPath =
            currentImage.value.split('/products/')[1]

          if (oldPath) {
            await supabase.storage
              .from('products')
              .remove([oldPath])
          }

        } catch (error) {
          console.warn('Could not delete old image:', error)
        }
      }

      // Create unique filename
      const fileName =
        `${Date.now()}-${image.value.name.replace(/\s+/g, '-')}`

      const { error: uploadError } =
        await supabase.storage
          .from('products')
          .upload(fileName, image.value)

      if (uploadError) {
        throw uploadError
      }

      const { data } =
        supabase.storage
          .from('products')
          .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    /* =========================
       UPDATE DATABASE
    ========================= */

    const { error } = await supabase
      .from('products')
      .update({
        name: name.value.trim(),
        description: description.value.trim(),
        category_id: category.value,
        price: price.value,
        quantity: quantity.value,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', route.params.id)

    if (error) {
      throw error
    }

    alert('Product updated successfully!')

    router.push('/auth/my-products')

  } catch (error: any) {

    console.error(error)

    alert(error.message || 'Something went wrong.')

  } finally {

    loading.value = false

  }
}

/* =========================
   CANCEL
========================= */

const cancelEdit = () => {
  router.push('/auth/my-products')
}

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchProduct()
  ])
})
</script>


<template>

  <div class="edit-page">

    <!-- =========================
         LOADING
    ========================== -->

    <div
      v-if="pageLoading"
      class="loading-screen"
    >

      <div class="spinner-border text-primary"></div>

      <p>
        Loading product...
      </p>

    </div>


    <!-- =========================
         PAGE
    ========================== -->

    <div
      v-else
      class="container py-4 py-lg-5"
    >

      <!-- Header -->

      <div class="page-header">

        <div>

          <span class="page-label">
            PRODUCT MANAGEMENT
          </span>

          <h1>
            Edit Product
          </h1>

          <p>
            Update your product information, pricing and inventory.
          </p>

        </div>

        <button
          type="button"
          class="back-btn"
          @click="cancelEdit"
        >

          <i class="bi bi-arrow-left"></i>

          Back to Products

        </button>

      </div>


      <!-- Main Card -->

      <div class="edit-card">

        <form
          @submit.prevent="updateProduct"
        >

          <div class="row g-0">


            <!-- =========================
                 IMAGE SECTION
            ========================== -->

            <div class="col-lg-5">

              <div class="image-section">

                <div class="section-title">

                  <div class="section-icon">
                    <i class="bi bi-image"></i>
                  </div>

                  <div>

                    <h5>
                      Product Image
                    </h5>

                    <p>
                      Upload a clear image of your product.
                    </p>

                  </div>

                </div>


                <!-- Current Image -->

                <div class="image-preview">

                  <img
                    v-if="currentImage"
                    :src="currentImage"
                    :alt="name"
                  >

                  <div
                    v-else
                    class="no-image"
                  >

                    <i class="bi bi-image"></i>

                    <span>
                      No image
                    </span>

                  </div>

                </div>


                <!-- Upload -->

                <label class="upload-box">

                  <i class="bi bi-cloud-arrow-up"></i>

                  <strong>
                    Choose a new image
                  </strong>

                  <span>
                    JPG, PNG or WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    @change="handleImage"
                  >

                </label>


                <div
                  v-if="image"
                  class="selected-file"
                >

                  <i class="bi bi-check-circle-fill"></i>

                  {{ image.name }}

                </div>

              </div>

            </div>


            <!-- =========================
                 FORM SECTION
            ========================== -->

            <div class="col-lg-7">

              <div class="form-section">

                <div class="section-title">

                  <div class="section-icon blue">
                    <i class="bi bi-pencil-square"></i>
                  </div>

                  <div>

                    <h5>
                      Product Information
                    </h5>

                    <p>
                      Update your product details below.
                    </p>

                  </div>

                </div>


                <!-- Product Name -->

                <div class="form-group">

                  <label>
                    Product Name
                  </label>

                  <div class="input-wrapper">

                    <i class="bi bi-box"></i>

                    <input
                      v-model="name"
                      type="text"
                      class="form-control"
                      placeholder="Enter product name"
                      required
                    >

                  </div>

                </div>


                <!-- Category -->

                <div class="form-group">

                  <label>
                    Category
                  </label>

                  <div class="input-wrapper">

                    <i class="bi bi-grid"></i>

                    <select
                      v-model="category"
                      class="form-control"
                      required
                    >

                      <option
                        :value="null"
                        disabled
                      >
                        Select category
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

                </div>


                <!-- Price + Quantity -->

                <div class="row">

                  <div class="col-md-6">

                    <div class="form-group">

                      <label>
                        Price
                      </label>

                      <div class="input-wrapper">

                        <span class="currency">
                          ₦
                        </span>

                        <input
                          v-model="price"
                          type="number"
                          min="0"
                          class="form-control currency-input"
                          placeholder="0"
                          required
                        >

                      </div>

                    </div>

                  </div>


                  <div class="col-md-6">

                    <div class="form-group">

                      <label>
                        Quantity
                      </label>

                      <div class="input-wrapper">

                        <i class="bi bi-stack"></i>

                        <input
                          v-model="quantity"
                          type="number"
                          min="0"
                          class="form-control"
                          placeholder="0"
                          required
                        >

                      </div>

                    </div>

                  </div>

                </div>


                <!-- Description -->

                <div class="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    v-model="description"
                    rows="6"
                    class="form-control description-input"
                    placeholder="Describe your product..."
                  ></textarea>

                  <small>
                    Give customers useful information about this product.
                  </small>

                </div>


                <!-- Actions -->

                <div class="form-actions">

                  <button
                    type="button"
                    class="cancel-btn"
                    :disabled="loading"
                    @click="cancelEdit"
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    class="update-btn"
                    :disabled="loading"
                  >

                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm"
                    ></span>

                    <i
                      v-else
                      class="bi bi-check-lg"
                    ></i>

                    {{ loading ? 'Updating...' : 'Update Product' }}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>

  </div>

</template>


<style scoped>

/* =========================
   PAGE
========================= */

.edit-page {
  min-height: 100vh;
  background: #f7f9fc;
}


/* =========================
   LOADING
========================= */

.loading-screen {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #64748b;
}

.loading-screen p {
  margin-top: 15px;
}


/* =========================
   HEADER
========================= */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.page-label {
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.page-header h1 {
  margin: 6px 0;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.back-btn {
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  padding: 11px 17px;
  border-radius: 11px;
  font-weight: 600;
  transition: .3s;
}

.back-btn:hover {
  color: #2563eb;
  border-color: #bfdbfe;
  transform: translateY(-2px);
}


/* =========================
   MAIN CARD
========================= */

.edit-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(15, 23, 42, .07);
}


/* =========================
   IMAGE SECTION
========================= */

.image-section {
  height: 100%;
  padding: 35px;
  background: #f8fafc;
  border-right: 1px solid #eef2f7;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 25px;
}

.section-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #ede9fe;
  color: #7c3aed;
  font-size: 19px;
  flex-shrink: 0;
}

.section-icon.blue {
  background: #dbeafe;
  color: #2563eb;
}

.section-title h5 {
  margin: 0 0 4px;
  font-weight: 800;
  color: #0f172a;
}

.section-title p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}


/* =========================
   IMAGE PREVIEW
========================= */

.image-preview {
  width: 100%;
  height: 360px;
  border-radius: 18px;
  overflow: hidden;
  background: #e2e8f0;
  margin-bottom: 18px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.no-image i {
  font-size: 50px;
  margin-bottom: 10px;
}


/* =========================
   UPLOAD
========================= */

.upload-box {
  position: relative;
  min-height: 115px;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .3s;
}

.upload-box:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-box i {
  font-size: 27px;
  color: #2563eb;
  margin-bottom: 6px;
}

.upload-box strong {
  color: #334155;
  font-size: 14px;
}

.upload-box span {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 3px;
}

.upload-box input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}


.selected-file {
  margin-top: 12px;
  padding: 10px 13px;
  border-radius: 10px;
  background: #dcfce7;
  color: #15803d;
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-file i {
  margin-right: 6px;
}


/* =========================
   FORM
========================= */

.form-section {
  padding: 35px;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.input-wrapper {
  position: relative;
}

.input-wrapper > i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 2;
}

.form-control {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 15px;
  color: #0f172a;
  background: white;
  transition: .3s;
}

.input-wrapper .form-control {
  padding-left: 43px;
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, .08);
}

select.form-control {
  cursor: pointer;
}

.currency {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 700;
  z-index: 2;
}

.currency-input {
  padding-left: 32px !important;
}

.description-input {
  resize: vertical;
  min-height: 140px;
}

.form-group small {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  margin-top: 7px;
}


/* =========================
   ACTIONS
========================= */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.cancel-btn,
.update-btn {
  border: 0;
  border-radius: 11px;
  padding: 12px 20px;
  font-weight: 700;
  transition: .3s;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.update-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 170px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, .2);
}

.update-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, .3);
}

.update-btn:disabled,
.cancel-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 991px) {

  .image-section {
    border-right: 0;
    border-bottom: 1px solid #eef2f7;
  }

}


@media (max-width: 768px) {

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .back-btn {
    width: 100%;
  }

  .image-section,
  .form-section {
    padding: 24px 20px;
  }

  .image-preview {
    height: 280px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .update-btn {
    width: 100%;
  }

}

</style>