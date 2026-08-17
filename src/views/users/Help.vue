<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

/* =========================
   TYPES
========================= */

interface ChatMessage {
  id: number
  sender: 'user' | 'bot'
  message: string
  time: string
}

/* =========================
   STATE
========================= */

const chatOpen = ref(false)
const message = ref('')
const typing = ref(false)

const messages = ref<ChatMessage[]>([])

/* =========================
   QUICK QUESTIONS
========================= */

const quickQuestions = [
  'How do I add a product?',
  'How do I edit my product?',
  'How do I edit my profile?',
  'How do I delete a product?',
  'How do I check my orders?',
  'How do I contact support?'
]

/* =========================
   INITIAL MESSAGE
========================= */

const welcomeMessage = () => {
  messages.value = [
    {
      id: Date.now(),
      sender: 'bot',
      message:
        "Hi 👋 I'm Mova Assistant. I'm here to help you with your marketplace account, products, orders and profile. What can I help you with?",
      time: getTime()
    }
  ]
}

/* =========================
   TIME
========================= */

const getTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/* =========================
   OPEN CHAT
========================= */

const openChat = () => {
  chatOpen.value = true

  if (messages.value.length === 0) {
    welcomeMessage()
  }
}

/* =========================
   CLOSE CHAT
========================= */

const closeChat = () => {
  chatOpen.value = false
}

/* =========================
   CLEAR CHAT
========================= */

const clearChat = () => {
  messages.value = []
  welcomeMessage()
}

/* =========================
   SCROLL CHAT
========================= */

