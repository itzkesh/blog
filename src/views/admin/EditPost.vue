<template>
  <div class="container py-5">

    <div class="col-lg-8 mx-auto">

      <div class="card shadow border-0">

        <div class="card-body">

          <h2>Edit Post</h2>

          <form>

            <input
              class="form-control mb-3"
              value="Getting Started with Vue"
            >

            <textarea
              rows="8"
              class="form-control mb-3"
            >
Existing post content...
            </textarea>

            <button class="btn btn-success">
              Update Post
            </button>

          </form>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts"></script>