<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const router = useRouter()

const username = ref('')
const email = ref('')
const phoneNumber = ref('')
const address = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const signUp = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: username.value
        }
      }
    })

    if (error) throw error

    // If user was created successfully
    if (data.user) {
      const { error: profileError } = await supabase
        .from('seller_profiles')
        .insert({
          id: data.user.id,
          username: username.value,
          email: email.value,
          phone_number: phoneNumber.value,
          address: address.value
        })

      if (profileError) throw profileError
    }

    if (data.session) {
      router.push('/auth/dashboard')
    } else {
      successMessage.value =
        'Registration successful! Please verify your email before logging in.'
    }

  } catch (err: any) {
    console.error(err)
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">

          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">

              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold">Create an Account 🚀</h2>
                <p class="text-muted">
                  Join us and start sharing your stories.
                </p>
              </div>

              <form @submit.prevent="signUp">

                <!-- Username -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    v-model="username"
                    class="form-control form-control-lg"
                    placeholder="Enter your full name"
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Phone Number
                  </label>

                  <input
                    v-model="phoneNumber"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Enter phone number"
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Address
                  </label>

                   <input
                    v-model="address"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Enter address"
                  >
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    v-model="email"
                    class="form-control form-control-lg"
                    placeholder="Enter your email"
                  >
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    v-model="password"
                    class="form-control form-control-lg"
                    placeholder="Create a password"
                  >
                </div>

                <div
                  v-if="errorMessage"
                  class="alert alert-danger"
                >
                   {{ errorMessage }}
                 </div>

                   <div
                     v-if="successMessage"
                     class="alert alert-success"
                   >
                     {{ successMessage }}
                   </div>


                <!-- Register Button -->
                <button
                 type="submit"
                  class="btn btn-primary btn-lg w-100"
                  :disabled="loading"
                >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>

                {{ loading ? 'Creating Account...' : 'Create Account' }}
              </button>

                <hr class="my-4">

                <!-- Login Link -->
                <p class="text-center mb-0">
                  Already have an account?
                  <RouterLink
                    to="/login"
                    class="fw-semibold text-decoration-none"
                  >
                    Login
                  </RouterLink>
                </p>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #eef4ff);
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.form-control {
  border-radius: 12px;
  padding: 0.8rem 1rem;
}

.form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.btn {
  border-radius: 12px;
  padding: 0.8rem;
  font-weight: 600;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>