const scrollChat = async () => {
  await nextTick()

  const container = document.querySelector('.chat-messages')

  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

/* =========================
   BOT RESPONSE
========================= */

const getBotResponse = (question: string): string => {
  const q = question.toLowerCase().trim()

  /* ADD PRODUCT */

  if (
    q.includes('add product') ||
    q.includes('upload product') ||
    q.includes('create product') ||
    q.includes('new product')
  ) {
    return `
      To add a product:

      1. Open your Seller Dashboard.
      2. Click "Add Product".
      3. Enter the product name.
      4. Select a category.
      5. Enter the price and available quantity.
      6. Upload a product image.
      7. Add a description.
      8. Click "Upload Product".

      Your product should then appear in your product list.
    `
  }

  /* EDIT PRODUCT */

  if (
    q.includes('edit product') ||
    q.includes('update product') ||
    q.includes('change product')
  ) {
    return `
      To edit a product:

      1. Go to "My Products".
      2. Find the product you want to change.
      3. Click the Edit button.
      4. Update the information you want.
      5. Click "Update Product".

      Your changes will be saved to your product.
    `
  }

  /* DELETE PRODUCT */

  if (
    q.includes('delete product') ||
    q.includes('remove product')
  ) {
    return `
      To delete a product:

      1. Go to "My Products".
      2. Find the product.
      3. Click "Delete".
      4. Confirm the deletion.

      ⚠️ Deleted products cannot normally be recovered, so make sure you have selected the correct product.
    `
  }

  /* PROFILE */

  if (
    q.includes('edit profile') ||
    q.includes('update profile') ||
    q.includes('change profile') ||
    q.includes('profile')
  ) {
    return `
      To edit your profile:

      1. Open your Profile page.
      2. Click "Edit Profile".
      3. Update your username, email, phone number or address.
      4. Click "Save Changes".

      After saving, you will be taken back to your Profile page.
    `
  }

  /* ORDERS */

  if (
    q.includes('order') ||
    q.includes('orders')
  ) {
    return `
      Your orders are managed through your seller account.

      Open your Seller Dashboard to check your order information and monitor your sales.

      If you believe an order is missing, please contact support.
    `
  }

  /* EARNINGS */

  if (
    q.includes('earning') ||
    q.includes('revenue') ||
    q.includes('money') ||
    q.includes('sales')
  ) {
    return `
      Your earnings are calculated from your completed sales.

      You can view your total earnings and order statistics from your Seller Dashboard.

      Make sure your products are properly listed and available for customers to purchase.
    `
  }

  /* STOCK */

  if (
    q.includes('stock') ||
    q.includes('quantity') ||
    q.includes('inventory')
  ) {
    return `
      You can manage your product stock from the Edit Product page.

      Open "My Products", select the product you want to update, change the quantity and click "Update Product".
    `
  }

  /* CART */

  if (
    q.includes('cart') ||
    q.includes('shopping cart')
  ) {
    return `
      To use the shopping cart:

      1. Find a product you want to purchase.
      2. Click "Add to Cart".
      3. Open the cart using the cart button.
      4. Review your products.
      5. Continue to checkout.

      You can change the quantity of products before checkout.
    `
  }

  /* CHECKOUT */

  if (
    q.includes('checkout') ||
    q.includes('buy') ||
    q.includes('purchase')
  ) {
    return `
      To complete a purchase:

      1. Add your desired products to your cart.
      2. Open your cart.
      3. Review your order.
      4. Continue to checkout.
      5. Enter the required information.
      6. Complete your order.

      Make sure your delivery information is correct before placing the order.
    `
  }

  /* ACCOUNT */

  if (
    q.includes('account') ||
    q.includes('login') ||
    q.includes('sign in')
  ) {
    return `
      If you are having trouble accessing your account, make sure you are using the correct email and password.

      If you forgot your password, use the "Forgot Password" option on the login page to reset it.
    `
  }

  /* CONTACT */

  if (
    q.includes('contact') ||
    q.includes('support') ||
    q.includes('help')
  ) {
    return `
      Need more help? You can contact marketplace support for assistance with your account, orders, products or payments.

      Please provide as much information as possible when contacting support so we can help you faster.
    `
  }

  /* GREETING */

  if (
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('good morning') ||
    q.includes('good afternoon') ||
    q.includes('good evening')
  ) {
    return `
      Hello 👋

      It's nice to have you here. I can help you with products, your profile, orders, checkout, your cart and other marketplace features.

      What would you like to know?
    `
  }

  /* THANK YOU */

  if (
    q.includes('thank') ||
    q.includes('thanks')
  ) {
    return `
      You're welcome! 😊

      I'm always here if you need help with the marketplace.
    `
  }

  /* DEFAULT */

  return `
    I'm not completely sure I understood that. 🤔

    I can help you with:

    • Adding products
    • Editing products
    • Deleting products
    • Editing your profile
    • Orders
    • Earnings
    • Stock management
    • Cart
    • Checkout
    • Account problems
    • Contacting support

    Try asking me one of those questions.
  `
}

/* =========================
   SEND MESSAGE
========================= */

const sendMessage = async (text?: string) => {
  const userMessage = (text || message.value).trim()

  if (!userMessage || typing.value) return

  /* Add user message */

  messages.value.push({
    id: Date.now(),
    sender: 'user',
    message: userMessage,
    time: getTime()
  })

  message.value = ''

  await scrollChat()

  /* Bot typing */

  typing.value = true

  await new Promise(resolve => {
    setTimeout(resolve, 900)
  })

  const response = getBotResponse(userMessage)

  messages.value.push({
    id: Date.now() + 1,
    sender: 'bot',
    message: response,
    time: getTime()
  })

  typing.value = false

  await scrollChat()
}

/* =========================
   ENTER KEY
========================= */

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

onMounted(() => {
  welcomeMessage()
})
</script>


<template>

  <div class="help-page">

    <!-- =========================
         HERO
    ========================== -->

    <section class="help-hero">

      <div class="hero-content">

        <span class="hero-badge">
          <i class="bi bi-life-preserver"></i>
          HELP CENTER
        </span>

        <h1>
          How can we
          <span>help you?</span>
        </h1>

        <p>
          Find answers, learn how the marketplace works,
          or chat with our Mova Assistant.
        </p>

        <div class="hero-search">

          <i class="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search for help..."
            @keyup.enter="sendMessage(($event.target as HTMLInputElement).value)"
          >

        </div>

      </div>

      <div class="hero-circle circle-one"></div>
      <div class="hero-circle circle-two"></div>

    </section>


    <!-- =========================
         QUICK HELP
    ========================== -->

    <section class="help-content">

      <div class="section-title">

        <span>
          GET STARTED
        </span>

        <h2>
          How can we help?
        </h2>

        <p>
          Choose a topic to quickly find what you need.
        </p>

      </div>


      <div class="row g-4">

        <!-- Products -->

        <div class="col-lg-4 col-md-6">

          <div class="help-card">

            <div class="help-icon products">
              <i class="bi bi-box-seam"></i>
            </div>

            <h4>
              Products
            </h4>

            <p>
              Learn how to add, edit, manage and delete your products.
            </p>

            <button
              @click="sendMessage('How do I add a product?')"
            >
              Learn More
              <i class="bi bi-arrow-right"></i>
            </button>

          </div>

        </div>


        <!-- Orders -->

        <div class="col-lg-4 col-md-6">

          <div class="help-card">

            <div class="help-icon orders">
              <i class="bi bi-bag-check"></i>
            </div>

            <h4>
              Orders
            </h4>

            <p>
              Learn how orders work and how to manage your sales.
            </p>

            <button
              @click="sendMessage('How do I check my orders?')"
            >
              Learn More
              <i class="bi bi-arrow-right"></i>
            </button>

          </div>

        </div>


        <!-- Account -->

        <div class="col-lg-4 col-md-6">

          <div class="help-card">

            <div class="help-icon account">
              <i class="bi bi-person"></i>
            </div>

            <h4>
              Account
            </h4>

            <p>
              Manage your profile, account information and settings.
            </p>

            <button
              @click="sendMessage('How do I edit my profile?')"
            >
              Learn More
              <i class="bi bi-arrow-right"></i>
            </button>

          </div>

        </div>


        <!-- Cart -->

        <div class="col-lg-4 col-md-6">

          <div class="help-card">

            <div class="help-icon cart">
              <i class="bi bi-cart3"></i>
            </div>

            <h4>
              Shopping Cart
            </h4>

            <p>
              Learn how to add products and manage your shopping cart.
            </p>

            <button
              @click="sendMessage('How does the cart work?')"
            >
              Learn More
              <i class="bi bi-arrow-right"></i>
            </button>

          </div>

        </div>


        <!-- Checkout -->

        <div class="col-lg-4 col-md-6">

          <div class="help-card">

            <div class="help-icon checkout">
              <i class="bi bi-credit-card"></i>
            </div>

            <h4>
              Checkout
            </h4>

            <p>
              Learn how to complete your purchase and place orders.
            </p>

            <button
              @click="sendMessage('How does checkout work?')"
            >
              Learn More
              <i class="bi bi-arrow-right"></i>
            </button>

          </div>

        </div>


        <!-- Support -->

        <div class="col-lg-4 col-md-6">

          <div class="help-card">

            <div class="help-icon support">
              <i class="bi bi-headset"></i>
            </div>

            <h4>
              Support
            </h4>

            <p>
              Can't find an answer? Contact our support team.
            </p>

            <button
              @click="sendMessage('How do I contact support?')"
            >
              Contact Support
              <i class="bi bi-arrow-right"></i>
            </button>

          </div>

        </div>

      </div>


      <!-- =========================
           FAQ
      ========================== -->

      <div class="faq-section">

        <div class="section-title">

          <span>
            FAQ
          </span>

          <h2>
            Frequently Asked Questions
          </h2>

        </div>


        <div class="accordion" id="faqAccordion">

          <div class="faq-item">

            <button
              class="faq-question collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#faq1"
            >
              How do I add a product?

              <i class="bi bi-chevron-down"></i>

            </button>

            <div
              id="faq1"
              class="collapse"
              data-bs-parent="#faqAccordion"
            >

              <div class="faq-answer">

                Go to your Seller Dashboard and click
                <strong>Add Product</strong>. Enter your product
                information, upload an image and click
                <strong>Upload Product</strong>.

              </div>

            </div>

          </div>


          <div class="faq-item">

            <button
              class="faq-question collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#faq2"
            >
              How do I edit my product?

              <i class="bi bi-chevron-down"></i>

            </button>

            <div
              id="faq2"
              class="collapse"
              data-bs-parent="#faqAccordion"
            >

              <div class="faq-answer">

                Open <strong>My Products</strong>, find the product
                you want to change and click the Edit button.

              </div>

            </div>

          </div>


          <div class="faq-item">

            <button
              class="faq-question collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#faq3"
            >
              How do I update my profile?

              <i class="bi bi-chevron-down"></i>

            </button>

            <div
              id="faq3"
              class="collapse"
              data-bs-parent="#faqAccordion"
            >

              <div class="faq-answer">

                Open your Profile page and click
                <strong>Edit Profile</strong>. Update your information
                and click <strong>Save Changes</strong>.

              </div>

            </div>

          </div>


          <div class="faq-item">

            <button
              class="faq-question collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#faq4"
            >
              How do I delete a product?

              <i class="bi bi-chevron-down"></i>

            </button>

            <div
              id="faq4"
              class="collapse"
              data-bs-parent="#faqAccordion"
            >

              <div class="faq-answer">

                Go to <strong>My Products</strong>, find the product
                and click <strong>Delete</strong>. You will be asked
                to confirm before the product is permanently removed.

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- =========================
         CHAT BUTTON
    ========================== -->

    <button
      v-if="!chatOpen"
      class="chat-launcher"
      @click="openChat"
      aria-label="Open Mova Assistant"
    >

      <span class="launcher-pulse"></span>

      <i class="bi bi-chat-dots-fill"></i>

      <span class="chat-label">
        Ask Mova
      </span>

    </button>


    <!-- =========================
         CHAT WINDOW
    ========================== -->

    <Transition name="chat">

      <div
        v-if="chatOpen"
        class="chat-window"
      >

        <!-- Header -->

        <div class="chat-header">

          <div class="bot-profile">

            <div class="bot-avatar">
              <i class="bi bi-robot"></i>

              <span></span>
            </div>

            <div>

              <strong>
                Mova Assistant
              </strong>

              <small>
                <span class="online-dot"></span>
                Online
              </small>

            </div>

          </div>


          <div class="chat-actions">

            <button
              title="Clear chat"
              @click="clearChat"
            >
              <i class="bi bi-trash3"></i>
            </button>

            <button
              title="Close"
              @click="closeChat"
            >
              <i class="bi bi-x-lg"></i>
            </button>

          </div>

        </div>


        <!-- Messages -->

        <div class="chat-messages">

          <div
            v-for="chat in messages"
            :key="chat.id"
            class="message-row"
            :class="chat.sender"
          >

            <div
              v-if="chat.sender === 'bot'"
              class="small-avatar"
            >
              <i class="bi bi-robot"></i>
            </div>

            <div>

              <div class="message-bubble">
                {{ chat.message }}
              </div>

              <small class="message-time">
                {{ chat.time }}
              </small>

            </div>

          </div>


          <!-- Typing -->

          <div
            v-if="typing"
            class="message-row bot"
          >

            <div class="small-avatar">
              <i class="bi bi-robot"></i>
            </div>

            <div class="typing-bubble">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        </div>


        <!-- Quick Questions -->

        <div
          v-if="messages.length <= 1 && !typing"
          class="quick-questions"
        >

          <span>
            Quick questions
          </span>

          <button
            v-for="question in quickQuestions"
            :key="question"
            @click="sendMessage(question)"
          >
            {{ question }}
          </button>

        </div>


        <!-- Input -->

        <div class="chat-input">

          <textarea
            v-model="message"
            rows="1"
            placeholder="Type your question..."
            @keydown="handleKeydown"
          ></textarea>

          <button
            :disabled="!message.trim() || typing"
            @click="sendMessage()"
          >
            <i class="bi bi-send-fill"></i>
          </button>

        </div>

        <div class="chat-footer">
          Mova Assistant • Marketplace Help
        </div>

      </div>

    </Transition>

  </div>

</template>


<style scoped>

/* =========================
   PAGE
========================= */

.help-page {
  min-height: 100vh;
  background: #f7f9fc;
}


/* =========================
   HERO
========================= */

.help-hero {
  position: relative;
  overflow: hidden;
  padding: 80px 20px 90px;
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5,
      #7c3aed
    );
  color: white;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 760px;
  margin: auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 50px;
  background: rgba(255,255,255,.14);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.hero-content h1 {
  font-size: 50px;
  font-weight: 900;
  margin-bottom: 15px;
}

.hero-content h1 span {
  color: #facc15;
}

.hero-content p {
  max-width: 600px;
  margin: auto auto 30px;
  color: rgba(255,255,255,.82);
  font-size: 17px;
}

.hero-search {
  max-width: 600px;
  margin: auto;
  position: relative;
}

.hero-search i {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.hero-search input {
  width: 100%;
  border: 0;
  outline: none;
  padding: 17px 20px 17px 52px;
  border-radius: 15px;
  font-size: 15px;
  box-shadow: 0 15px 35px rgba(0,0,0,.15);
}

.hero-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.07);
}

