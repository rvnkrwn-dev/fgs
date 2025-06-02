<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-900">Buat Event Baru</h2>
        <p class="text-sm text-gray-600 mt-1">Isi informasi lengkap untuk membuat event</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Title -->
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium text-gray-700">
            Judul Event <span class="text-red-500">*</span>
          </label>
          <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500': errors.title }"
              placeholder="Masukkan judul event"
              :disabled="loading"
          />
          <p v-if="errors.title" class="text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label for="description" class="block text-sm font-medium text-gray-700">
            Deskripsi <span class="text-red-500">*</span>
          </label>
          <textarea
              id="description"
              v-model="form.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              :class="{ 'border-red-500': errors.description }"
              placeholder="Deskripsikan event Anda..."
              :disabled="loading"
          ></textarea>
          <p v-if="errors.description" class="text-sm text-red-600">{{ errors.description }}</p>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="start_date" class="block text-sm font-medium text-gray-700">
              Tanggal Mulai <span class="text-red-500">*</span>
            </label>
            <input
                id="start_date"
                v-model="form.start_date"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="{ 'border-red-500': errors.start_date }"
                :disabled="loading"
            />
            <p v-if="errors.start_date" class="text-sm text-red-600">{{ errors.start_date }}</p>
          </div>

          <div class="space-y-2">
            <label for="end_date" class="block text-sm font-medium text-gray-700">
              Tanggal Selesai <span class="text-red-500">*</span>
            </label>
            <input
                id="end_date"
                v-model="form.end_date"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="{ 'border-red-500': errors.end_date }"
                :disabled="loading"
            />
            <p v-if="errors.end_date" class="text-sm text-red-600">{{ errors.end_date }}</p>
          </div>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label for="location" class="block text-sm font-medium text-gray-700">
            Lokasi <span class="text-red-500">*</span>
          </label>
          <input
              id="location"
              v-model="form.location"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500': errors.location }"
              placeholder="Alamat atau lokasi event"
              :disabled="loading"
          />
          <p v-if="errors.location" class="text-sm text-red-600">{{ errors.location }}</p>
        </div>

        <!-- Status -->
        <div class="space-y-2">
          <label for="status" class="block text-sm font-medium text-gray-700">Status Event</label>
          <select
              id="status"
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :disabled="loading"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <!-- File Uploads -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Banner Upload -->
          <div class="space-y-2">
            <label for="banner" class="block text-sm font-medium text-gray-700">Banner Event</label>
            <div class="relative">
              <input
                  id="banner"
                  ref="bannerInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange('banner', $event)"
                  class="hidden"
                  :disabled="loading"
              />
              <button
                  type="button"
                  @click="($refs.bannerInput as HTMLInputElement)?.click()"
                  :disabled="loading"
                  class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span class="text-sm text-gray-600">
                    {{ form.banner ? form.banner.name : 'Upload Banner' }}
                  </span>
                </div>
              </button>
            </div>
            <p class="text-xs text-gray-500">Format: JPG, PNG, WebP (Max: 5MB)</p>
          </div>

          <!-- Cover Upload -->
          <div class="space-y-2">
            <label for="cover" class="block text-sm font-medium text-gray-700">Cover Event</label>
            <div class="relative">
              <input
                  id="cover"
                  ref="coverInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange('cover', $event)"
                  class="hidden"
                  :disabled="loading"
              />
              <button
                  type="button"
                  @click="($refs.coverInput as HTMLInputElement)?.click()"
                  :disabled="loading"
                  class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span class="text-sm text-gray-600">
                    {{ form.cover ? form.cover.name : 'Upload Cover' }}
                  </span>
                </div>
              </button>
            </div>
            <p class="text-xs text-gray-500">Format: JPG, PNG, WebP (Max: 5MB)</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
              type="button"
              @click="resetForm"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Form
          </button>
          <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Membuat Event...
            </span>
            <span v-else>Buat Event</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Types
