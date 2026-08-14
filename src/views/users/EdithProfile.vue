<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)

const username = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')

const errorMessage = ref('')
const successMessage = ref('')

/* =========================
   GET PROFILE
========================= */

const getProfile = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      throw error
    }

    username.value = data.username || ''
    email.value = data.email || ''
    phone.value = data.phone_number || ''
    address.value = data.address || ''

  } catch (error: any) {
    console.error(error)
    errorMessage.value =
      error.message || 'Unable to load profile.'

  } finally {
    loading.value = false
  }
}


/* =========================
   UPDATE PROFILE
========================= */

const updateProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  /* Validation */

  if (!username.value.trim()) {
    errorMessage.value = 'Username is required.'
    return
  }

  if (!email.value.trim()) {
    errorMessage.value = 'Email is required.'
    return
  }

  try {
    saving.value = true

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    /* Update seller profile */

    const { error } = await supabase
      .from('seller_profiles')
      .update({
        username: username.value.trim(),
        email: email.value.trim(),
        phone_number: phone.value.trim() || null,
        address: address.value.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      throw error
    }

    /* Success message */

    successMessage.value =
      'Profile updated successfully!'

    /*
      Go back to profile after
      a short delay.
    */

    setTimeout(() => {
      router.push('/auth/profile')
    }, 1000)

  } catch (error: any) {
    console.error(error)

    errorMessage.value =
      error.message || 'Failed to update profile.'

  } finally {
    saving.value = false
  }
}


/* =========================
   LOAD PROFILE
========================= */

onMounted(() => {
  getProfile()
})
</script>


<template>

  <div class="edit-profile-page">

    <div class="container py-5">

      <!-- =========================
           PAGE HEADER
      ========================== -->

      <div class="page-header">

        <div>

          <span class="page-label">

            <i class="bi bi-person-gear"></i>

            ACCOUNT SETTINGS

          </span>

          <h1>
            Edit Profile
          </h1>

          <p>
            Update your seller information and account details.
          </p>

        </div>


        <RouterLink
          to="/profile"
          class="back-btn"
        >

          <i class="bi bi-arrow-left"></i>

          Back to Profile

        </RouterLink>

      </div>


      <!-- =========================
           LOADING
      ========================== -->

      <div
        v-if="loading"
        class="loading-container"
      >

        <div class="spinner-border text-primary"></div>

        <p>
          Loading your profile...
        </p>

      </div>


      <!-- =========================
           EDIT CARD
      ========================== -->

      <div
        v-else
        class="edit-card"
      >

        <!-- CARD HEADER -->

        <div class="card-header-custom">

          <div class="header-icon">

            <i class="bi bi-person"></i>

          </div>


          <div>

            <h4>
              Personal Information
            </h4>

            <p>
              Keep your profile information up to date.
            </p>

          </div>

        </div>


        <!-- =========================
             FORM
        ========================== -->

        <form
          class="profile-form"
          @submit.prevent="updateProfile"
        >

          <!-- ERROR -->

          <div
            v-if="errorMessage"
            class="alert alert-danger"
          >

            <i class="bi bi-exclamation-circle me-2"></i>

            {{ errorMessage }}

          </div>


          <!-- SUCCESS -->

          <div
            v-if="successMessage"
            class="alert alert-success"
          >

            <i class="bi bi-check-circle me-2"></i>

            {{ successMessage }}

          </div>


          <!-- USERNAME -->

          <div class="form-group">

            <label>

              Username

              <span>*</span>

            </label>


            <div class="input-wrapper">

              <i class="bi bi-person"></i>

              <input
                v-model="username"
                type="text"
                class="form-control"
                placeholder="Enter your username"
                required
              >

            </div>

          </div>


          <!-- EMAIL -->

          <div class="form-group">

            <label>

              Email Address

              <span>*</span>

            </label>


            <div class="input-wrapper">

              <i class="bi bi-envelope"></i>

              <input
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Enter your email"
                required
              >

            </div>


            <small>
              This is the email associated with your seller profile.
            </small>

          </div>


          <!-- PHONE -->

          <div class="form-group">

            <label>
              Phone Number
            </label>


            <div class="input-wrapper">

              <i class="bi bi-telephone"></i>

              <input
                v-model="phone"
                type="tel"
                class="form-control"
                placeholder="Enter your phone number"
              >

            </div>

          </div>


          <!-- ADDRESS -->

          <div class="form-group">

            <label>
              Address
            </label>


            <div class="input-wrapper textarea-wrapper">

              <i class="bi bi-geo-alt"></i>

              <textarea
                v-model="address"
                class="form-control"
                rows="4"
                placeholder="Enter your address"
              ></textarea>

            </div>

          </div>


          <!-- =========================
               BUTTONS
          ========================== -->

          <div class="form-actions">

            <RouterLink
              to="/profile"
              class="cancel-btn"
            >

              <i class="bi bi-x-lg"></i>

              Cancel

            </RouterLink>


            <button
              type="submit"
              class="save-btn"
              :disabled="saving"
            >

              <span
                v-if="saving"
                class="spinner-border spinner-border-sm"
              ></span>


              <i
                v-else
                class="bi bi-check-lg"
              ></i>


              {{ saving
                ? 'Saving Changes...'
                : 'Save Changes'
              }}

            </button>

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

