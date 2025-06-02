<template>
  <div class="flex flex-1 flex-col gap-6 p-6 pt-0">
    <!-- Enhanced Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-700 to-blue-600 bg-clip-text text-transparent">
          Festival Events Management
        </h1>
        <p class="text-muted-foreground mt-1">Kelola semua event Festival Gunung Selamet</p>
      </div>
      <Button @click="navigateTo('/dashboard/events/create')" class="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg">
        <PlusIcon class="h-4 w-4" />
        Buat Event Baru
      </Button>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-700">Total Events</p>
              <p class="text-2xl font-bold text-blue-900">{{ pagination.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-700">Published</p>
              <p class="text-2xl font-bold text-green-900">{{ getEventCountByStatus('PUBLISHED') }}</p>
            </div>
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Eye class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-yellow-700">Draft</p>
              <p class="text-2xl font-bold text-yellow-900">{{ getEventCountByStatus('DRAFT') }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Edit class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-700">Total Registrations</p>
              <p class="text-2xl font-bold text-purple-900">{{ getTotalRegistrations() }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Enhanced Filters -->
    <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          Filter & Pencarian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-2">
            <Label for="search">Cari Event</Label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  id="search"
                  v-model="filters.search"
                  placeholder="Cari berdasarkan nama, lokasi..."
                  class="pl-10"
                  @input="debouncedSearch"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="status">Status</Label>
            <Select v-model="filters.status" @update:model-value="fetchEvents">
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="DRAFT">📝 Draft</SelectItem>
                <SelectItem value="PUBLISHED">📢 Published</SelectItem>
                <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="date-from">Tanggal Mulai</Label>
            <Input
                id="date-from"
                v-model="filters.dateFrom"
                type="date"
                @change="fetchEvents"
            />
          </div>
          <div class="space-y-2">
            <Label for="date-to">Tanggal Selesai</Label>
            <Input
                id="date-to"
                v-model="filters.dateTo"
                type="date"
                @change="fetchEvents"
            />
          </div>
        </div>
        <div class="flex justify-between items-center mt-4">
          <div class="text-sm text-muted-foreground">
            Menampilkan {{ events.length }} dari {{ pagination.total }} event
          </div>
          <Button variant="outline" @click="resetFilters" class="gap-2">
            <RefreshCw class="h-4 w-4" />
            Reset Filter
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center p-12">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
        <p class="text-muted-foreground">Memuat data events...</p>
      </div>
    </div>

    <!-- Error State -->
    <Alert v-else-if="error" variant="destructive" class="border-0 shadow-lg">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Enhanced Data Table -->
    <Card v-else class="border-0 shadow-lg overflow-hidden">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="bg-gray-50">
                <TableHead class="w-12">
                  <Checkbox
                      :checked="selectedEvents.length === events.length && events.length > 0"
                      @update:checked="toggleSelectAll"
                  />
                </TableHead>
                <TableHead class="font-semibold">Event</TableHead>
                <TableHead class="font-semibold">Tanggal</TableHead>
                <TableHead class="font-semibold">Lokasi</TableHead>
                <TableHead class="font-semibold">Status</TableHead>
                <TableHead class="font-semibold">Pendaftar</TableHead>
                <TableHead class="font-semibold">Dibuat Oleh</TableHead>
                <TableHead class="text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="event in events" :key="event.id" class="hover:bg-green-50/50 transition-colors">
                <TableCell>
                  <Checkbox
                      :checked="selectedEvents.includes(event.id)"
                      @update:checked="toggleSelectEvent(event.id)"
                  />
                </TableCell>
                <TableCell>
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <img
                          :src="getImageUrl(event.cover_url || event.banner_url)"
                          :alt="event.title"
                          class="h-12 w-12 rounded-lg object-cover shadow-sm"
                          @error="handleImageError"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-foreground truncate">
                        {{ event.title }}
                      </p>
                      <p class="text-xs text-muted-foreground truncate max-w-48" :title="event.description">
                        {{ event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description }}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="text-sm">
                    <p class="font-medium flex items-center gap-1">
                      <Calendar class="h-3 w-3 text-green-600" />
                      {{ formatDate(event.start_date) }}
                    </p>
                    <p class="text-muted-foreground text-xs">sampai {{ formatDate(event.end_date) }}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1">
                    <MapPin class="h-3 w-3 text-red-500 flex-shrink-0" />
                    <p class="text-sm truncate max-w-32" :title="event.location">{{ event.location }}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(event.status)" class="font-medium">
                    {{ getStatusLabel(event.status) }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg w-fit">
                    <Users class="h-4 w-4 text-green-600" />
                    <span class="text-sm font-semibold text-green-700">{{ event._count.registrations }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {{ event.created_by.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ event.created_by.name }}</p>
                      <p class="text-xs text-muted-foreground">{{ event.created_by.email }}</p>
                    </div>
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
                      <DropdownMenuItem @click="viewEvent(event.id)" class="gap-2">
                        <Eye class="h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="editEvent(event.id)" class="gap-2">
                        <Edit class="h-4 w-4" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="viewRegistrations(event.id)" class="gap-2">
                        <Users class="h-4 w-4" />
                        Lihat Pendaftar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                          @click="deleteEvent(event.id)"
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
        <div v-if="!loading && events.length === 0" class="text-center py-16">
          <div class="relative mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar class="h-10 w-10 text-green-600" />
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span class="text-xs">📅</span>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-foreground mb-2">Belum ada event festival</h3>
          <p class="text-muted-foreground mb-6 max-w-md mx-auto">
            Mulai dengan membuat event festival pertama untuk Festival Gunung Selamet.
          </p>
          <Button @click="navigateTo('/dashboard/events/create')" class="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <PlusIcon class="h-4 w-4" />
            Buat Event Pertama
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Enhanced Bulk Actions -->
    <Card v-if="selectedEvents.length > 0" class="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">{{ selectedEvents.length }}</span>
            </div>
            <p class="text-sm font-medium text-foreground">
              {{ selectedEvents.length }} event dipilih
            </p>
          </div>
          <div class="flex space-x-2">
            <Button variant="outline" size="sm" @click="bulkUpdateStatus('PUBLISHED')" class="gap-1">
              📢 Publish
            </Button>
            <Button variant="outline" size="sm" @click="bulkUpdateStatus('DRAFT')" class="gap-1">
              📝 Draft
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
    <div v-if="pagination.totalPages > 1" class="flex items-center justify-between bg-white p-4 rounded-lg border-0 shadow-lg">
      <p class="text-sm text-muted-foreground">
        Menampilkan {{ ((pagination.page - 1) * pagination.limit) + 1 }} sampai
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} dari
        {{ pagination.total }} event
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
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  AlertCircle,
  Calendar,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  PlusIcon,
  Trash2,
  Users,
  Search,
  MapPin,
  RefreshCw
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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

definePageMeta({
  layout: 'dashboard'
})

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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Filters {
  search: string
  status: string
  dateFrom: string
  dateTo: string
}

// State
const events = ref<Event[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')
const selectedEvents = ref<string[]>([])

const pagination = reactive<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
})

const filters = reactive<Filters>({
  search: '',
  status: 'ALL',
  dateFrom: '',
  dateTo: ''
})

// Computed
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'default'
    case 'DRAFT':
      return 'secondary'
    case 'COMPLETED':
      return 'outline'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusLabel = (status: string) => {
  const labels = {
    'PUBLISHED': 'Published',
    'DRAFT': 'Draft',
    'COMPLETED': 'Selesai',
    'CANCELLED': 'Dibatalkan'
  }
  return labels[status] || status
}

const getEventCountByStatus = (status: string) => {
  return events.value.filter(event => event.status === status).length
}

const getTotalRegistrations = () => {
  return events.value.reduce((total, event) => total + event._count.registrations, 0)
}

// Methods
const fetchEvents = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    })

    if (filters.search) params.append('search', filters.search)
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status)
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.append('dateTo', filters.dateTo)

    const response: any = await useFetchApi(`/api/events?${params}`)

    if (response.statusCode === 200) {
      events.value = response.data.events
      Object.assign(pagination, response.data.pagination)
    } else {
      error.value = response.message || 'Gagal mengambil data events'
    }
  } catch (err: any) {
    console.error('Error fetching events:', err)
    error.value = err.data?.message || 'Terjadi kesalahan saat mengambil data events'
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  Object.assign(filters, {
    search: '',
    status: 'ALL',
    dateFrom: '',
    dateTo: ''
  })
  pagination.page = 1
  fetchEvents()
}

