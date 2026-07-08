<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

interface Post {
  id: number
  title: string
  author: string
  body: string
  created_at: string
}

const posts = ref<Post[]>([])
const loading = ref(false)
const search = ref('')

const fetchPosts = async () => {
  loading.value = true

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error.message)
  } else {
    posts.value = data || []
  }

  loading.value = false
}

const deletePost = async (id: number) => {

  if (!confirm('Delete this post?')) return

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  fetchPosts()
}

const filteredPosts = computed(() => {

  return posts.value.filter(post =>
    post.title.toLowerCase().includes(search.value.toLowerCase())
  )

})

const formatDate = (date: string) => {

  return new Date(date).toLocaleDateString()

}

onMounted(() => {

  fetchPosts()

})
</script>

<template>
  <div class="container-fluid py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">

      <div>
        <h2 class="fw-bold mb-1">All Posts</h2>
        <p class="text-muted">
          Manage your blog posts
        </p>
      </div>

      <RouterLink
        to="/admin/posts/new"
        class="btn btn-primary"
      >
        <i class="bi bi-plus-circle me-2"></i>
        New Post
      </RouterLink>

    </div>

    <!-- Search -->
    <div class="card border-0 shadow-sm mb-4">

      <div class="card-body">

        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search posts..."
        >

      </div>

    </div>

    <!-- Posts Table -->
    <div class="card border-0 shadow-sm">

      <div class="table-responsive">

        <table class="table table-hover align-middle mb-0">

          <thead class="table-light">

            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th width="180">Actions</th>
            </tr>

          </thead>

          <tbody>

            <tr v-if="loading">
              <td colspan="5" class="text-center py-5">
                Loading posts...
              </td>
            </tr>

            <tr
              v-for="(post, index) in filteredPosts"
              :key="post.id"
            >

              <td>{{ index + 1 }}</td>

              <td>
                <strong>{{ post.title }}</strong>
              </td>

              <td>{{ post.author }}</td>

              <td>
                {{ formatDate(post.created_at) }}
              </td>

              <td>

                <RouterLink
                  :to="`post/:id/edit`"
                  class="btn btn-sm btn-primary me-2"
                >
                  Edit
                </RouterLink>

                <button
                  class="btn btn-sm btn-danger"
                  @click="deletePost(post.id)"
                >
                  Delete
                </button>

              </td>

            </tr>

            <tr
              v-if="!loading && filteredPosts.length === 0"
            >
              <td colspan="5" class="text-center py-5">
                No posts found.
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>
</template>


<style scoped>
.card{
    border-radius:18px;
}

.table th{
    font-weight:600;
}

.table td{
    vertical-align:middle;
}

.form-control{
    border-radius:10px;
}

.btn{
    border-radius:10px;
}
</style>