.circle-one {
  width: 350px;
  height: 350px;
  right: -150px;
  top: -150px;
}

.circle-two {
  width: 250px;
  height: 250px;
  left: -100px;
  bottom: -130px;
}


/* =========================
   CONTENT
========================= */

.help-content {
  max-width: 1150px;
  margin: auto;
  padding: 70px 20px;
}

.section-title {
  margin-bottom: 35px;
}

.section-title > span {
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.section-title h2 {
  margin: 6px 0;
  font-size: 28px;
  font-weight: 850;
  color: #0f172a;
}

.section-title p {
  margin: 0;
  color: #64748b;
}


/* =========================
   HELP CARDS
========================= */

.help-card {
  height: 100%;
  padding: 27px;
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(15,23,42,.05);
  transition: .3s;
}

.help-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(15,23,42,.1);
}

.help-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  font-size: 22px;
  margin-bottom: 20px;
}

.products {
  background: #dbeafe;
  color: #2563eb;
}

.orders {
  background: #dcfce7;
  color: #16a34a;
}

.account {
  background: #ede9fe;
  color: #7c3aed;
}

.cart {
  background: #fef3c7;
  color: #d97706;
}

.checkout {
  background: #cffafe;
  color: #0891b2;
}

.support {
  background: #fee2e2;
  color: #dc2626;
}

