<template>
  <NuxtLink
      :to="`/events/${event?.id ?? ''}`"
      class="group relative flex flex-col h-full border border-gray-200 hover:shadow-lg hover:shadow-black/5 transition duration-300 rounded-xl overflow-hidden"
  >
    <!-- Badge -->
    <span class="absolute top-3 left-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
      Mendatang
    </span>

    <!-- Image -->
    <div class="aspect-w-16 aspect-h-11 h-full">
      <img
          :src="event?.cover_url"
          :alt="event?.title"
          class="h-full w-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300 "
      />
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1 h-fit">
      <h3 class="font-semibold text-gray-800">{{ event?.title }}</h3>
      <div id="description" class="mt-2 text-sm text-gray-600">{{ event?.description.slice(0,50) }}...</div>
      <p class="mt-2 text-sm text-gray-600 inline-flex items-center">
        <Icon icon="mdi:location" class="mr-1" />
        {{ event?.location }}
      </p>
      <div class="mt-auto pt-4">
        <p class="text-lg font-bold text-gray-800">
          {{ event.event_type }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  event: {
    id: string;
    title: string;
    description: string;
    event_type: string;
    cover_url?: string;
    location: string;
    price?: string;
  }
}>()
</script>