interface FormData {
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
  banner: File | null
  cover: File | null
}

interface FormErrors {
  title?: string
  description?: string
  start_date?: string
  end_date?: string
  location?: string
  [key: string]: string | undefined
}

// Form state
const form = reactive<FormData>({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  status: 'DRAFT',
  banner: null,
  cover: null,
})

// UI state
const loading = ref<boolean>(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const errors = reactive<FormErrors>({})

// Refs for file inputs
const bannerInput: Ref<HTMLInputElement | null> = ref(null)
const coverInput: Ref<HTMLInputElement | null> = ref(null)

// File handling
const handleFileChange = (type: 'banner' | 'cover', event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = `File ${type} terlalu besar. Maksimal 5MB.`
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      errorMessage.value = `File ${type} harus berupa gambar.`
      return
    }

    form[type] = file
    errorMessage.value = ''
  }
}

// Form validation
const validateForm = (): boolean => {
  const newErrors: FormErrors = {}

  // Required fields validation
  const requiredFields: (keyof FormData)[] = ['title', 'description', 'start_date', 'end_date', 'location']

  requiredFields.forEach(field => {
    const value = form[field]
    if (typeof value === 'string' && !value.trim()) {
      const fieldName = field.replace('_', ' ')
      newErrors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} wajib diisi`
    }
  })

  // Date validation
  if (form.start_date && form.end_date) {
    const startDate = new Date(form.start_date)
    const endDate = new Date(form.end_date)
    const now = new Date()

    if (startDate >= endDate) {
      newErrors.end_date = 'Tanggal selesai harus setelah tanggal mulai'
    }

    if (startDate < now) {
      newErrors.start_date = 'Tanggal mulai tidak boleh di masa lalu'
    }
  }

  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}

// Submit handler
const handleSubmit = async (): Promise<void> => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    errorMessage.value = 'Mohon periksa kembali form yang telah diisi'
    return
  }

  loading.value = true

  try {
    const formData = new FormData()

    // Add text fields
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())
    formData.append('start_date', form.start_date)
    formData.append('end_date', form.end_date)
    formData.append('location', form.location.trim())
    formData.append('status', form.status)

    // Add files if they exist
    if (form.banner) {
      formData.append('banner', form.banner)
    }
    if (form.cover) {
      formData.append('cover', form.cover)
    }

    const response: any = await useFetchApi('/api/events', {
      method: 'POST',
      body: formData
    })

    if (response.statusCode === 201) {
      successMessage.value = response.message || 'Event berhasil dibuat!'
      resetForm()

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      errorMessage.value = response.message || 'Terjadi kesalahan saat membuat event'
    }

  } catch (error: any) {
    console.error('Error creating event:', error)
    errorMessage.value = error.data?.message || 'Terjadi kesalahan saat membuat event'
  } finally {
    loading.value = false
  }
}

// Reset form
const resetForm = (): void => {
  Object.assign(form, {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    status: 'DRAFT' as const,
    banner: null,
    cover: null,
  })

  Object.keys(errors).forEach(key => delete errors[key])
  errorMessage.value = ''

  // Reset file inputs
  if (process.client) {
    if (bannerInput.value) bannerInput.value.value = ''
    if (coverInput.value) coverInput.value.value = ''
  }
}

// Clear errors when user starts typing
watch(() => form.title, () => {
  if (errors.title) delete errors.title
  if (errorMessage.value) errorMessage.value = ''
})

watch(() => form.description, () => {
  if (errors.description) delete errors.description
  if (errorMessage.value) errorMessage.value = ''
})

watch(() => form.start_date, () => {
  if (errors.start_date) delete errors.start_date
  if (errorMessage.value) errorMessage.value = ''
})

watch(() => form.end_date, () => {
  if (errors.end_date) delete errors.end_date
  if (errorMessage.value) errorMessage.value = ''
})

watch(() => form.location, () => {
  if (errors.location) delete errors.location
  if (errorMessage.value) errorMessage.value = ''
})
</script>