<script setup lang="ts">
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

// const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const signUp = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value
      }
    }
  })

  loading.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  successMessage.value =
    'Account created successfully! Please check your email to verify your account.'

  console.log(data)

  // setTimeout(() => {
  //   router.push('/login')
  // }, 3000)
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

                <!-- Full Name -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    v-model="fullName"
                    class="form-control form-control-lg"
                    placeholder="Enter your full name"
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