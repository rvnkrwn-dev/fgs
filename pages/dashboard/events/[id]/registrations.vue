<template>
  <div class="flex flex-1 flex-col gap-6 p-6 pt-0">
    <!-- Loading State for Initial Data -->
    <div v-if="initialLoading" class="flex justify-center items-center p-12">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
        <p class="text-muted-foreground">Memuat data registrasi...</p>
      </div>
    </div>

    <!-- Error State for Data Loading -->
    <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <AlertCircle class="w-6 h-6 text-red-400 mr-3" />
        <div>
          <h3 class="text-lg font-semibold text-red-800">Gagal Memuat Data</h3>
          <p class="text-red-600">{{ loadError }}</p>
          <button @click="loadData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Coba Lagi
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Enhanced Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <button @click="navigateTo('/dashboard/events')"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              <ArrowLeft class="h-4 w-4" />
              Kembali
            </button>
            <div class="w-px h-6 bg-gray-300"></div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': eventData?.status === 'PUBLISHED',
                    'bg-yellow-100 text-yellow-800': eventData?.status === 'DRAFT',
                    'bg-green-100 text-green-800': eventData?.status === 'COMPLETED',
                    'bg-red-100 text-red-800': eventData?.status === 'CANCELLED'
                  }">
              {{ getStatusLabel(eventData?.status) }}
            </span>
          </div>
          <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-700 to-blue-600 bg-clip-text text-transparent">
            Pendaftar: {{ eventData?.title }}
          </h1>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-muted-foreground">
            <div class="flex items-center gap-1">
              <Calendar class="h-4 w-4" />
              {{ formatDate(eventData?.start_date) }}
            </div>
            <div class="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div class="flex items-center gap-1">
              <MapPin class="h-4 w-4 text-red-500" />
              {{ eventData?.location }}
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <Button @click="exportRegistrations" variant="outline" class="gap-2">
            <Download class="h-4 w-4" />
            Export CSV
          </Button>
          <Button @click="refreshData" class="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg">
            <RefreshCw class="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <!-- Enhanced Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card class="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-700">Total Pendaftar</p>
                <p class="text-2xl font-bold text-blue-900">{{ pagination.total }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-700">Hari Ini</p>
                <p class="text-2xl font-bold text-green-900">{{ getTodayRegistrations() }}</p>
              </div>
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Clock class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-purple-700">Provinsi</p>
                <p class="text-2xl font-bold text-purple-900">{{ getUniqueProvincesCount() }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <MapPin class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-orange-700">Minggu Ini</p>
                <p class="text-2xl font-bold text-orange-900">{{ getWeekRegistrations() }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Enhanced Filters -->
      <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            Filter & Pencarian Pendaftar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="space-y-2">
              <Label for="search">Cari Pendaftar</Label>
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="search"
                    v-model="filters.search"
                    placeholder="Nama, WhatsApp..."
                    class="pl-10"
                    @input="debouncedSearch"
                />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="province">Provinsi</Label>
              <Select v-model="filters.province" @update:model-value="fetchRegistrations">
                <SelectTrigger>
                  <SelectValue placeholder="Semua Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Provinsi</SelectItem>
                  <SelectItem v-for="province in uniqueProvinces" :key="province" :value="province">
                    {{ province }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="date-from">Tanggal Mulai</Label>
              <Input
                  id="date-from"
                  v-model="filters.dateFrom"
                  type="date"
                  @change="fetchRegistrations"
              />
            </div>
            <div class="space-y-2">
              <Label for="date-to">Tanggal Selesai</Label>
              <Input
                  id="date-to"
                  v-model="filters.dateTo"
                  type="date"
                  @change="fetchRegistrations"
              />
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-muted-foreground">
              Menampilkan {{ registrations.length }} dari {{ pagination.total }} pendaftar
            </div>
            <Button variant="outline" @click="resetFilters" class="gap-2">
              <RefreshCw class="h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Enhanced Data Table -->
      <Card class="border-0 shadow-lg overflow-hidden">
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow class="bg-gray-50">
                  <TableHead class="w-12">
                    <Checkbox
                        :checked="selectedRegistrations.length === registrations.length && registrations.length > 0"
                        @update:checked="toggleSelectAll"
                    />
                  </TableHead>
                  <TableHead class="font-semibold">Pendaftar</TableHead>
                  <TableHead class="font-semibold">Alamat</TableHead>
                  <TableHead class="font-semibold">Kontak</TableHead>
                  <TableHead class="font-semibold">Tanggal Daftar</TableHead>
                  <TableHead class="text-right font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="registration in registrations" :key="registration.id" class="hover:bg-green-50/50 transition-colors">
                  <TableCell>
                    <Checkbox
                        :checked="selectedRegistrations.includes(registration.id)"
                        @update:checked="toggleSelectRegistration(registration.id)"
                    />
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {{ getInitials(registration.full_name) }}
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-foreground">
                          {{ registration.full_name }}
                        </p>
                        <p class="text-xs text-muted-foreground">
                          ID: {{ registration.id.slice(-8) }}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="space-y-1">
                      <p class="text-sm font-medium">{{ registration.province }}</p>
                      <p class="text-xs text-muted-foreground">{{ registration.city }}, {{ registration.district }}</p>
                      <p class="text-xs text-muted-foreground">{{ registration.postal_code }}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="space-y-1">
                      <div class="flex items-center gap-1">
                        <Phone class="h-3 w-3 text-green-600" />
                        <a :href="`https://wa.me/${registration.whatsapp}`" target="_blank"
                           class="text-sm text-green-600 hover:text-green-700 font-medium">
                          {{ formatPhoneNumber(registration.whatsapp) }}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="space-y-1">
                      <p class="text-sm font-medium">{{ formatDateTime(registration.registered_at) }}</p>
                      <p class="text-xs text-muted-foreground">{{ getTimeAgo(registration.registered_at) }}</p>
                    </div>
                  </TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-48">
                        <DropdownMenuItem @click="viewRegistration(registration)" class="gap-2">
                          <Eye class="h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="contactParticipant(registration)" class="gap-2">
                          <MessageCircle class="h-4 w-4" />
                          Kirim Pesan
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="exportParticipant(registration)" class="gap-2">
                          <Download class="h-4 w-4" />
                          Export Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            @click="deleteRegistration(registration.id)"
                            class="text-destructive focus:text-destructive gap-2"
                        >
                          <Trash2 class="h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Enhanced Empty State -->
          <div v-if="!loading && registrations.length === 0" class="text-center py-16">
            <div class="relative mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users class="h-10 w-10 text-green-600" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span class="text-xs">📝</span>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-2">Belum ada pendaftar</h3>
            <p class="text-muted-foreground mb-6 max-w-md mx-auto">
              Belum ada peserta yang mendaftar untuk event ini. Promosikan event Anda untuk mendapatkan pendaftar.
            </p>
            <Button @click="navigateTo(`/events/${eventId}`)" class="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Eye class="h-4 w-4" />
              Lihat Event
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Enhanced Bulk Actions -->
      <Card v-if="selectedRegistrations.length > 0" class="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50 mt-6">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">{{ selectedRegistrations.length }}</span>
              </div>
              <p class="text-sm font-medium text-foreground">
                {{ selectedRegistrations.length }} pendaftar dipilih
              </p>
            </div>
            <div class="flex space-x-2">
              <Button variant="outline" size="sm" @click="bulkExport" class="gap-1">
                <Download class="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" @click="bulkMessage" class="gap-1">
                <MessageCircle class="h-4 w-4" />
                Kirim Pesan
              </Button>
              <Button variant="destructive" size="sm" @click="bulkDelete" class="gap-1">
                <Trash2 class="h-4 w-4" />
                Hapus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Enhanced Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between bg-white p-4 rounded-lg border-0 shadow-lg mt-6">
        <p class="text-sm text-muted-foreground">
          Menampilkan {{ ((pagination.page - 1) * pagination.limit) + 1 }} sampai
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} dari
          {{ pagination.total }} pendaftar
        </p>
        <div class="flex items-center space-x-2">
          <Button
              variant="outline"
              size="sm"
              :disabled="pagination.page <= 1"
              @click="changePage(pagination.page - 1)"
              class="gap-1"
          >
            ← Sebelumnya
          </Button>
          <div class="flex items-center space-x-1">
            <template v-for="page in getVisiblePages()" :key="page">
              <Button
                  v-if="page !== '...'"
                  variant="outline"
                  size="sm"
                  :class="{ 'bg-green-500 text-white border-green-500': page === pagination.page }"
                  @click="changePage(page as number)"
              >
                {{ page }}
              </Button>
              <span v-else class="px-2 text-muted-foreground">...</span>
            </template>
          </div>
          <Button
              variant="outline"
              size="sm"
              :disabled="pagination.page >= pagination.totalPages"
              @click="changePage(pagination.page + 1)"
              class="gap-1"
          >
            Selanjutnya →
          </Button>
        </div>
      </div>
    </div>

    <!-- Registration Detail Modal -->
    <Dialog v-model:open="showDetailModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Registrasi</DialogTitle>
        </DialogHeader>
        <div v-if="selectedRegistration" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <Card>
              <CardContent class="p-4">
                <h4 class="font-semibold mb-2">Informasi Peserta</h4>
                <div class="space-y-2 text-sm">
                  <p><strong>Nama:</strong> {{ selectedRegistration.full_name }}</p>
                  <p><strong>WhatsApp:</strong> {{ formatPhoneNumber(selectedRegistration.whatsapp) }}</p>
                  <p><strong>Tanggal Daftar:</strong> {{ formatDateTime(selectedRegistration.registered_at) }}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-4">
                <h4 class="font-semibold mb-2">Alamat</h4>
                <div class="space-y-2 text-sm">
                  <p><strong>Provinsi:</strong> {{ selectedRegistration.province }}</p>
                  <p><strong>Kota:</strong> {{ selectedRegistration.city }}</p>
                  <p><strong>Kecamatan:</strong> {{ selectedRegistration.district }}</p>
                  <p><strong>Kode Pos:</strong> {{ selectedRegistration.postal_code }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent class="p-4">
              <h4 class="font-semibold mb-2">Informasi Event</h4>
              <div class="space-y-2 text-sm">
                <p><strong>Nama Event:</strong> {{ eventData?.title }}</p>
                <p><strong>Tanggal Event:</strong> {{ formatDate(eventData?.start_date) }}</p>
                <p><strong>Lokasi:</strong> {{ eventData?.location }}</p>
              </div>
            </CardContent>
          </Card>
          <div class="flex gap-2">
            <Button @click="contactParticipant(selectedRegistration)" class="gap-2 flex-1">
              <MessageCircle class="h-4 w-4" />
              Kirim Pesan WhatsApp
            </Button>
            <Button @click="exportParticipant(selectedRegistration)" variant="outline" class="gap-2">
              <Download class="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Eye,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

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
  start_date: string
  location: string
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED'
}

interface Registration {
  id: string
  event_id: string
  full_name: string
  whatsapp: string
  province: string
  city: string
  district: string
  postal_code: string
  registered_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Filters {
  search: string
  province: string
  dateFrom: string
  dateTo: string
}

// State
const registrations = ref<Registration[]>([])
const eventData = ref<Event | null>(null)
const loading = ref<boolean>(false)
const initialLoading = ref<boolean>(true)
const loadError = ref<string>('')
const selectedRegistrations = ref<string[]>([])
const showDetailModal = ref<boolean>(false)
const selectedRegistration = ref<Registration | null>(null)

const pagination = reactive<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
})

const filters = reactive<Filters>({
  search: '',
  province: 'ALL',
  dateFrom: '',
  dateTo: ''
})

// Computed
const uniqueProvinces = computed(() => {
  return [...new Set(registrations.value.map(r => r.province))]
})

const getUniqueProvincesCount = () => {
  return new Set(registrations.value.map(r => r.province)).size
}

const getTodayRegistrations = () => {
  const today = new Date().toDateString()
  return registrations.value.filter(r =>
      new Date(r.registered_at).toDateString() === today
  ).length
}

const getWeekRegistrations = () => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return registrations.value.filter(r =>
      new Date(r.registered_at) >= oneWeekAgo
  ).length
}

// Methods
const loadData = async () => {
  initialLoading.value = true
  loadError.value = ''

  try {
    // Load event data and registrations in parallel
    const [eventResponse, registrationsResponse]: [eventResponse: any, registrationsResponse: any] = await Promise.all([
      useFetchApi(`/api/events/${eventId}`),
      fetchRegistrations()
    ])

    if (eventResponse.statusCode === 200) {
      eventData.value = eventResponse.data.event
    } else {
      loadError.value = 'Event tidak ditemukan'
    }
  } catch (error: any) {
    console.error('Error loading data:', error)
    loadError.value = error.data?.message || 'Terjadi kesalahan saat memuat data'
  } finally {
    initialLoading.value = false
  }
}

const fetchRegistrations = async () => {
  loading.value = true

  try {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      eventId: eventId
    })

    if (filters.search) params.append('search', filters.search)
    if (filters.province && filters.province !== 'ALL') params.append('province', filters.province)
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.append('dateTo', filters.dateTo)

    const response: any = await useFetchApi(`/api/registrations?${params}`)

    if (response.statusCode === 200) {
      registrations.value = response.data.registrations
      Object.assign(pagination, response.data.pagination)
    }
  } catch (err: any) {
    console.error('Error fetching registrations:', err)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  Object.assign(filters, {
    search: '',
    province: 'ALL',
    dateFrom: '',
    dateTo: ''
  })
  pagination.page = 1
  fetchRegistrations()
}