.help-card h4 {
  color: #0f172a;
  font-size: 18px;
  font-weight: 800;
}

.help-card p {
  color: #64748b;
  line-height: 1.7;
  min-height: 50px;
}

.help-card button {
  border: 0;
  background: transparent;
  color: #2563eb;
  padding: 0;
  font-weight: 700;
}

.help-card button i {
  margin-left: 5px;
  transition: .2s;
}

.help-card button:hover i {
  margin-left: 10px;
}


/* =========================
   FAQ
========================= */

.faq-section {
  margin-top: 80px;
}

.faq-item {
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  margin-bottom: 12px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  border: 0;
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-weight: 700;
  color: #1e293b;
}

.faq-question i {
  transition: .3s;
}

.faq-question:not(.collapsed) i {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 20px 20px;
  color: #64748b;
  line-height: 1.7;
}


/* =========================
   CHAT LAUNCHER
========================= */

.chat-launcher {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 999;
  border: 0;
  background: #2563eb;
  color: white;
  height: 58px;
  padding: 0 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  box-shadow: 0 12px 35px rgba(37,99,235,.35);
  transition: .3s;
}

.chat-launcher:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(37,99,235,.45);
}

.chat-launcher > i {
  font-size: 22px;
}

.launcher-pulse {
  width: 9px;
  height: 9px;
  background: #22c55e;
  border-radius: 50%;
  position: absolute;
  top: 9px;
  left: 16px;
  border: 2px solid #2563eb;
}