.edit-profile-page {
  min-height: 100vh;
  background: #f7f9fc;
}


/* =========================
   HEADER
========================= */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
}

.page-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}

.page-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}

.page-header p {
  margin: 7px 0 0;
  color: #64748b;
}


/* =========================
   BACK BUTTON
========================= */

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 17px;
  border-radius: 11px;
  background: white;
  color: #475569;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  transition: .3s;
}

.back-btn:hover {
  color: #2563eb;
  border-color: #bfdbfe;
  transform: translateY(-2px);
}


/* =========================
   LOADING
========================= */

.loading-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #64748b;
}

.loading-container p {
  margin-top: 15px;
}


/* =========================
   CARD
========================= */

.edit-card {
  max-width: 850px;
  margin: auto;
  background: white;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #eef2f7;
  box-shadow: 0 15px 45px rgba(15, 23, 42, .07);
}


/* =========================
   CARD HEADER
========================= */

.card-header-custom {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 27px 32px;
  background: #fafbfd;
  border-bottom: 1px solid #eef2f7;
}

.header-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 21px;
}

.card-header-custom h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.card-header-custom p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 13px;
}


/* =========================
   FORM
========================= */

.profile-form {
  padding: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.form-group label span {
  color: #ef4444;
}

.form-group small {
  display: block;
  margin-top: 7px;
  color: #94a3b8;
  font-size: 12px;
}


/* =========================
   INPUTS
========================= */

.input-wrapper {
  position: relative;
}

.input-wrapper > i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 2;
}

.input-wrapper .form-control {
  min-height: 50px;
  padding-left: 45px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #334155;
  background: #fff;
  transition: .3s;
}

.input-wrapper .form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, .08);
}

.input-wrapper .form-control::placeholder {
  color: #b0bac8;
}


/* =========================
   TEXTAREA
========================= */

.textarea-wrapper > i {
  top: 23px;
  transform: none;
}

.textarea-wrapper textarea {
  resize: vertical;
  min-height: 110px;
}


/* =========================
   ALERTS
========================= */

.alert {
  border-radius: 12px;
  border: 0;
  font-size: 14px;
  margin-bottom: 25px;
}


/* =========================
   ACTIONS
========================= */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #eef2f7;
}

.cancel-btn,
.save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
  padding: 12px 20px;
  border-radius: 11px;
  font-weight: 700;
  text-decoration: none;
  transition: .3s;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.save-btn {
  border: 0;
  background: #2563eb;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, .2);
}

.save-btn:disabled {
  opacity: .7;
  cursor: not-allowed;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {

  .page-header {
    display: block;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .back-btn {
    margin-top: 20px;
  }

  .card-header-custom {
    padding: 22px;
  }

  .profile-form {
    padding: 22px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }

}

</style>