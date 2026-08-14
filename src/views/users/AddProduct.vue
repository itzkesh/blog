<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const router = useRouter()

const categories = ref<any[]>([])
const loading = ref(false)
const imagePreview = ref('')

const name = ref('')
const category = ref('')
const description = ref('')
const price = ref<number | null>(null)
const quantity = ref<number | null>(null)
const image = ref<File | null>(null)

const errorMessage = ref('')
const successMessage = ref('')

/* =========================
   FETCH CATEGORIES
========================= */

const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name')

  if (error) {
    errorMessage.value = error.message
    return
  }

  categories.value = data || []
}

/* =========================
   IMAGE
========================= */

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (!target.files || !target.files[0]) return

  image.value = target.files[0]

  imagePreview.value = URL.createObjectURL(target.files[0])
}

/* =========================
   REMOVE IMAGE
========================= */

const removeImage = () => {
  image.value = null
  imagePreview.value = ''
}

/* =========================
   UPLOAD PRODUCT
========================= */

const uploadProduct = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!name.value.trim()) {
    errorMessage.value = 'Please enter a product name.'
    return
  }

  if (!category.value) {
    errorMessage.value = 'Please select a category.'
    return
  }

  if (!price.value || price.value <= 0) {
    errorMessage.value = 'Please enter a valid price.'
    return
  }

  if (
    quantity.value === null ||
    quantity.value < 0
  ) {
    errorMessage.value = 'Please enter a valid quantity.'
    return
  }

  if (!image.value) {
    errorMessage.value = 'Please select a product image.'
    return
  }

  try {
    loading.value = true

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Please login before adding a product.')
    }

    /* =========================
       UPLOAD IMAGE
    ========================= */

    const fileExtension =
      image.value.name.split('.').pop()

    const fileName =
      `${user.id}/${Date.now()}.${fileExtension}`

    const { error: uploadError } =
      await supabase.storage
        .from('products')
        .upload(fileName, image.value)

    if (uploadError) {
      throw uploadError
    }

    /* =========================
       GET IMAGE URL
    ========================= */

    const { data: publicUrlData } =
      supabase.storage
        .from('products')
        .getPublicUrl(fileName)

    const imageUrl =
      publicUrlData.publicUrl

    /* =========================
       INSERT PRODUCT
    ========================= */

    const { error: productError } =
      await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          category_id: Number(category.value),
          name: name.value.trim(),
          description: description.value.trim(),
          price: Number(price.value),
          quantity: Number(quantity.value),
          image_url: imageUrl
        })

    if (productError) {
      throw productError
    }

    successMessage.value =
      'Product added successfully!'

    setTimeout(() => {
      router.push('/auth/my-products')
    }, 1000)

  } catch (err: any) {

    console.error(err)

    errorMessage.value =
      err.message || 'Something went wrong.'

  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
</script>


<template>

  <div class="add-product-page">

    <!-- =========================
         HEADER
    ========================== -->

    <div class="page-header">

      <div>

        <div class="breadcrumb-text">
          <RouterLink to="/auth/dashboard">
            Dashboard
          </RouterLink>

          <i class="bi bi-chevron-right"></i>

          <span>Add Product</span>
        </div>

        <h1>
          Add New Product
        </h1>

        <p>
          Add a new product to your marketplace store.
        </p>

      </div>

      <RouterLink
        to="/auth/my-products"
        class="back-btn"
      >
        <i class="bi bi-arrow-left"></i>
        My Products
      </RouterLink>

    </div>


    <!-- =========================
         ALERTS
    ========================== -->

    <div
      v-if="errorMessage"
      class="alert-box error"
    >
      <i class="bi bi-exclamation-circle-fill"></i>

      <span>
        {{ errorMessage }}
      </span>

      <button
        type="button"
        @click="errorMessage = ''"
      >
        <i class="bi bi-x"></i>
      </button>

    </div>


    <div
      v-if="successMessage"
      class="alert-box success"
    >
      <i class="bi bi-check-circle-fill"></i>

      <span>
        {{ successMessage }}
      </span>
    </div>


    <!-- =========================
         FORM
    ========================== -->

    <form
      @submit.prevent="uploadProduct"
      class="product-form"
    >

      <div class="row g-4">


        <!-- =========================
             LEFT
        ========================== -->

        <div class="col-lg-8">

          <!-- BASIC INFORMATION -->

          <div class="form-card">

            <div class="card-heading">

              <div class="heading-icon blue">
                <i class="bi bi-box-seam"></i>
              </div>

              <div>
                <h3>
                  Product Information
                </h3>

                <p>
                  Enter the basic details of your product.
                </p>
              </div>

            </div>


            <!-- NAME -->

            <div class="form-group">

              <label>
                Product Name
                <span>*</span>
              </label>

              <input
                v-model="name"
                type="text"
                class="form-control custom-input"
                placeholder="e.g. iPhone 15 Pro Max"
              >

            </div>


            <!-- CATEGORY -->

            <div class="form-group">

              <label>
                Category
                <span>*</span>
              </label>

              <select
                v-model="category"
                class="form-select custom-input"
              >

                <option
                  disabled
                  value=""
                >
                  Select a category
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


            <!-- PRICE + QUANTITY -->

            <div class="row">

              <div class="col-md-6">

                <div class="form-group">

                  <label>
                    Price
                    <span>*</span>
                  </label>

                  <div class="input-with-icon">

                    <span>
                      ₦
                    </span>

                    <input
                      v-model="price"
                      type="number"
                      min="0"
                      class="form-control custom-input"
                      placeholder="0.00"
                    >

                  </div>

                </div>

              </div>


              <div class="col-md-6">

                <div class="form-group">

                  <label>
                    Quantity
                    <span>*</span>
                  </label>

                  <input
                    v-model="quantity"
                    type="number"
                    min="0"
                    class="form-control custom-input"
                    placeholder="e.g. 20"
                  >

                </div>

              </div>

            </div>


            <!-- DESCRIPTION -->

            <div class="form-group mb-0">

              <label>
                Description
                <span>*</span>
              </label>

              <textarea
                v-model="description"
                rows="7"
                class="form-control custom-input"
                placeholder="Describe your product, its features, condition and other important information..."
              ></textarea>

              <small>
                Give customers enough information to understand your product.
              </small>

            </div>

          </div>


          <!-- PRODUCT IMAGE -->

          <div class="form-card">

            <div class="card-heading">

              <div class="heading-icon purple">
                <i class="bi bi-image"></i>
              </div>

              <div>

                <h3>
                  Product Image
                </h3>

                <p>
                  Upload a clear image of your product.
                </p>

              </div>

            </div>


            <div
              v-if="!imagePreview"
              class="upload-area"
            >

              <input
                type="file"
                accept="image/*"
                @change="handleImage"
              >

              <div class="upload-icon">
                <i class="bi bi-cloud-arrow-up"></i>
              </div>

              <h4>
                Upload Product Image
              </h4>

              <p>
                Click to browse or drag and drop your image here.
              </p>

              <span>
                PNG, JPG or WEBP
              </span>

            </div>


            <!-- IMAGE PREVIEW -->

            <div
              v-else
              class="image-preview"
            >

              <img
                :src="imagePreview"
                alt="Product preview"
              >

              <div class="preview-overlay">

                <button
                  type="button"
                  @click="removeImage"
                  class="remove-image"
                >
                  <i class="bi bi-trash"></i>
                  Remove Image
                </button>

              </div>

            </div>

          </div>

        </div>


        <!-- =========================
             RIGHT
        ========================== -->

        <div class="col-lg-4">


          <!-- PRODUCT SUMMARY -->

          <div class="form-card sticky-card">

            <div class="card-heading">

              <div class="heading-icon green">
                <i class="bi bi-eye"></i>
              </div>

              <div>

                <h3>
                  Product Preview
                </h3>

                <p>
                  Preview your listing.
                </p>

              </div>

            </div>


            <div class="preview-card">

              <div class="preview-image">

                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Preview"
                >

                <div
                  v-else
                  class="preview-placeholder"
                >
                  <i class="bi bi-image"></i>
                  <span>
                    Product image
                  </span>
                </div>

              </div>


              <div class="preview-body">

                <span class="preview-category">

                  {{
                    categories.find(
                      item => item.id == category
                    )?.name || 'Category'
                  }}

                </span>

                <h4>
                  {{ name || 'Product Name' }}
                </h4>

                <p>
                  {{
                    description ||
                    'Your product description will appear here.'
                  }}
                </p>

                <div class="preview-footer">

                  <strong>
                    ₦{{
                      price
                        ? Number(price).toLocaleString()
                        : '0'
                    }}
                  </strong>

                  <span>
                    {{
                      quantity ?? 0
                    }}
                    in stock
                  </span>

                </div>

              </div>

            </div>

          </div>


          <!-- TIPS -->

          <div class="tips-card">

            <div class="tips-icon">
              <i class="bi bi-lightbulb"></i>
            </div>

            <div>

              <h4>
                Seller Tip
              </h4>

              <p>
                Use a clear, high-quality product image and provide detailed information to attract more buyers.
              </p>

            </div>

          </div>

        </div>

      </div>


      <!-- =========================
           ACTIONS
      ========================== -->

      <div class="form-actions">

        <RouterLink
          to="/auth/my-products"
          class="cancel-btn"
        >
          Cancel
        </RouterLink>

        <button
          type="submit"
          class="submit-btn"
          :disabled="loading"
        >

          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
          ></span>

          <i
            v-else
            class="bi bi-cloud-upload"
          ></i>

          {{
            loading
              ? 'Uploading Product...'
              : 'Upload Product'
          }}

        </button>

      </div>

    </form>

  </div>

</template>


<style scoped>

/* =========================
   PAGE
========================= */

.add-product-page {
  min-height: 100vh;
  padding: 10px 5px 60px;
  background: #f7f9fc;
}


/* =========================
   HEADER
========================= */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

.breadcrumb-text {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 12px;
}

.breadcrumb-text a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb-text i {
  font-size: 10px;
}

.page-header h1 {
  margin: 0 0 7px;
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 17px;
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  text-decoration: none;
  font-weight: 600;
  transition: .3s;
}

.back-btn:hover {
  color: #2563eb;
  border-color: #2563eb;
}


/* =========================
   ALERTS
========================= */

.alert-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  margin-bottom: 20px;
  border-radius: 13px;
  font-size: 14px;
}

