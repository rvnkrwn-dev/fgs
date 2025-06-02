<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Loading State for Initial Data -->
    <div v-if="initialLoading" class="flex justify-center items-center p-12">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
        <p class="text-muted-foreground">Memuat data event...</p>
      </div>
    </div>

    <!-- Error State for Data Loading -->
    <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-red-800">Gagal Memuat Event</h3>
          <p class="text-red-600">{{ loadError }}</p>
          <button @click="loadEventData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Coba Lagi
          </button>
        </div>
      </div>
    </div>

    <!-- Main Form -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold bg-gradient-to-r from-green-700 to-blue-600 bg-clip-text text-transparent">
              Edit Event Festival
            </h2>
            <p class="text-sm text-gray-600 mt-1">Perbarui informasi event "{{ originalEvent?.title }}"</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': originalEvent?.status === 'PUBLISHED',
                    'bg-yellow-100 text-yellow-800': originalEvent?.status === 'DRAFT',
                    'bg-green-100 text-green-800': originalEvent?.status === 'COMPLETED',
                    'bg-red-100 text-red-800': originalEvent?.status === 'CANCELLED'
                  }">
              {{ getStatusLabel(originalEvent?.status) }}
            </span>
            <button @click="navigateTo('/dashboard/events')"
                    class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              ← Kembali
            </button>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Current Images Preview -->
        <div v-if="originalEvent?.banner_url || originalEvent?.cover_url" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Gambar Saat Ini</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Current Banner -->
            <div v-if="originalEvent?.banner_url" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Banner Saat Ini</label>
              <div class="relative">
                <img :src="getImageUrl(originalEvent.banner_url)"
                     alt="Current Banner"
                     class="w-full h-32 object-cover rounded-lg border border-gray-200"
                     @error="handleImageError" />
                <div class="absolute top-2 right-2">
                  <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Banner</span>
                </div>
              </div>
            </div>

            <!-- Current Cover -->
            <div v-if="originalEvent?.cover_url" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Cover Saat Ini</label>
              <div class="relative">
                <img :src="getImageUrl(originalEvent.cover_url)"
                     alt="Current Cover"
                     class="w-full h-32 object-cover rounded-lg border border-gray-200"
                     @error="handleImageError" />
                <div class="absolute top-2 right-2">
                  <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Cover</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p class="text-sm text-blue-700">
              💡 Upload gambar baru di bawah untuk mengganti gambar yang ada. Kosongkan jika tidak ingin mengubah.
            </p>
          </div>
        </div>

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
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              :disabled="loading"
          >
            <option value="DRAFT">📝 Draft</option>
            <option value="PUBLISHED">📢 Published</option>
            <option value="COMPLETED">✅ Completed</option>
            <option value="CANCELLED">❌ Cancelled</option>
          </select>
        </div>

        <!-- File Uploads -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Banner Upload -->
          <div class="space-y-2">
            <label for="banner" class="block text-sm font-medium text-gray-700">
              Banner Event Baru
              <span class="text-xs text-gray-500">(Opsional)</span>
            </label>
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
                  class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span class="text-sm text-gray-600">
                    {{ form.banner ? form.banner.name : 'Upload Banner Baru' }}
                  </span>
                </div>
              </button>
            </div>
            <p class="text-xs text-gray-500">Format: JPG, PNG, WebP (Max: 5MB)</p>
          </div>

          <!-- Cover Upload -->
          <div class="space-y-2">
            <label for="cover" class="block text-sm font-medium text-gray-700">
              Cover Event Baru
              <span class="text-xs text-gray-500">(Opsional)</span>
            </label>
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
                  class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span class="text-sm text-gray-600">
                    {{ form.cover ? form.cover.name : 'Upload Cover Baru' }}
                  </span>
                </div>
              </button>
            </div>
            <p class="text-xs text-gray-500">Format: JPG, PNG, WebP (Max: 5MB)</p>
          </div>
        </div>

        <!-- Registration Info -->
        <div v-if="originalEvent?._count?.registrations > 0" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <p class="text-sm text-yellow-800">
                <strong>Peringatan:</strong> Event ini sudah memiliki {{ originalEvent._count.registrations }} pendaftar.
                Perubahan tanggal dan lokasi akan mempengaruhi peserta yang sudah terdaftar.
              </p>
            </div>
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
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset ke Data Asli
          </button>
          <button
              type="button"
              @click="navigateTo(`/events/${eventId}`)"
              :disabled="loading"
              class="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview Event
          </button>
          <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan Perubahan...
            </span>
            <span v-else>Simpan Perubahan</span>
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

