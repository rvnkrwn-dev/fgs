<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute inset-0 hero-pattern opacity-30"></div>

      <div class="relative container mx-auto py-16 px-4">
        <div class="text-center text-white">
          <img src="/logo%20fix%20fgs.png" alt="logo fgs" class="h-52 mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Festival Gunung Selamet
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Jelajahi keindahan alam dan budaya di kaki Gunung Selamet bersama kami!
          </p>
          <div class="mt-8 flex justify-center">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
              <div class="flex items-center gap-4 text-white">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-sm font-medium">{{ events.length }} Event Festival</span>
                </div>
                <div class="w-px h-6 bg-white/30"></div>
                <div class="flex items-center gap-2">
                  <Users class="h-4 w-4" />
                  <span class="text-sm font-medium">Pendaftaran Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto py-12 px-4">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Enhanced Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-8 space-y-6">
            <!-- Quick Stats Card -->
            <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader class="pb-4">
                <CardTitle class="text-lg flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                  Statistik Festival
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Calendar class="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Total Event</p>
                        <p class="font-bold text-green-700">{{ events.length }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Users class="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Peserta</p>
                        <p class="font-bold text-green-700">{{ totalParticipants }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Filter Categories -->
            <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader class="pb-4">
                <CardTitle class="text-lg flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                  Kategori Festival
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-2">
                  <button class="w-full text-left p-3 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-between group">
                    <span class="text-sm font-medium">Semua Event Festival</span>
                    <ChevronRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button class="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between group">
                    <span class="text-sm font-medium">Event Aktif</span>
                    <ChevronRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button class="w-full text-left p-3 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-between group">
                    <span class="text-sm font-medium">Event Selesai</span>
                    <ChevronRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Enhanced Main Content -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Enhanced Search and Filter Header -->
          <Card class="sticky top-4 z-50 border-0 shadow-2xl bg-white/95 backdrop-blur-md">
            <CardContent class="p-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                  <div class="relative group">
                    <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        type="text"
                        placeholder="Cari event festival impian Anda..."
                        class="pl-12 pr-4 py-3 text-base border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all duration-200 bg-gray-50 focus:bg-white"
                        :value="keyword"
                        @input="handleInputKeyword($event.target.value)"
                    />
                  </div>
                </div>

                <Select :value="filter" @update:value="filter = $event">
                  <SelectTrigger class="w-full sm:w-56 h-12 border-2 border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors">
                    <SelectValue placeholder="🆕 Festival Terbaru" />
                  </SelectTrigger>
                  <SelectContent class="rounded-xl border-0 shadow-xl">
                    <SelectItem value="newest" class="rounded-lg">🆕 Festival Terbaru</SelectItem>
<!--                    <SelectItem value="updates" class="rounded-lg">🔄 Update Terbaru</SelectItem>-->
<!--                    <SelectItem value="published" class="rounded-lg">📢 Dipublikasikan</SelectItem>-->
<!--                    <SelectItem value="completed" class="rounded-lg">✅ Selesai</SelectItem>-->
<!--                    <SelectItem value="draft" class="rounded-lg">📝 Draft</SelectItem>-->
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <!-- Enhanced Events Grid -->
          <div v-if="filteredEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card v-for="(event, index) in filteredEvents" :key="index"
                  class="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden">
              <div class="aspect-video relative overflow-hidden">
                <img
                    :src="getImageUrl(event.cover_url)"
                    :alt="event.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    @error="handleImageError"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <!-- Status Badges -->
                <div class="absolute top-4 left-4 flex flex-col gap-2">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm border border-blue-200"
                        :class="{
                          'text-blue-700 bg-blue-50 border-blue-200': event.status === 'PUBLISHED',
                          'text-green-700 bg-green-50 border-green-200': event.status === 'COMPLETED',
                          'text-yellow-700 bg-yellow-50 border-yellow-200': event.status === 'DRAFT',
                          'text-red-700 bg-red-50 border-red-200': event.status === 'CANCELLED'
                        }">
                    {{ getStatusLabel(event.status) }}
                  </span>
                </div>

                <div class="absolute top-4 right-4">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                    <div class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    Gratis
                  </span>
                </div>

                <!-- Hover Action -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button size="sm" class="bg-white text-blue-600 hover:bg-blue-50 shadow-xl border-0 rounded-full px-6">
                    Lihat Detail
                    <ArrowRight class="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader class="space-y-3 p-6">
                <div class="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Calendar class="h-4 w-4" />
                  <span>{{ formatDate(event.start_date) }}</span>
                </div>
                <CardTitle class="text-xl leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {{ event.title }}
                </CardTitle>
              </CardHeader>

              <CardContent class="space-y-4 px-6 pb-4">
                <p class="text-muted-foreground line-clamp-2 leading-relaxed text-sm">
                  {{ event.description }}
                </p>

                <div class="space-y-3 pt-4 border-t border-gray-100">
                  <!-- Location with proper handling for long text -->
                  <div class="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin class="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span class="font-medium leading-relaxed" :title="event.location">{{ event.location }}</span>
                  </div>

                  <!-- Participants count -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-full border border-green-200">
                      <Users class="h-4 w-4 text-green-600" />
                      <span class="text-sm font-semibold text-green-700">{{ event._count?.registrations || 0 }} Peserta</span>
                    </div>

                    <!-- Event status indicator -->
                    <div class="flex items-center gap-1">
                      <div class="w-2 h-2 rounded-full" :class="getStatusIndicatorClass(event.status)"></div>
                      <span class="text-xs font-medium" :class="getStatusTextClass(event.status)">
                        {{ getStatusLabel(event.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter class="p-6 pt-2">
                <Button
                    class="w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                    :class="getButtonClass(event.status)"
                    @click="navigateToEvent(event.id)"
                    :disabled="isEventDisabled(event.status)"
                >
                  <span>{{ getButtonText(event.status) }}</span>
                  <ArrowRight class="ml-2 h-5 w-5" v-if="!isEventDisabled(event.status)" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <!-- Enhanced Empty State -->
          <Card v-else-if="!isLoading" class="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
            <CardContent class="flex flex-col items-center justify-center py-16">
              <div class="relative mb-6">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Search class="h-10 w-10 text-blue-500" />
                </div>
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span class="text-xs">🔍</span>
                </div>
              </div>
              <h3 class="text-2xl font-bold mb-3 text-gray-800">Tidak ada event festival ditemukan</h3>
              <p class="text-muted-foreground text-center max-w-md leading-relaxed">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan untuk menemukan event festival yang sesuai.
              </p>
              <Button variant="outline" class="mt-6 rounded-xl" @click="keyword = ''; filter = 'newest'">
                Reset Pencarian
              </Button>
            </CardContent>
          </Card>

          <!-- Enhanced Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
            <div class="relative">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
              <div class="absolute inset-0 rounded-full bg-blue-100 animate-pulse opacity-30"></div>
            </div>
            <p class="text-lg text-muted-foreground animate-pulse">Memuat data, harap tunggu...</p>
          </div>

          <!-- Enhanced Load More Button -->
          <div v-if="hasMore && !isLoading" class="flex justify-center pt-8">
            <Button
                variant="outline"
                @click="getAllEvent"
                class="min-w-48 h-12 rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
            >
              <RefreshCw class="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              Muat Lebih Banyak Event Festival
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  ChevronRight,
  RefreshCw
} from 'lucide-vue-next'

const { getIsLoading } = useAuth()
const keyword = ref('')
const filter = ref('newest')
const events = ref<any[]>([])
const page = ref(1)
const limit = 6
const isLoading = ref<boolean>(false)
const isServerLoading = computed(() => getIsLoading())
const hasMore = ref(true)
const paginationData = ref<any>({})

const totalParticipants = computed(() => {
  return events.value.reduce((total, event) => total + (event._count?.registrations || 0), 0)
})

const handleInputKeyword = (value: string) => {
  keyword.value = value
}

const filteredEvents = computed(() => {
  let filtered = events.value

  // Filter by keyword
  if (keyword.value) {
    const lower = keyword.value.toLowerCase()
    filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(lower) ||
        event.description.toLowerCase().includes(lower) ||
        event.location.toLowerCase().includes(lower)
    )
  }

  // Sort by filter
  switch (filter.value) {
    case 'newest':
      return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    case 'updates':
      return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    case 'published':
      return filtered.filter(event => event.status === 'PUBLISHED')
    case 'completed':
      return filtered.filter(event => event.status === 'COMPLETED')
    case 'draft':
      return filtered.filter(event => event.status === 'DRAFT')
    default:
      return filtered
  }
})

const getAllEvent = async () => {
  if (isServerLoading.value) return
  isLoading.value = true

  try {
    const res: any = await useFetchApi(`/api/events?page=${page.value}&limit=${limit}`)
    const newEvents = res?.data?.events || []
    if (newEvents.length < limit) hasMore.value = false
    paginationData.value = res?.data?.pagination || {}
    events.value.push(...newEvents)
    page.value += 1
  } catch (e) {
    console.error('Gagal load event:', e)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getStatusLabel = (status: string) => {
  const labels = {
    'PUBLISHED': 'Dipublikasikan',
    'DRAFT': 'Draft',
    'COMPLETED': 'Selesai',
    'CANCELLED': 'Dibatalkan'
  }
  return labels[status] || status
}

const getStatusIndicatorClass = (status: string) => {
  const classes = {
    'PUBLISHED': 'bg-green-400 animate-pulse',
    'DRAFT': 'bg-yellow-400',
    'COMPLETED': 'bg-blue-400',
    'CANCELLED': 'bg-red-400'
  }
  return classes[status] || 'bg-gray-400'
}

const getStatusTextClass = (status: string) => {
  const classes = {
    'PUBLISHED': 'text-green-600',
    'DRAFT': 'text-yellow-600',
    'COMPLETED': 'text-blue-600',
    'CANCELLED': 'text-red-600'
  }
  return classes[status] || 'text-gray-600'
}

const getButtonClass = (status: string) => {
  if (status === 'CANCELLED' || status === 'COMPLETED') {
    return 'bg-gray-100 text-gray-500 cursor-not-allowed'
  }
  if (status === 'DRAFT') {
    return 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'
  }
  return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
}

const getButtonText = (status: string) => {
  const texts = {
    'PUBLISHED': 'Daftar Sekarang',
    'DRAFT': 'Preview Event',
    'COMPLETED': 'Event Selesai',
    'CANCELLED': 'Event Dibatalkan'
  }
  return texts[status] || 'Lihat Detail'
}

const isEventDisabled = (status: string) => {
  return status === 'CANCELLED' || status === 'COMPLETED'
}

const getImageUrl = (coverUrl: string | null) => {
  if (!coverUrl) return '/api/placeholder/400/225'
  // Handle relative paths from your server
  if (coverUrl.startsWith('/uploads/')) {
    return `${window.location.origin}${coverUrl}`
  }
  return coverUrl
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/api/placeholder/400/225'
}

const navigateToEvent = (eventId: string) => {
  navigateTo(`/events/${eventId}`)
}

watch(isServerLoading, (newValue) => {
  if (!newValue) {
    getAllEvent()
  }
})

const handleScroll = async () => {
  if (isLoading.value) return
  if (paginationData.value?.totalPages < page.value) return
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollY + windowHeight >= fullHeight - 100) {
    await getAllEvent()
  }
}

onMounted(async () => {
  await getAllEvent()
  window.addEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
  background-size: 20px 20px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>