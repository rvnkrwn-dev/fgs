<script setup lang="ts">
import type {SidebarProps} from '@/components/ui/sidebar'

import {
  Calendar,
  Settings,
  Users,
  Home,
  Activity
} from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// Get auth data
const { getUserAuth, logout } = useAuth()
const userAuth = computed(() => getUserAuth())

// Create user data object from auth
const userData = computed(() => {
  const user = userAuth.value
  console.log(user)
  if (!user) {
    return {
      name: 'Loading...',
      email: 'loading@example.com',
      avatar: '/avatars/default.png',
    }
  }

  return {
    name: user.name,
    email: user.email,
    avatar: `/avatars/default.png`,
    role: user.role === 'ADMIN' ? 'Administrator' : 'User',
  }
})

// Enhanced navigation with proper permissions
const navMain = computed(() => {
  const user = userAuth.value
  const baseNavigation = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
        },
      ],
    },
    {
      title: 'Event Festival',
      url: '/dashboard/events',
      icon: Calendar,
      items: [
        {
          title: 'Semua Event',
          url: '/dashboard/events',
        },
        {
          title: 'Buat Event Baru',
          url: '/dashboard/events/create',
        },
      ],
    },
    {
      title: 'Registrasi',
      url: '/dashboard/registrations',
      icon: Users,
      items: [
        {
          title: 'Semua Registrasi',
          url: '/dashboard/registrations',
        },
      ],
    },
  ]

  // Add admin-only navigation items
  if (user?.role === 'ADMIN') {
    baseNavigation.push({
      title: 'Pengaturan',
      url: '/dashboard/settings',
      icon: Settings,
      items: [
        {
          title: 'Pengaturan Sistem',
          url: '/dashboard/settings',
        },
        {
          title: 'Manajemen User',
          url: '/dashboard/users',
        },
      ],
    })
  }

  return baseNavigation
})

// Handle logout
const handleLogout = async () => {
  try {
    await logout()
    // Navigation will be handled by the logout function
    navigateTo('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <NuxtLink to="/dashboard">
              <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-blue-600 text-white shadow-lg">
                <Activity class="size-4"/>
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold bg-gradient-to-r from-green-700 to-blue-600 bg-clip-text text-transparent">
                  Festival Gunung Selamet
                </span>
                <span class="text-xs text-muted-foreground">Event Management System</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMain"/>
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" :actions="{
        onLogoutClick: async () => await handleLogout()
      }"/>
    </SidebarFooter>
    <SidebarRail/>
  </Sidebar>
</template>