// Get event ID from route
const route = useRoute()
const eventId = route.params.id as string

// Types
interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  banner_url: string | null
  cover_url: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED'
  created_at: string
  updated_at: string
  creator_id: string
  created_by: {
    id: string
    name: string
    email: string
  }
  _count: {
    registrations: number
  }
}

interface FormData {
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED'
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
const initialLoading = ref<boolean>(true)
const loadError = ref<string>('')
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const errors = reactive<FormErrors>({})
const originalEvent = ref<Event | null>(null)

// Refs for file inputs
const bannerInput: Ref<HTMLInputElement | null> = ref(null)
const coverInput: Ref<HTMLInputElement | null> = ref(null)

// Load event data
const loadEventData = async (): Promise<void> => {
  initialLoading.value = true
  loadError.value = ''

  try {
    const response: any = await useFetchApi(`/api/events/${eventId}`)

    if (response.statusCode === 200) {
      originalEvent.value = response.data.event

      // Populate form with existing data
      const event = response.data.event
      form.title = event.title
      form.description = event.description
      form.start_date = formatDateTimeLocal(event.start_date)
      form.end_date = formatDateTimeLocal(event.end_date)
      form.location = event.location
      form.status = event.status
    } else {
      loadError.value = response.message || 'Event tidak ditemukan'
    }
  } catch (error: any) {
    console.error('Error loading event:', error)
    loadError.value = error.data?.message || 'Terjadi kesalahan saat memuat event'
  } finally {
    initialLoading.value = false
  }
}

// Utility functions
const formatDateTimeLocal = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const getStatusLabel = (status: string | undefined): string => {
  const labels = {
    'PUBLISHED': 'Published',
    'DRAFT': 'Draft',
    'COMPLETED': 'Selesai',
    'CANCELLED': 'Dibatalkan'
  }
  return labels[status as keyof typeof labels] || status || ''
}

const getImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return '/placeholder-image.jpg'
  if (imageUrl.startsWith('/uploads/')) {
    return `${window.location.origin}${imageUrl}`
  }
  return imageUrl
}

const handleImageError = (event: Event): void => {
  (event.target as HTMLImageElement).src = '/placeholder-image.jpg'
}

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

    if (startDate >= endDate) {
      newErrors.end_date = 'Tanggal selesai harus setelah tanggal mulai'
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

    const response: any = await useFetchApi(`/api/events/${eventId}`, {
      method: 'PUT',
      body: formData
    })

    if (response.statusCode === 200) {
      successMessage.value = response.message || 'Event berhasil diperbarui!'

      // Reload event data to get updated info
      await loadEventData()

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      errorMessage.value = response.message || 'Terjadi kesalahan saat memperbarui event'
    }

  } catch (error: any) {
    console.error('Error updating event:', error)
    errorMessage.value = error.data?.message || 'Terjadi kesalahan saat memperbarui event'
  } finally {
    loading.value = false
  }
}

// Reset form to original data
const resetForm = (): void => {
  if (originalEvent.value) {
    const event = originalEvent.value
    form.title = event.title
    form.description = event.description
    form.start_date = formatDateTimeLocal(event.start_date)
    form.end_date = formatDateTimeLocal(event.end_date)
    form.location = event.location
    form.status = event.status
    form.banner = null
    form.cover = null
  }

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

// Load data on component mount
onMounted(() => {
  loadEventData()
})

// Navigation guard - warn about unsaved changes
onBeforeRouteLeave((to, from, next) => {
  if (!originalEvent.value) {
    next()
    return
  }

  const hasChanges = (
      form.title !== originalEvent.value.title ||
      form.description !== originalEvent.value.description ||
      form.start_date !== formatDateTimeLocal(originalEvent.value.start_date) ||
      form.end_date !== formatDateTimeLocal(originalEvent.value.end_date) ||
      form.location !== originalEvent.value.location ||
      form.status !== originalEvent.value.status ||
      form.banner !== null ||
      form.cover !== null
  )

  if (hasChanges && !loading.value) {
    const confirmLeave = confirm('Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?')
    if (confirmLeave) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>