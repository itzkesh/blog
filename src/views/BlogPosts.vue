<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase.ts'

interface Post {
  id: number
  title: string
  author: string
  body: string
  created_at: string
}

const posts = ref<Post[]>([])
const loading = ref(false)
const error = ref('')

const getPosts = async () => {
  loading.value = true
  error.value = ''

  const { data, error: supabaseError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (supabaseError) {
    error.value = supabaseError.message
  } else {
    posts.value = data as Post[]
  }

  loading.value = false
}

onMounted(() => {
  getPosts()
})
</script>

<template>
  <div class="container my-5">
    <h1 class="fw-bold mb-4">Blog Posts</h1>

    <!-- Loading -->
    <div
      v-if="loading"
      class="d-flex justify-content-center my-5"
    >
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <!-- Empty State -->
    <div
      v-else-if="posts.length === 0"
      class="alert alert-info"
    >
      No posts available.
    </div>

    <!-- Posts -->
    <div
      v-else
      class="row g-4"
    >
      <div
        v-for="post in posts"
        :key="post.id"
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h4 class="card-title">
              {{ post.title }}
            </h4>

            <p class="text-muted mb-2">
              By <strong>{{ post.author }}</strong>
            </p>

            <p class="card-text flex-grow-1">
              {{ post.body }}
            </p>

            <small class="text-secondary mt-3">
              {{ new Date(post.created_at).toLocaleDateString() }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>