const debouncedSearch = useDebounceFn(() => {
  pagination.page = 1
  fetchEvents()
}, 500)

const changePage = (page: number) => {
  pagination.page = page
  fetchEvents()
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
    selectedEvents.value = events.value.map(event => event.id)
  } else {
    selectedEvents.value = []
  }
}

const toggleSelectEvent = (eventId: string) => {
  const index = selectedEvents.value.indexOf(eventId)
  if (index > -1) {
    selectedEvents.value.splice(index, 1)
  } else {
    selectedEvents.value.push(eventId)
  }
}

// Action methods
const viewEvent = (eventId: string) => {
  navigateTo(`/events/${eventId}`)
}

const editEvent = (eventId: string) => {
  navigateTo(`/dashboard/events/${eventId}/edit`)
}

const viewRegistrations = (eventId: string) => {
  navigateTo(`/dashboard/events/${eventId}/registrations`)
}

const duplicateEvent = async (eventId: string) => {
  if (!confirm('Apakah Anda yakin ingin menduplikasi event ini?')) return

  try {
    await useFetchApi(`/api/events/${eventId}/duplicate`, {
      method: 'POST'
    })
    fetchEvents()
  } catch (err) {
    console.error('Error duplicating event:', err)
  }
}

const deleteEvent = async (eventId: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return

  try {
    await useFetchApi(`/api/events/${eventId}`, {
      method: 'DELETE'
    })
    fetchEvents()
  } catch (err) {
    console.error('Error deleting event:', err)
  }
}

const bulkUpdateStatus = async (status: string) => {
  try {
    await useFetchApi('/api/events/bulk-update', {
      method: 'PATCH',
      body: {
        eventIds: selectedEvents.value,
        status
      }
    })
    selectedEvents.value = []
    fetchEvents()
  } catch (err) {
    console.error('Error updating events:', err)
  }
}

const bulkDelete = async () => {
  if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedEvents.value.length} events?`)) return

  try {
    await useFetchApi('/api/events/bulk-delete', {
      method: 'DELETE',
      body: {
        eventIds: selectedEvents.value
      }
    })
    selectedEvents.value = []
    fetchEvents()
  } catch (err) {
    console.error('Error deleting events:', err)
  }
}

// Utility methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return '/placeholder-image.jpg'
  if (imageUrl.startsWith('/uploads/')) {
    return `${window.location.origin}${imageUrl}`
  }
  return imageUrl
}

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder-image.jpg'
}

// Lifecycle
onMounted(() => {
  fetchEvents()
})
</script>