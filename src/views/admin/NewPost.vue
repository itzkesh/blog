<template>
  <div class="container py-5">

    <div class="col-lg-8 mx-auto">

      <div class="card shadow border-0 rounded-4">

        <div class="card-body p-5">

          <h2 class="fw-bold mb-4">
            Create New Post
          </h2>

          <form>

            <div class="mb-3">
              <label class="form-label">
                Title
              </label>

              <input
                type="text"
                class="form-control"
                placeholder="Enter title"
              >
            </div>

            <div class="mb-3">
              <label class="form-label">
                Author
              </label>

              <input
                type="text"
                class="form-control"
                placeholder="Author"
              >
            </div>

            <div class="mb-3">
              <label class="form-label">
                Body
              </label>

              <textarea
                rows="8"
                class="form-control"
                placeholder="Write your article..."
              ></textarea>
            </div>

            <button class="btn btn-primary">
              Publish Post
            </button>

          </form>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts"></script>