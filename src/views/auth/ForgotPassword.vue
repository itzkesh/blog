<template>
  <div class="forgot-page d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">

          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">

              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold">Forgot Password? 🔐</h2>
                <p class="text-muted">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form>

                <!-- Email -->
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    class="form-control form-control-lg"
                    placeholder="Enter your email"
                  >
                </div>

                <!-- Reset Button -->
                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100"
                >
                  Send Reset Link
                </button>

                <hr class="my-4">

                <!-- Back to Login -->
                <p class="text-center mb-0">
                  Remember your password?
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

<script setup lang="ts">
// Forgot password logic will be added later.
</script>

<style scoped>
.forgot-page {
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
</style>