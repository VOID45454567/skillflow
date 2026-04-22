import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
    const mobileMenuOpen = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const sidebarCollapsed = ref<boolean>(false)
    const theme = ref<'light' | 'dark'>('light')

    const toggleMobileMenu = (): void => {
        mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = (): void => {
        mobileMenuOpen.value = false
    }

    const toggleSidebar = (): void => {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    const setLoading = (value: boolean): void => {
        isLoading.value = value
    }

    const toggleTheme = (): void => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', theme.value)
    }

    return {
        mobileMenuOpen,
        isLoading,
        sidebarCollapsed,
        theme,
        toggleMobileMenu,
        closeMobileMenu,
        toggleSidebar,
        setLoading,
        toggleTheme
    }
})