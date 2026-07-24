<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

interface SellerProfile {
  id: string
  username: string
  email: string
  phone_number: string | null
  address: string | null
}

const profile = ref<SellerProfile | null>(null)
const loading = ref(true)

const getProfile = async () => {
  loading.value = true

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    loading.value = false
    return
  }

  const { data, error } = await supabase
    .from('seller_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error(error.message)
  } else {
    profile.value = data
  }

  loading.value = false
}

onMounted(getProfile)
</script>

<template>
  <div class="container py-5">

    <div
      v-if="loading"
      class="text-center py-5"
    >
      <div class="spinner-border text-primary"></div>
    </div>

    <div
      v-else-if="profile"
      class="row justify-content-center"
    >
      <div class="col-lg-6">

        <div class="card shadow border-0 rounded-4">

          <div class="card-body text-center p-5">

            <img
              :src="`https://ui-avatars.com/api/?name=${profile.username}&background=0d6efd&color=fff&size=150`"
              class="rounded-circle mb-3"
              width="130"
            >

            <h3>{{ profile.username }}</h3>

            <p class="text-muted">
              Marketplace Seller
            </p>

            <hr>

            <div class="text-start">

              <h6>Email</h6>
              <p class="text-muted">
                {{ profile.email }}
              </p>

              <h6>Phone Number</h6>
              <p class="text-muted">
                {{ profile.phone_number || 'Not provided' }}
              </p>

              <h6>Address</h6>
              <p class="text-muted">
                {{ profile.address || 'Not provided' }}
              </p>

            </div>

            <RouterLink
              to="/profile/edit"
              class="btn btn-primary w-100 mt-3"
            >
              Edit Profile
            </RouterLink>

          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.card{
    border-radius:20px;
}

img{
    border:4px solid #0d6efd;
}

h6{
    font-weight:600;
}
</style>