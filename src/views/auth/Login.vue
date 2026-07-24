
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  const { error: authError } =
    await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

  loading.value = false

  if (authError) {
    error.value = authError.message
    return
  }

  router.push('/auth/dashboard')
}
</script>
<template>
  <div class="login-page d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">

          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">

              <div class="text-center mb-4">
                <h2 class="fw-bold">Welcome Back 👋</h2>
                <p class="text-muted">
                  Sign in to continue to your account.
                </p>
              </div>

              <form @submit.prevent="login">

                <!-- Error -->
                <div
                  v-if="error"
                  class="alert alert-danger"
                >
                  {{ error }}
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    v-model="email"
                    type="email"
                    class="form-control form-control-lg"
                    placeholder="Enter your email"
                    required
                  >
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    v-model="password"
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Enter your password"
                    required
                  >
                </div>

                <!-- Remember + Forgot -->
                <div
                  class="d-flex justify-content-between align-items-center mb-4"
                >
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="remember"
                    >
                    <label
                      class="form-check-label"
                      for="remember"
                    >
                      Remember me
                    </label>
                  </div>

                  <RouterLink
                    to="/forgot-password"
                    class="text-decoration-none"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

                <!-- Login Button -->
                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>

                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>

                <hr class="my-4">

                <p class="text-center mb-0">
                  Don't have an account?

                  <RouterLink
                    to="/register"
                    class="fw-semibold text-decoration-none"
                  >
                    Create One
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
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #eef4ff);
}

.card {
  transition: .3s;
}

.card:hover {
  transform: translateY(-5px);
}

.form-control {
  border-radius: 12px;
  padding: .9rem 1rem;
}

.form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.btn {
  border-radius: 12px;
  padding: .9rem;
  font-weight: 600;
}
</style>