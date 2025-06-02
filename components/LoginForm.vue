<script setup lang="ts">
import type {HTMLAttributes} from 'vue'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

// Form state
const email = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)
const errorMessage = ref<string>('')
const errors = reactive<{
  email?: string
  password?: string
}>({})

// Auth composable
const {login} = useAuth()

// Validation
const validateForm = (): boolean => {
  const newErrors: { email?: string; password?: string } = {}

  // Email validation
  if (!email.value.trim()) {
    newErrors.email = 'Email wajib diisi'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    newErrors.email = 'Format email tidak valid'
  }

  // Password validation
  if (!password.value.trim()) {
    newErrors.password = 'Password wajib diisi'
  } else if (password.value.length < 6) {
    newErrors.password = 'Password minimal 6 karakter'
  }

  // Update errors
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}

// Submit handler
const handleSubmit = async (event: Event) => {
  event.preventDefault()

  // Clear previous errors
  errorMessage.value = ''
  Object.keys(errors).forEach(key => delete errors[key as keyof typeof errors])

  // Validate form
  if (!validateForm()) {
    errorMessage.value = 'Mohon periksa kembali form yang telah diisi'
    return
  }

  loading.value = true

  const response = await login({
    email: email.value.trim(),
    password: password.value
  })

  console.log(response)

  if(response.statusCode === 200) {
    loading.value = false
    return await navigateTo('/dashboard')
  }
  // Handle different error types
  if (response.statusCode === 401) {
    errorMessage.value = 'Email atau password salah'
  } else {
    errorMessage.value = 'Terjadi kesalahan saat login'
  }

  loading.value = false

}

// Clear error when user starts typing
watch([email, password], () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
  // Clear field-specific errors
  if (errors.email && email.value) {
    delete errors.email
  }
  if (errors.password && password.value) {
    delete errors.password
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleSubmit">
          <div class="flex flex-col gap-6">
            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Email Field -->
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  v-model="email"
                  required
                  :class="{ 'border-red-500': errors.email }"
                  :disabled="loading"
              />
              <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Password Field -->
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <NuxtLink
                    to="/forgot-password"
                    class="hidden ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </NuxtLink>
              </div>
              <Input
                  id="password"
                  type="password"
                  v-model="password"
                  required
                  :class="{ 'border-red-500': errors.password }"
                  :disabled="loading"
                  placeholder="Enter your password"
              />
              <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <!-- Submit Button -->
            <div class="flex flex-col gap-3">
              <Button
                  type="submit"
                  class="w-full"
                  :disabled="loading"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
                <span v-else>Login</span>
              </Button>
            </div>
          </div>
          <div class="mt-4 text-center text-sm hidden">
            Don't have an account?
            <NuxtLink to="/register" class="underline underline-offset-4">
              Sign up
            </NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>