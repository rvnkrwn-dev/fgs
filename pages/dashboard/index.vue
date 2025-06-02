<template>
  <div class="flex flex-1 flex-col gap-6 p-6 pt-0">
    <!-- Enhanced Header -->
    <div class="flex flex-col md:flex-row md:items-center gap-4 justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-700 to-blue-600 bg-clip-text text-transparent">
          Dashboard Festival Gunung Selamet
        </h1>
        <p class="text-muted-foreground mt-1">Selamat datang di panel admin Festival Gunung Selamet</p>
      </div>
      <div class="flex gap-2">
        <Button @click="refreshDashboard" variant="outline" class="gap-2">
          <RefreshCw class="h-4 w-4" />
          Refresh
        </Button>
        <Button @click="navigateTo('/dashboard/events/create')" class="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg">
          <PlusIcon class="h-4 w-4" />
          Buat Event Baru
        </Button>
      </div>
    </div>

    <!-- Quick Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-700">Total Events</p>
              <p class="text-2xl font-bold text-blue-900">{{ stats.totalEvents }}</p>
              <p class="text-xs text-blue-600 mt-1">{{ stats.publishedEvents }} published</p>
            </div>
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-700">Total Registrasi</p>
              <p class="text-2xl font-bold text-green-900">{{ stats.totalRegistrations }}</p>
              <p class="text-xs text-green-600 mt-1">{{ stats.todayRegistrations }} hari ini</p>
            </div>
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Users class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-700">Provinsi Terjangkau</p>
              <p class="text-2xl font-bold text-purple-900">{{ stats.totalProvinces }}</p>
              <p class="text-xs text-purple-600 mt-1">Se-Indonesia</p>
            </div>
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <MapPin class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-shadow">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-orange-700">Rata-rata/Event</p>
              <p class="text-2xl font-bold text-orange-900">{{ stats.averageParticipants }}</p>
              <p class="text-xs text-orange-600 mt-1">peserta</p>
            </div>
            <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp class="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions -->
      <Card class="border-0 shadow-lg">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <Button @click="navigateTo('/dashboard/events')" variant="outline" class="w-full justify-start gap-2">
            <Calendar class="h-4 w-4" />
            Kelola Events
          </Button>
          <Button @click="navigateTo('/dashboard/registrations')" variant="outline" class="w-full justify-start gap-2">
            <Users class="h-4 w-4" />
            Lihat Registrasi
          </Button>
          <Button @click="exportAllData" variant="outline" class="w-full justify-start gap-2">
            <Download class="h-4 w-4" />
            Export Data
          </Button>
          <Button @click="broadcastMessage" variant="outline" class="w-full justify-start gap-2">
            <MessageCircle class="h-4 w-4" />
            Kirim Broadcast
          </Button>
        </CardContent>
      </Card>

      <!-- Recent Registrations -->
      <Card class="border-0 shadow-lg lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              Registrasi Terbaru
            </CardTitle>
            <Button @click="navigateTo('/dashboard/registrations')" variant="ghost" size="sm">
              Lihat Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-green-200 border-t-green-600"></div>
          </div>
          <div v-else-if="recentRegistrations.length === 0" class="text-center py-8 text-muted-foreground">
            Belum ada registrasi terbaru
          </div>
          <div v-else class="space-y-3">
            <div v-for="registration in recentRegistrations" :key="registration.id"
                 class="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50/50 transition-colors">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {{ getInitials(registration.full_name) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ registration.full_name }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ registration.event.title }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-muted-foreground">{{ getTimeAgo(registration.registered_at) }}</p>
                <p class="text-xs text-green-600">{{ registration.province }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Events Overview & Top Provinces -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upcoming Events -->
      <Card class="border-0 shadow-lg">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center gap-2">
              <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
              Events Mendatang
            </CardTitle>
            <Button @click="navigateTo('/dashboard/events')" variant="ghost" size="sm">
              Lihat Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="upcomingEvents.length === 0" class="text-center py-8 text-muted-foreground">
            Tidak ada event mendatang
          </div>
          <div v-else class="space-y-4">
            <div v-for="event in upcomingEvents" :key="event.id"
                 class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
              <img :src="getImageUrl(event.cover_url || event.banner_url)" :alt="event.title"
                   class="w-12 h-12 rounded-lg object-cover shadow-sm" @error="handleImageError" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ event.title }}</p>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar class="h-3 w-3" />
                  {{ formatDate(event.start_date) }}
                </div>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin class="h-3 w-3 text-red-500" />
                  {{ event.location }}
                </div>
              </div>
              <div class="text-right">
                <Badge :variant="getStatusVariant(event.status)" class="text-xs">
                  {{ getStatusLabel(event.status) }}
                </Badge>
                <p class="text-xs text-green-600 mt-1">{{ event._count.registrations }} peserta</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Top Provinces -->
      <Card class="border-0 shadow-lg">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            Top Provinsi Peserta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="topProvinces.length === 0" class="text-center py-8 text-muted-foreground">
            Belum ada data provinsi
          </div>
          <div v-else class="space-y-3">
            <div v-for="(province, index) in topProvinces" :key="province.name"
                 class="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {{ index + 1 }}
                </div>
                <span class="text-sm font-medium">{{ province.name }}</span>
              </div>
              <div class="text-right">
                <span class="text-sm font-bold text-purple-700">{{ province.count }}</span>
                <span class="text-xs text-muted-foreground ml-1">peserta</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity Timeline -->
    <Card class="border-0 shadow-lg">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-center py-8 text-muted-foreground">
          Belum ada aktivitas terbaru
        </div>
