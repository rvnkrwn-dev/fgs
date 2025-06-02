<template>
  <div class="min-h-screen bg-gray-50 pb-4">
    <!-- Hero Banner Section -->
    <div class="relative h-80 md:h-96 overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500">
      <img
          :src="event?.banner_url"
          alt="Event Banner"
          class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>

    <!-- Main Content Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
      <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8">

        <!-- Left Column - Event Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Event Cover & Basic Info Card -->
          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Event Cover Image -->
              <div class="flex-shrink-0">
                <div class="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-lg mx-auto md:mx-0">
                  <img
                      :src="event?.cover_url"
                      alt="Event Cover"
                      class="w-full h-full object-cover"
                  >
                </div>
              </div>

              <!-- Event Info -->
              <div class="flex-1 space-y-4">
                <!-- Status Badge -->
                <div class="flex items-center gap-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Gratis
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ event?.status }}
                  </span>
                </div>

                <!-- Event Title -->
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {{ event?.title }}
                </h1>

                <!-- Organizer -->
                <div class="flex items-center gap-3 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span class="font-medium">{{ event?.created_by?.name }}</span>
                </div>

                <!-- Location -->
                <div class="flex items-center gap-3 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ event?.location }}</span>
                </div>

                <!-- Registration Count -->
                <div class="flex items-center gap-3 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292V21a1 1 0 01-2 0V9.646a4 4 0 110-5.292z"></path>
                  </svg>
                  <span>{{ event?._count?.registrations }} peserta terdaftar</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Event Description Card -->
          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 hidden lg:block">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Deskripsi Event
            </h2>
            <div class="prose prose-gray max-w-none">
              <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ event?.description }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column - Registration Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-8 space-y-6">

            <!-- Registration Card -->
            <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-100">
              <div class="text-center mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Daftarkan Diri Anda</h3>
                <p class="text-sm text-gray-600">Jangan sampai terlewat!</p>
              </div>

              <!-- Status Messages -->
              <div v-if="statusMessage" class="mb-6 p-4 rounded-lg" :class="statusType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
                <div class="flex items-center gap-2">
                  <svg v-if="statusType === 'success'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span class="text-sm font-medium" :class="statusType === 'success' ? 'text-green-800' : 'text-red-800'">
                    {{ statusMessage }}
                  </span>
                </div>
              </div>

              <!-- Registration Form -->
              <form v-if="!registrationSuccess" @submit.prevent="handleRegister" class="space-y-4">
                <!-- Full Name -->
                <div>
                  <label for="full_name" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                  <input
                      type="text"
                      id="full_name"
                      v-model="formData.full_name"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Masukkan nama lengkap"
                  >
                </div>

                <!-- WhatsApp -->
                <div>
                  <label for="whatsapp" class="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp *</label>
                  <input
                      type="tel"
                      id="whatsapp"
                      v-model="whatsappInput"
                      @input="formatWhatsApp"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="08xxxxxxxxxx atau +628xxxxxxxxx"
                  >
                  <p class="text-xs text-gray-500 mt-1">Format: 628xxxxxxxxx (akan diformat otomatis)</p>
                </div>

                <!-- Province -->
                <div>
                  <label for="province" class="block text-sm font-medium text-gray-700 mb-1">Provinsi *</label>
                  <input
                      type="text"
                      id="province"
                      v-model="formData.province"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Contoh: DKI Jakarta"
                  >
                </div>

                <!-- City -->
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten *</label>
                  <input
                      type="text"
                      id="city"
                      v-model="formData.city"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Contoh: Jakarta Selatan"
                  >
                </div>

                <!-- District -->
                <div>
                  <label for="district" class="block text-sm font-medium text-gray-700 mb-1">Kecamatan *</label>
                  <input
                      type="text"
                      id="district"
                      v-model="formData.district"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Contoh: Kebayoran Baru"
                  >
                </div>

                <!-- Postal Code -->
                <div>
                  <label for="postal_code" class="block text-sm font-medium text-gray-700 mb-1">Kode Pos *</label>
                  <input
                      type="text"
                      id="postal_code"
                      v-model="formData.postal_code"
                      required
                      pattern="[0-9]{5}"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="12345"
                  >
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-800">{{ errorMessage }}</p>
                </div>

                <!-- Registration Deadline -->
                <div class="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 my-4">
                  <div class="text-center">
                    <p class="text-sm font-medium text-gray-600 mb-1">Terbuka hingga</p>
                    <p class="text-lg font-bold text-orange-600">{{ transformDate(event?.start_date) }}</p>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white flex items-center justify-center gap-3"
                >
                  <div v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span v-if="isLoading">Mendaftar...</span>
                  <span v-else>Daftar Sekarang</span>
                </button>

                <p class="text-xs text-gray-500 text-center mt-3">
                  Dengan mendaftar, Anda menyetujui untuk mengikuti event ini
                </p>
              </form>

              <!-- Already Registered Message -->
              <div v-if="registrationSuccess" class="text-center">
                <button
                    @click="resetRegistration"
                    class="text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer hover:underline"
                >
                  Daftar Lagi?
                </button>
              </div>
            </div>

            <!-- Event Schedule Card -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Jadwal Event
              </h3>

              <div class="space-y-4">
                <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div class="flex-shrink-0 w-3 h-3 bg-green-400 rounded-full mt-1"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-700">Mulai</p>
                    <p class="text-sm text-gray-600">{{ transformDate(event?.start_date) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <div class="flex-shrink-0 w-3 h-3 bg-red-400 rounded-full mt-1"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-700">Selesai</p>
                    <p class="text-sm text-gray-600">{{ transformDate(event?.end_date) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Event Description Card -->
            <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:hidden">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Deskripsi Event
              </h2>
              <div class="prose prose-gray max-w-none">
                <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ event?.description }}</p>
              </div>
            </div>

            <!-- Event Stats Card -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Statistik Event</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600">{{ event?._count?.registrations || 0 }}</p>
                  <p class="text-xs text-gray-600">Pendaftar</p>
                </div>
                <div class="text-center p-3 bg-purple-50 rounded-lg">
                  <p class="text-2xl font-bold text-purple-600">Gratis</p>
                  <p class="text-xs text-gray-600">Harga</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { transformDate } from "~/utils/transformDate";

const router = useRoute();
const { id } = router.params;
const { getIsLoading, setLoading } = useAuth();
const isLoading = computed(() => getIsLoading());
const eventData = ref<any>(await useFetchApi(`/api/events/${id}`));
const event = computed(() => eventData.value?.data?.event);

const registrationSuccess = ref(false);
const errorMessage = ref('');
const statusMessage = ref('');
const statusType = ref<'success' | 'error'>('success');
const whatsappInput = ref('');

const formData = ref({
  event_id: id,
  full_name: '',
  whatsapp: '',
  province: '',
  city: '',
  district: '',
  postal_code: ''
});

const getEvent = async () => {
  if (isLoading.value) return;
  setLoading(true);
  try {
    const response: any = await useFetchApi(`/api/events/${id}`);
    eventData.value = response;
  } catch (e) {
    console.error('Gagal load event:', e);
  } finally {
    setLoading(false);
  }
};

const formatWhatsApp = () => {
  let value = whatsappInput.value.replace(/\D/g, ''); // Remove non-digits

  // Handle different formats
  if (value.startsWith('08')) {
    // Convert 08xxxxxxxx to 628xxxxxxxx
    value = '62' + value.substring(1);
  } else if (value.startsWith('628')) {
    // Already in correct format
    value = value;
  } else if (value.startsWith('8')) {
    // Convert 8xxxxxxxx to 628xxxxxxxx
    value = '62' + value;
  } else if (value.startsWith('62')) {
    // Handle 62xxxxxxxx (without 8)
    if (!value.startsWith('628')) {
      value = value.substring(0, 2) + '8' + value.substring(2);
    }
  }

  // Update the form data
  formData.value.whatsapp = value;

  // Update display format for user
  if (value.length > 2) {
    whatsappInput.value = value;
  }
};

const validateWhatsApp = (whatsapp: string): boolean => {
  // Check if format is 628xxxxxxxxx and has at least 11 digits
  const whatsappRegex = /^628\d{8,12}$/;
  return whatsappRegex.test(whatsapp);
};

const resetRegistration = () => {
  registrationSuccess.value = false;
  statusMessage.value = '';
  errorMessage.value = '';
};

const handleRegister = async () => {
  if (isLoading.value) return;

  // Reset messages
  errorMessage.value = '';
  statusMessage.value = '';

  // Validate form
  if (!formData.value.full_name || !formData.value.whatsapp || !formData.value.province ||
      !formData.value.city || !formData.value.district || !formData.value.postal_code) {
    statusMessage.value = 'Semua field wajib diisi';
    statusType.value = 'error';
    return;
  }

  // Validate WhatsApp format
  if (!validateWhatsApp(formData.value.whatsapp)) {
    statusMessage.value = 'Format WhatsApp tidak valid (gunakan format: 628xxxxxxxxx)';
    statusType.value = 'error';
    return;
  }

  // Validate postal code format
  if (!/^\d{5}$/.test(formData.value.postal_code)) {
    statusMessage.value = 'Kode pos harus 5 digit angka';
    statusType.value = 'error';
    return;
  }

  setLoading(true);
  try {
    const response = await useFetchApi('/api/registrations', {
      method: 'POST',
      body: formData.value
    });

    console.log('Berhasil mendaftar ke event!');
    registrationSuccess.value = true;
    statusMessage.value = 'Berhasil registrasi!';
    statusType.value = 'success';

    // Reset form
    formData.value = {
      event_id: id,
      full_name: '',
      whatsapp: '',
      province: '',
      city: '',
      district: '',
      postal_code: ''
    };
    whatsappInput.value = '';

    // Refresh event data to update registration count
    await getEvent();

  } catch (e: any) {
    console.error('Gagal mendaftar ke event:', e?.data?.message || e.message);
    statusMessage.value = e?.data?.message || 'Gagal registrasi!';
    statusType.value = 'error';
  } finally {
    setLoading(false);
  }
};

onMounted(async () => {
  await getEvent();
});
</script>

<style scoped>
.prose p {
  margin-bottom: 1rem;
}

input:focus {
  outline: none;
}
</style>