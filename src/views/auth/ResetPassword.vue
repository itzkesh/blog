<template>
  <div class="reset-page d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">

          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">

              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold">Reset Your Password 🔑</h2>
                <p class="text-muted">
                  Create a new password to secure your account.
                </p>
              </div>

              <form>

                <!-- New Password -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Enter your new password"
                  >
                </div>

                <!-- Confirm Password -->
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Confirm your new password"
                  >
                </div>

                <!-- Reset Button -->
                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100"
                >
                  Reset Password
                </button>

                <hr class="my-4">

                <!-- Back to Login -->
                <p class="text-center mb-0">
                  Back to
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
// Reset password logic will be added here later.
</script>

<style scoped>
.reset-page {
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