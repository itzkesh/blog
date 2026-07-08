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

              <form>
                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
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
                    class="form-control form-control-lg"
                    placeholder="Enter your password"
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
                >
                  Login
                </button>

                <hr class="my-4">

                <!-- Register -->
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

<script setup lang="ts">
// Authentication logic will be added later.
</script>

<style scoped>
.login-page {
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