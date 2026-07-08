<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <!-- Logo -->
      <RouterLink class="navbar-brand fw-bold" to="/">
        The Blog
      </RouterLink>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar -->
      <div class="collapse navbar-collapse" id="navbar">
        <!-- Left Links -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- <li class="nav-item">
            <RouterLink class="nav-link" to="/">
              Home
            </RouterLink>
          </li> -->

        </ul>

        <!-- Right Links -->
        <div class="d-flex gap-2">
          <RouterLink
            to="/login"
            class="btn btn-outline-light"
          >
            Login
          </RouterLink>

          <RouterLink
            to="/register"
            class="btn btn-primary"
          >
            Register
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// No script needed
</script>

<style scoped>
.navbar-brand {
  letter-spacing: 1px;
}

.nav-link {
  transition: 0.3s;
}

.nav-link:hover {
  color: #0d6efd !important;
}

.router-link-active {
  color: #0d6efd !important;
  font-weight: 600;
}
</style>