/* =========================
   CHAT WINDOW
========================= */

.chat-window {
  position: fixed;
  z-index: 1000;
  right: 28px;
  bottom: 28px;
  width: 390px;
  max-width: calc(100vw - 30px);
  height: 620px;
  max-height: calc(100vh - 45px);
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(15,23,42,.22);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}


/* =========================
   CHAT HEADER
========================= */

.chat-header {
  padding: 17px 18px;
  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot-profile {
  display: flex;
  align-items: center;
  gap: 11px;
}

.bot-avatar {
  width: 43px;
  height: 43px;
  border-radius: 13px;
  background: rgba(255,255,255,.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: relative;
}

.bot-avatar span {
  position: absolute;
  width: 9px;
  height: 9px;
  background: #22c55e;
  border-radius: 50%;
  right: -2px;
  bottom: -2px;
  border: 2px solid #2563eb;
}

.bot-profile strong {
  display: block;
  font-size: 14px;
}

.bot-profile small {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
  opacity: .85;
}

.online-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
}

.chat-actions {
  display: flex;
  gap: 5px;
}

.chat-actions button {
  width: 34px;
  height: 34px;
  border: 0;
  background: rgba(255,255,255,.1);
  color: white;
  border-radius: 9px;
  transition: .2s;
}

.chat-actions button:hover {
  background: rgba(255,255,255,.2);
}


/* =========================
   MESSAGES
========================= */

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8fafc;
}