const debouncedSearch = useDebounceFn(() => {
  pagination.page = 1
  fetchRegistrations()
}, 500)

const changePage = (page: number) => {
  pagination.page = page
  fetchRegistrations()
}

const refreshData = () => {
  loadData()
}

const getVisiblePages = () => {
  const current = pagination.page
  const total = pagination.totalPages
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

// Selection methods
const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedRegistrations.value = registrations.value.map(r => r.id)
  } else {
    selectedRegistrations.value = []
  }
}

const toggleSelectRegistration = (registrationId: string) => {
  const index = selectedRegistrations.value.indexOf(registrationId)
  if (index > -1) {
    selectedRegistrations.value.splice(index, 1)
  } else {
    selectedRegistrations.value.push(registrationId)
  }
}

// Action methods
const viewRegistration = (registration: Registration) => {
  selectedRegistration.value = registration
  showDetailModal.value = true
}

const contactParticipant = (registration: Registration) => {
  const message = `Halo ${registration.full_name}, terima kasih telah mendaftar untuk ${eventData.value?.title}!`
  const url = `https://wa.me/${registration.whatsapp}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

const exportParticipant = (registration: Registration) => {
  const data = {
    nama: registration.full_name,
    whatsapp: registration.whatsapp,
    event: eventData.value?.title,
    provinsi: registration.province,
    kota: registration.city,
    kecamatan: registration.district,
    kode_pos: registration.postal_code,
    tanggal_daftar: registration.registered_at
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `registrasi_${registration.full_name.replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const deleteRegistration = async (registrationId: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus registrasi ini?')) return

  try {
    await useFetchApi(`/api/registrations/${registrationId}`, {
      method: 'DELETE'
    })
    fetchRegistrations()
  } catch (err) {
    console.error('Error deleting registration:', err)
  }
}

const exportRegistrations = () => {
  const csvContent = [
    ['Nama', 'WhatsApp', 'Provinsi', 'Kota', 'Kecamatan', 'Kode Pos', 'Tanggal Daftar'],
    ...registrations.value.map(r => [
      r.full_name,
      r.whatsapp,
      r.province,
      r.city,
      r.district,
      r.postal_code,
      formatDateTime(r.registered_at)
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pendaftar_${eventData.value?.title?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const bulkExport = () => {
  const selectedData = registrations.value.filter(r => selectedRegistrations.value.includes(r.id))
  const csvContent = [
    ['Nama', 'WhatsApp', 'Provinsi', 'Kota', 'Kecamatan', 'Kode Pos', 'Tanggal Daftar'],
    ...selectedData.map(r => [
      r.full_name,
      r.whatsapp,
      r.province,
      r.city,
      r.district,
      r.postal_code,
      formatDateTime(r.registered_at)
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pendaftar_terpilih_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const bulkMessage = () => {
  const selectedData = registrations.value.filter(r => selectedRegistrations.value.includes(r.id))
  const phoneNumbers = selectedData.map(r => r.whatsapp).join(',')
  const message = `Halo! Terima kasih telah mendaftar untuk ${eventData.value?.title}. Kami akan segera menghubungi Anda dengan informasi lebih lanjut.`

  // Copy phone numbers to clipboard
  navigator.clipboard.writeText(phoneNumbers).then(() => {
    alert(`Nomor WhatsApp (${selectedData.length}) telah disalin ke clipboard:\n${phoneNumbers}`)
  })
}

const bulkDelete = async () => {
  if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedRegistrations.value.length} registrasi?`)) return

  try {
    await useFetchApi('/api/registrations/bulk-delete', {
      method: 'DELETE',
      body: {
        registrationIds: selectedRegistrations.value
      }
    })
    selectedRegistrations.value = []
    fetchRegistrations()
  } catch (err) {
    console.error('Error deleting registrations:', err)
  }
}

// Utility methods
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPhoneNumber = (phone: string) => {
  // Convert 628994616677 to +62 899-4616-677
  if (phone.startsWith('62')) {
    const cleaned = phone.slice(2)
    return `+62 ${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getTimeAgo = (dateString: string) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Baru saja'
  if (diffInHours < 24) return `${diffInHours} jam lalu`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} hari lalu`
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} minggu lalu`
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

// Lifecycle
onMounted(() => {
  loadData()
})
</script>