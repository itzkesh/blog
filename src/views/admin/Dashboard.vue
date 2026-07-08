<script setup lang="ts">
// Dashboard logic will be added later
</script>

<template>
  <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-5">

            <div>
              <h2 class="fw-bold">
                Dashboard 👋
              </h2>

              <p class="text-muted">
                Welcome back, Kay
              </p>
            </div>

            <div class="d-flex gap-3">

              <input
                type="search"
                class="form-control"
                placeholder="Search posts..."
                style="width:250px"
              >

              <RouterLink
                to="/posts/new"
                class="btn btn-primary"
              >
                <i class="bi bi-plus-lg me-2"></i>
                New Post
              </RouterLink>

            </div>

          </div>

          <!-- Stats -->
          <div class="row g-4 mb-5">

            <div class="col-lg-3 col-md-6">
              <div class="card stats-card shadow-sm">
                <div class="card-body">

                  <div class="icon bg-primary">
                    <i class="bi bi-journal-text"></i>
                  </div>

                  <h2>18</h2>

                  <p>Total Posts</p>

                </div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="card stats-card shadow-sm">
                <div class="card-body">

                  <div class="icon bg-success">
                    <i class="bi bi-eye"></i>
                  </div>

                  <h2>12.5K</h2>

                  <p>Views</p>

                </div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="card stats-card shadow-sm">
                <div class="card-body">

                  <div class="icon bg-warning">
                    <i class="bi bi-heart"></i>
                  </div>

                  <h2>580</h2>

                  <p>Likes</p>

                </div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="card stats-card shadow-sm">
                <div class="card-body">

                  <div class="icon bg-danger">
                    <i class="bi bi-people"></i>
                  </div>

                  <h2>84</h2>

                  <p>Subscribers</p>

                </div>
              </div>
            </div>

          </div>

          <!-- Recent Posts -->
          <div class="card shadow-sm border-0">

            <div class="card-header bg-white d-flex justify-content-between align-items-center">

              <h5 class="mb-0">
                Recent Posts
              </h5>

              <RouterLink
                to="/admin/posts"
                class="btn btn-sm btn-outline-primary"
              >
                View All
              </RouterLink>

            </div>

            <div class="table-responsive">

              <table class="table table-hover mb-0">

                <thead>

                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th width="180">Actions</th>
                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td>Getting Started with Vue 3</td>

                    <td>Kay</td>

                    <td>06 Jul 2026</td>

                    <td>

                      <RouterLink
                        to="post/:id/edit"
                        class="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </RouterLink>

                      <button class="btn btn-sm btn-danger">
                        Delete
                      </button>

                    </td>

                  </tr>

                  <tr>

                    <td>Using Supabase</td>

                    <td>Kay</td>

                    <td>05 Jul 2026</td>

                    <td>

                      <RouterLink
                        to="post/:id/edit"
                        class="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </RouterLink>

                      <button class="btn btn-sm btn-danger">
                        Delete
                      </button>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>
</template>