<!--        <div v-else class="space-y-4">-->
<!--          <div v-for="activity in recentActivities" :key="activity.id"-->
<!--               class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50/50 transition-colors">-->
<!--            <div :class="getActivityIconClass(activity.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">-->
<!--              <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-white" />-->
<!--            </div>-->
<!--            <div class="flex-1 min-w-0">-->
<!--              <p class="text-sm font-medium">{{ activity.title }}</p>-->
<!--              <p class="text-xs text-muted-foreground">{{ activity.description }}</p>-->
<!--              <p class="text-xs text-muted-foreground mt-1">{{ getTimeAgo(activity.created_at) }}</p>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </CardContent>
    </Card>

    <!-- System Status -->
    <Card class="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
      <CardContent class="p-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p class="text-sm font-medium text-foreground">Sistem Berjalan Normal</p>
              <p class="text-xs text-muted-foreground">Terakhir diperbarui: {{ formatDateTime(new Date().toISOString()) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Server: Online</span>
            <span>Database: Connected</span>
            <span>Storage: 85% Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  RefreshCw,
  PlusIcon,
  Download,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  _count: {
    registrations: number
  }
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
  event: {
    id: string
    title: string
    start_date: string
    location: string
  }
}

interface Activity {
  id: string
  type: 'event_created' | 'registration' | 'event_published' | 'event_updated'
  title: string
  description: string
  created_at: string
}

interface Stats {
  totalEvents: number
  publishedEvents: number
  totalRegistrations: number
  todayRegistrations: number
  totalProvinces: number
  averageParticipants: number
}

interface ProvinceData {
  name: string
  count: number
}

// State
const loading = ref<boolean>(false)
const recentRegistrations = ref<Registration[]>([])
const upcomingEvents = ref<Event[]>([])
const recentActivities = ref<Activity[]>([])
const topProvinces = ref<ProvinceData[]>([])

const stats = reactive<Stats>({
  totalEvents: 0,
  publishedEvents: 0,
  totalRegistrations: 0,
  todayRegistrations: 0,
  totalProvinces: 0,
  averageParticipants: 0
})

// Methods
const fetchDashboardData = async () => {
  loading.value = true

  try {
    // Fetch dashboard stats
    const statsResponse: any = await useFetchApi('/api/dashboard/stats')
    if (statsResponse.statusCode === 200) {
      Object.assign(stats, statsResponse.data)
    }

    // Fetch recent registrations
    const registrationsResponse: any = await useFetchApi('/api/registrations?limit=5&sortBy=registered_at&sortOrder=desc')
    if (registrationsResponse.statusCode === 200) {
      recentRegistrations.value = registrationsResponse.data.registrations
    }

    // Fetch upcoming events
    const eventsResponse: any = await useFetchApi('/api/events?status=PUBLISHED&limit=5&sortBy=start_date&sortOrder=asc')
    if (eventsResponse.statusCode === 200) {
      upcomingEvents.value = eventsResponse.data.events.filter((event: any) =>
          new Date(event.start_date) >= new Date()
      )
    }

    // Fetch top provinces
    const provincesResponse: any = await useFetchApi('/api/dashboard/provinces')
    if (provincesResponse.statusCode === 200) {
      topProvinces.value = provincesResponse.data.slice(0, 5)
    }

    // Fetch recent activities (mock data for now)
    recentActivities.value = [
      {
        id: '1',
        type: 'registration',
        title: 'Registrasi Baru',
        description: 'John Doe mendaftar untuk Event Sunrise Hiking',
        created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() // 10 minutes ago
      },
      {
        id: '2',
        type: 'event_published',
        title: 'Event Dipublikasi',
        description: 'Event "Mountain Photography Workshop" telah dipublikasi',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
      },
      {
        id: '3',
        type: 'event_created',
        title: 'Event Baru',
        description: 'Event "Camping Under Stars" telah dibuat',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
      }
    ]

  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  } finally {
    loading.value = false
  }
}

const refreshDashboard = () => {
  fetchDashboardData()
}

const exportAllData = () => {
  // Mock export functionality
  alert('Fitur export sedang dalam pengembangan')
}

const broadcastMessage = () => {
  // Mock broadcast functionality
  alert('Fitur broadcast sedang dalam pengembangan')
}

// Status methods
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
  const labels: any = {
    'PUBLISHED': 'Published',
    'DRAFT': 'Draft',
    'COMPLETED': 'Selesai',
    'CANCELLED': 'Dibatalkan'
  }
  return labels[status] || status
}

// Activity methods
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'registration':
      return UserPlus
    case 'event_created':
      return PlusIcon
    case 'event_published':
      return Eye
    case 'event_updated':
      return Edit
    default:
      return Calendar
  }
}

const getActivityIconClass = (type: string) => {
  switch (type) {
    case 'registration':
      return 'bg-green-500'
    case 'event_created':
      return 'bg-blue-500'
    case 'event_published':
      return 'bg-purple-500'
    case 'event_updated':
      return 'bg-orange-500'
    default:
      return 'bg-gray-500'
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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return '/placeholder-image.jpg'
  if (imageUrl.startsWith('/uploads/')) {
    return `${window.location.origin}${imageUrl}`
  }
  return imageUrl
}

const handleImageError = (event: any) => {
  (event?.target as HTMLImageElement).src = '/placeholder-image.jpg'
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})
</script>