.alert-box button {
  margin-left: auto;
  border: 0;
  background: transparent;
  font-size: 18px;
}

.alert-box.error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.alert-box.success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}


/* =========================
   FORM CARD
========================= */

.form-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 8px 30px rgba(15,23,42,.055);
  border: 1px solid #f1f5f9;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 23px;
  margin-bottom: 25px;
  border-bottom: 1px solid #f1f5f9;
}

.card-heading h3 {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 4px;
  color: #0f172a;
}

.card-heading p {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

.heading-icon {
  width: 45px;
  height: 45px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.heading-icon.blue {
  color: #2563eb;
  background: #dbeafe;
}

.heading-icon.purple {
  color: #7c3aed;
  background: #ede9fe;
}

.heading-icon.green {
  color: #16a34a;
  background: #dcfce7;
}


/* =========================
   INPUTS
========================= */

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.form-group label span {
  color: #ef4444;
}

.custom-input {
  min-height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  padding: 11px 14px;
  color: #0f172a;
  background: #fff;
  transition: .3s;
}

textarea.custom-input {
  min-height: 150px;
  resize: vertical;
}

.custom-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37,99,235,.08);
}

.form-group small {
  display: block;
  margin-top: 7px;
  color: #94a3b8;
  font-size: 12px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon > span {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 700;
  color: #64748b;
  z-index: 2;
}

.input-with-icon input {
  padding-left: 32px;
}


/* =========================
   UPLOAD
========================= */

.upload-area {
  position: relative;
  min-height: 280px;
  border: 2px dashed #cbd5e1;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #f8fafc;
  transition: .3s;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-area input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-icon {
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: #dbeafe;
  color: #2563eb;
  font-size: 28px;
  margin-bottom: 15px;
}

.upload-area h4 {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 7px;
  color: #1e293b;
}

.upload-area p {
  margin: 0 0 7px;
  color: #64748b;
  font-size: 13px;
}

.upload-area > span {
  color: #94a3b8;
  font-size: 12px;
}


/* =========================
   IMAGE PREVIEW
========================= */

.image-preview {
  height: 300px;
  border-radius: 17px;
  overflow: hidden;
  position: relative;
  background: #f1f5f9;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(
    transparent,
    rgba(0,0,0,.6)
  );
}

.remove-image {
  border: 0;
  border-radius: 10px;
  padding: 10px 17px;
  background: #ef4444;
  color: white;
  font-weight: 700;
}


/* =========================
   PRODUCT PREVIEW
========================= */

.sticky-card {
  position: sticky;
  top: 20px;
}

.preview-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.preview-image {
  height: 190px;
  background: #f1f5f9;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 8px;
}

.preview-placeholder i {
  font-size: 38px;
}

.preview-placeholder span {
  font-size: 12px;
}

.preview-body {
  padding: 18px;
}

.preview-category {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 50px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
}

.preview-body h4 {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #0f172a;
}

.preview-body p {
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
  min-height: 40px;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.preview-footer strong {
  color: #2563eb;
  font-size: 17px;
}

.preview-footer span {
  color: #64748b;
  font-size: 11px;
}


/* =========================
   TIPS
========================= */

.tips-card {
  display: flex;
  gap: 13px;
  padding: 18px;
  border-radius: 17px;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.tips-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #fef3c7;
  color: #d97706;
}

.tips-card h4 {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 5px;
  color: #92400e;
}

.tips-card p {
  margin: 0;
  color: #a16207;
  font-size: 12px;
  line-height: 1.6;
}


/* =========================
   ACTIONS
========================= */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 5px;
}

.cancel-btn {
  padding: 13px 22px;
  border-radius: 11px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
  text-decoration: none;
  font-weight: 700;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 180px;
  padding: 13px 22px;
  border: 0;
  border-radius: 11px;
  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );
  color: white;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(37,99,235,.2);
  transition: .3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(37,99,235,.3);
}

.submit-btn:disabled {
  opacity: .7;
  cursor: not-allowed;
}


/* =========================
   MOBILE
========================= */

@media(max-width: 768px) {

  .add-product-page {
    padding: 5px 0 40px;
  }

  .page-header {
    display: block;
  }

  .page-header h1 {
    font-size: 25px;
  }

  .back-btn {
    margin-top: 18px;
  }

  .form-card {
    padding: 20px;
    border-radius: 17px;
  }

  .sticky-card {
    position: static;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }

  .upload-area {
    min-height: 230px;
  }

}

</style>