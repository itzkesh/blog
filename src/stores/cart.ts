import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface CartItem {
  id: number
  seller_id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {

  const items = ref<CartItem[]>([])

  const addToCart = (product: CartItem) => {

    const existing = items.value.find(item => item.id === product.id)

    if (existing) {
      existing.quantity++
      return
    }

    items.value.push({
      ...product,
      quantity: 1
    })

  }

  const removeFromCart = (id: number) => {
    items.value = items.value.filter(item => item.id !== id)
  }

  const increaseQty = (id: number) => {

    const item = items.value.find(item => item.id === id)

    if (item) {
      item.quantity++
    }

  }

  const decreaseQty = (id: number) => {

    const item = items.value.find(item => item.id === id)

    if (!item) return

    if (item.quantity > 1) {
      item.quantity--
    }

  }

  const clearCart = () => {
    items.value = []
  }

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  )

  return {
    items,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    totalItems,
    totalPrice
  }

})