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

  try {
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
      return
    }

    profile.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(getProfile)
</script>

<template>

  <div class="profile-page">

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="spinner-border text-primary"></div>
      <p>Loading profile...</p>
    </div>


    <!-- Profile -->
    <div
      v-else-if="profile"
      class="container py-5"
    >

      <!-- Page Header -->
      <div class="page-header">

        <div>
          <span class="page-label">
            <i class="bi bi-person-badge"></i>
            SELLER ACCOUNT
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your seller information and account details.
          </p>
        </div>

        <RouterLink
          to="edit-profile/:id"
          class="edit-profile-btn"
        >
          <i class="bi bi-pencil"></i>
          Edit Profile
        </RouterLink>

      </div>


      <!-- Profile Card -->
      <div class="profile-card">

        <!-- Cover -->
        <div class="profile-cover">

          <div class="cover-circle circle-one"></div>
          <div class="cover-circle circle-two"></div>

        </div>


        <!-- Profile Header -->
        <div class="profile-header">

          <div class="avatar-wrapper">

            <img
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=2563eb&color=fff&size=200&bold=true`"
              :alt="profile.username"
              class="profile-avatar"
            >

            <span class="verified-badge">
              <i class="bi bi-check-lg"></i>
            </span>

          </div>


          <div class="profile-name">

            <h2>
              {{ profile.username }}
            </h2>

            <p>
              <i class="bi bi-shop"></i>
              Marketplace Seller
            </p>

          </div>

        </div>


        <!-- Information -->
        <div class="profile-content">

          <div class="section-title">

            <div class="section-icon">
              <i class="bi bi-person"></i>
            </div>

            <div>
              <h4>
                Personal Information
              </h4>

              <p>
                Your account information
              </p>
            </div>

          </div>


          <div class="info-grid">

            <!-- Email -->
            <div class="info-item">

              <div class="info-icon email">
                <i class="bi bi-envelope"></i>
              </div>

              <div>
                <span>
                  Email Address
                </span>

                <strong>
                  {{ profile.email }}
                </strong>
              </div>

            </div>


            <!-- Phone -->
            <div class="info-item">

              <div class="info-icon phone">
                <i class="bi bi-telephone"></i>
              </div>

              <div>
                <span>
                  Phone Number
                </span>

                <strong>
                  {{ profile.phone_number || 'Not provided' }}
                </strong>
              </div>

            </div>


            <!-- Address -->
            <div class="info-item address-item">

              <div class="info-icon address">
                <i class="bi bi-geo-alt"></i>
              </div>

              <div>
                <span>
                  Address
                </span>

                <strong>
                  {{ profile.address || 'Not provided' }}
                </strong>
              </div>

            </div>


            <!-- Username -->
            <div class="info-item">

              <div class="info-icon username">
                <i class="bi bi-at"></i>
              </div>

              <div>
                <span>
                  Username
                </span>

                <strong>
                  {{ profile.username }}
                </strong>
              </div>

            </div>

          </div>


          <!-- Account Status -->
          <div class="account-status">

            <div class="status-icon">
              <i class="bi bi-shield-check"></i>
            </div>

            <div>

              <strong>
                Seller Account Active
              </strong>

              <p>
                Your seller account is active and ready to receive orders.
              </p>

            </div>

            <span class="active-badge">
              Active
            </span>

          </div>


          <!-- Bottom Actions -->
          <div class="profile-actions">

            <RouterLink
              to="edit-profile/:id"
              class="primary-action"
            >
              <i class="bi bi-pencil-square"></i>
              Edit Profile
            </RouterLink>

            <RouterLink
              to="/auth/my-products"
              class="secondary-action"
            >
              <i class="bi bi-box-seam"></i>
              My Products
            </RouterLink>

          </div>

        </div>

      </div>

    </div>


    <!-- No Profile -->
    <div
      v-else
      class="empty-profile"
    >

      <div class="empty-icon">
        <i class="bi bi-person-x"></i>
      </div>

      <h3>
        Profile Not Found
      </h3>

      <p>
        We couldn't find your seller profile.
      </p>

    </div>

  </div>

</template>


<style scoped>

/* =========================
   PAGE
========================= */

.profile-page {
  min-height: 100vh;
  background: #f7f9fc;
}


/* =========================
   LOADING
========================= */

.loading-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.loading-container p {
  margin-top: 15px;
}


/* =========================
   PAGE HEADER
========================= */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30px;
}

.page-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.page-header p {
  color: #64748b;
  margin: 7px 0 0;
}

.edit-profile-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 19px;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  font-weight: 700;
  transition: .3s;
}

.edit-profile-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37,99,235,.2);
}


/* =========================
   PROFILE CARD
========================= */

.profile-card {
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(15,23,42,.07);
  border: 1px solid #eef2f7;
}


/* =========================
   COVER
========================= */

.profile-cover {
  height: 190px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5,
    #7c3aed
  );
}

.cover-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
}

.circle-one {
  width: 350px;
  height: 350px;
  right: -100px;
  top: -220px;
}

.circle-two {
  width: 220px;
  height: 220px;
  left: 35%;
  bottom: -170px;
}


/* =========================
   PROFILE HEADER
========================= */

.profile-header {
  display: flex;
  align-items: flex-end;
  gap: 25px;
  padding: 0 40px;
  margin-top: -70px;
  position: relative;
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  border: 7px solid white;
  box-shadow: 0 10px 30px rgba(15,23,42,.15);
}

.verified-badge {
  position: absolute;
  right: 7px;
  bottom: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2563eb;
  color: white;
  border: 3px solid white;
  font-size: 12px;
}

.profile-name {
  padding-bottom: 14px;
}

.profile-name h2 {
  font-size: 27px;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
}

.profile-name p {
  margin: 6px 0 0;
  color: #64748b;
}

.profile-name p i {
  color: #2563eb;
  margin-right: 5px;
}


/* =========================
   CONTENT
========================= */

.profile-content {
  padding: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 25px;
}

.section-icon {
  width: 45px;
  height: 45px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #2563eb;
  font-size: 19px;
}

.section-title h4 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
}

.section-title p {
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 13px;
}


/* =========================
   INFORMATION GRID
========================= */

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  background: #fafbfd;
  transition: .3s;
}

.info-item:hover {
  border-color: #dbeafe;
  background: #f8fbff;
  transform: translateY(-2px);
}

.info-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon.email {
  background: #eff6ff;
  color: #2563eb;
}

.info-icon.phone {
  background: #ecfdf5;
  color: #059669;
}

.info-icon.address {
  background: #fff7ed;
  color: #ea580c;
}

.info-icon.username {
  background: #f5f3ff;
  color: #7c3aed;
}

.info-item span {
  display: block;
  color: #94a3b8;
  font-size: 12px;
  margin-bottom: 4px;
}

.info-item strong {
  display: block;
  color: #334155;
  font-size: 14px;
  word-break: break-word;
}


/* =========================
   ACCOUNT STATUS
========================= */

.account-status {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  padding: 18px 20px;
  border-radius: 16px;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
}

.status-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  color: #16a34a;
  font-size: 19px;
}

.account-status strong {
  color: #166534;
  font-size: 14px;
}

.account-status p {
  margin: 3px 0 0;
  color: #4d7c5a;
  font-size: 12px;
}

.active-badge {
  margin-left: auto;
  background: #16a34a;
  color: white;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 700;
}


/* =========================
   ACTIONS
========================= */

.profile-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: .3s;
}

.primary-action {
  background: #2563eb;
  color: white;
}

.primary-action:hover {
  background: #1d4ed8;
  color: white;
  transform: translateY(-2px);
}

.secondary-action {
  background: #eff6ff;
  color: #2563eb;
}

.secondary-action:hover {
  background: #dbeafe;
  color: #1d4ed8;
}


/* =========================
   EMPTY PROFILE
========================= */

.empty-profile {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  font-size: 30px;
  margin-bottom: 20px;
}

.empty-profile h3 {
  font-weight: 800;
}

.empty-profile p {
  color: #64748b;
}


/* =========================
   MOBILE
========================= */

@media(max-width: 768px) {

  .page-header {
    display: block;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .edit-profile-btn {
    margin-top: 20px;
  }

  .profile-cover {
    height: 150px;
  }

  .profile-header {
    display: block;
    padding: 0 22px;
    margin-top: -65px;
  }

  .profile-avatar {
    width: 125px;
    height: 125px;
  }

  .profile-name {
    padding-top: 15px;
  }

  .profile-name h2 {
    font-size: 24px;
  }

  .profile-content {
    padding: 25px 22px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .account-status {
    align-items: flex-start;
  }

  .active-badge {
    display: none;
  }

  .profile-actions {
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }

}

</style>