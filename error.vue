<!-- error.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <Card class="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent class="p-8 text-center">
          <!-- Error Icon -->
          <div class="relative mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldX class="h-10 w-10 text-white" />
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span class="text-lg">🚫</span>
            </div>
          </div>

          <!-- Error Message -->
          <h1 class="text-2xl font-bold text-gray-900 mb-3">
            {{ error?.statusCode === 403 ? 'Akses Ditolak' : 'Terjadi Kesalahan' }}
          </h1>

          <p class="text-gray-600 mb-6 leading-relaxed">
            {{ error?.statusMessage || 'Halaman yang Anda cari tidak dapat diakses.' }}
          </p>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <Button
                @click="goHome"
                class="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg"
            >
              <Home class="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>

            <Button
                @click="goBack"
                variant="outline"
                class="w-full border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              Kembali ke Halaman Sebelumnya
            </Button>
          </div>

          <!-- Additional Info for 403 -->
          <div v-if="error?.statusCode === 403" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-start gap-3">
              <Info class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div class="text-left">
                <h3 class="text-sm font-semibold text-blue-800 mb-1">Informasi</h3>
                <p class="text-xs text-blue-700 leading-relaxed">
                  Dashboard Festival Gunung Selamet hanya dapat diakses oleh Administrator.
                  Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator sistem.
                </p>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-xs text-gray-500 mb-2">Butuh bantuan?</p>
            <div class="flex justify-center gap-4">
              <a href="mailto:admin@festivalgunungselamet.com"
                 class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Mail class="h-3 w-3" />
                Email Support
              </a>
              <a href="tel:+628123456789"
                 class="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                <Phone class="h-3 w-3" />
                WhatsApp
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  Home,
  ShieldX,
  Info,
  Mail,
  Phone
} from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Get error from Nuxt
const error = useError()

// Set page title
useSeoMeta({
  title: error.value?.statusCode === 403 ? 'Akses Ditolak - Festival Gunung Selamet' : 'Error - Festival Gunung Selamet'
})

// Navigation functions
const goHome = () => {
  clearError({ redirect: '/' })
}

const goBack = () => {
  // Try to go back, fallback to home
  if (process.client && window.history.length > 1) {
    window.history.back()
  } else {
    clearError({ redirect: '/' })
  }
}

// Auto redirect after 10 seconds for 403 errors
if (error.value?.statusCode === 403) {
  setTimeout(() => {
    console.log('Auto redirecting to home after 403 error')
    goHome()
  }, 10000)
}
</script>