<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const params = useRoute().path
const pagesName = computed(() => params.replaceAll('/', ' ').trim().split(' ').slice(1))

</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator
              orientation="vertical"
              class="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <template v-for="(pageName, i) in pagesName">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbLink v-if="i !== pagesName.length-1" class="capitalize" :href="`/${pageName}`">
                  {{ pageName }}
                </BreadcrumbLink>
                <BreadcrumbItem v-else>
                  <BreadcrumbPage class="capitalize">{{ pageName }}</BreadcrumbPage>
                </BreadcrumbItem>
              </template>

            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main class="h-full w-full overflow-y-auto">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
