<script setup lang="ts">
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
} from 'lucide-vue-next'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

// Define interface untuk actions
interface UserActions {
  onAccountClick?: () => void
  onNotificationsClick?: () => void
  onLogoutClick?: () => void
}

const props = defineProps<{
  user: {
    name: string
    email: string
    avatar: string
  }
  actions?: UserActions
}>()

const { isMobile } = useSidebar()

// State for logout confirmation dialog
const showLogoutDialog = ref(false)

// Handler functions
const handleAccountClick = () => {
  if (props.actions?.onAccountClick) {
    props.actions.onAccountClick()
  }
}

const handleNotificationsClick = () => {
  if (props.actions?.onNotificationsClick) {
    props.actions.onNotificationsClick()
  }
}

const handleLogoutClick = () => {
  showLogoutDialog.value = true
}

const confirmLogout = () => {
  if (props.actions?.onLogoutClick) {
    props.actions.onLogoutClick()
  }
  showLogoutDialog.value = false
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg">
                CN
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            align="end"
            :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg">
                  CN
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="handleAccountClick">
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleNotificationsClick">
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogoutClick">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <!-- Logout Confirmation Dialog -->
  <AlertDialog v-model:open="showLogoutDialog">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
        <AlertDialogDescription>
          Apakah Anda yakin ingin keluar dari akun Anda? Anda akan diarahkan ke halaman login.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction @click="confirmLogout">
          Ya, Keluar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>