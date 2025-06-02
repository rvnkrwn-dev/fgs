<template>
  <div>
    <!-- SearchBox -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-3.5">
        <svg class="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
      <input
          class="py-3 pl-10 pr-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-orange-500 focus:ring-orange-500 disabled:opacity-50 disabled:pointer-events-none"
          type="text" :placeholder="placeholder ?? 'Type a name'" @input="handleChange" />
    </div>
    <!-- End SearchBox -->
  </div>
</template>

<script setup lang="ts">
defineProps<{ placeholder: string }>()
const emit = defineEmits<{
  (e: 'search', value: string): void;
}>();

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('search', target.value);
}
</script>

<style scoped>
/* Add any additional styling here */
</style>