.message-row {
  display: flex;
  margin-bottom: 16px;
  gap: 8px;
}

.message-row.user {
  justify-content: flex-end;
}

.small-avatar {
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.message-bubble {
  max-width: 280px;
  padding: 11px 14px;
  border-radius: 15px;
  white-space: pre-line;
  font-size: 13px;
  line-height: 1.6;
}

.message-row.bot .message-bubble {
  background: white;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-top-left-radius: 5px;
}

.message-row.user .message-bubble {
  background: #2563eb;
  color: white;
  border-top-right-radius: 5px;
}

.message-time {
  display: block;
  color: #94a3b8;
  font-size: 9px;
  margin-top: 4px;
}

.message-row.user .message-time {
  text-align: right;
}


/* =========================
   TYPING
========================= */

.typing-bubble {
  display: flex;
  gap: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 13px 15px;
  border-radius: 15px;
}

.typing-bubble span {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.2s infinite;
}

.typing-bubble span:nth-child(2) {
  animation-delay: .15s;
}

.typing-bubble span:nth-child(3) {
  animation-delay: .3s;
}

@keyframes typing {

  0%,
  60%,
  100% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-5px);
  }

}


/* =========================
   QUICK QUESTIONS
========================= */

.quick-questions {
  padding: 10px 15px;
  border-top: 1px solid #eef2f7;
  background: white;
}

.quick-questions > span {
  display: block;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 7px;
}

.quick-questions button {
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 50px;
  padding: 6px 10px;
  margin: 3px;
  font-size: 10px;
  font-weight: 600;
}


/* =========================
   CHAT INPUT
========================= */

.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px;
  background: white;
  border-top: 1px solid #eef2f7;
}

.chat-input textarea {
  flex: 1;
  resize: none;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  padding: 10px 12px;
  font-size: 13px;
  max-height: 90px;
}

.chat-input textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.07);
}

.chat-input button {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border: 0;
  border-radius: 11px;
  background: #2563eb;
  color: white;
}

.chat-input button:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.chat-footer {
  text-align: center;
  padding: 7px;
  background: white;
  color: #cbd5e1;
  font-size: 9px;
}


/* =========================
   TRANSITION
========================= */

.chat-enter-active,
.chat-leave-active {
  transition: .3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(.96);
}


/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {

  .hero-content h1 {
    font-size: 36px;
  }

  .help-hero {
    padding: 60px 20px 70px;
  }

  .help-content {
    padding: 50px 15px;
  }

  .chat-window {
    right: 10px;
    bottom: 10px;
    width: calc(100vw - 20px);
    height: calc(100vh - 30px);
    max-height: none;
    border-radius: 18px;
  }

  .chat-launcher {
    right: 18px;
    bottom: 18px;
  }

  .chat-label {
    display: none;
  }

  .chat-launcher {
    width: 58px;
    padding: 0;
    justify-content: center;
  }

  .launcher-pulse {
    left: 14px;
  }

}
</style>