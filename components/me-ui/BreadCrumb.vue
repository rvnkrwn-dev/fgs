<template>
  <div class="bg-gray-100">
    <ol class="flex items-center whitespace-nowrap p-4 sm:px-6 lg:px-8 max-w-[85rem] mx-auto">
      <li
          v-for="(item, index) in items"
          :key="index"
          class="inline-flex items-center"
      >
        <template v-if="index !== items.length - 1">
          <NuxtLink
              :to="item?.href"
              class="flex items-center text-sm text-gray-500 hover:text-orange-400 focus:outline-hidden focus:text-orange-400"
          >
            {{ item.label }}
          </NuxtLink>
          <svg
              class="shrink-0 size-5 text-gray-400 mx-2"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
          >
            <path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"></path>
          </svg>
        </template>
        <template v-else>
        <span
            class="inline-flex items-center text-sm font-semibold text-gray-600 truncate"
            aria-current="page"
        >
          {{ item.label }}
        </span>
        </template>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  href?: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()
</script>