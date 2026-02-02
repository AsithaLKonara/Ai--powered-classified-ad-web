/**
 * Responsive breakpoints
 */
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoints.md
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= breakpoints.lg
}

/**
 * Check if device has touch support
 */
export function isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Get responsive image size
 */
export function getResponsiveImageSize(): { width: number; height: number } {
    if (typeof window === 'undefined') {
        return { width: 800, height: 600 }
    }

    const width = window.innerWidth

    if (width < breakpoints.sm) {
        return { width: 400, height: 300 }
    } else if (width < breakpoints.md) {
        return { width: 600, height: 450 }
    } else if (width < breakpoints.lg) {
        return { width: 800, height: 600 }
    } else {
        return { width: 1200, height: 900 }
    }
}

/**
 * Format number for mobile display (compact)
 */
export function formatNumberCompact(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
}

/**
 * Truncate text for mobile
 */
export function truncateForMobile(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * Debounce function for touch events
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

/**
 * Prevent body scroll (for modals on mobile)
 */
export function preventBodyScroll(prevent: boolean): void {
    if (typeof document === 'undefined') return

    if (prevent) {
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
    } else {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
    }
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId)
    if (!element) return

    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
}

/**
 * Copy to clipboard (mobile-friendly)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            try {
                document.execCommand('copy')
                textArea.remove()
                return true
            } catch (error) {
                textArea.remove()
                return false
            }
        }
    } catch (error) {
        return false
    }
}

/**
 * Vibrate device (if supported)
 */
export function vibrate(pattern: number | number[] = 100): void {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern)
    }
}
