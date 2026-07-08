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

              <form>

                <!-- Full Name -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
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
                    placeholder="Create a password"
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
                    placeholder="Confirm your password"
                  >
                </div>

                <!-- Terms -->
                <div class="form-check mb-4">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="terms"
                  >
                  <label
                    class="form-check-label"
                    for="terms"
                  >
                    I agree to the
                    <a href="#" class="text-decoration-none">
                      Terms & Conditions
                    </a>
                  </label>
                </div>

                <!-- Register Button -->
                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100"
                >
                  Create Account
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

<script setup lang="ts">
// Registration logic will be added later.
</script>

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