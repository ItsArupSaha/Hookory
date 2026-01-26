"use client"

/**
 * Shared Cooldown Hook
 * Uses localStorage to sync cooldown state across Single Post and Series generators.
 * Stores the cooldown END timestamp, not a countdown value.
 */

import { useState, useEffect, useCallback } from "react"

const COOLDOWN_KEY = "hookory_cooldown_end"

export function useSharedCooldown() {
    const [cooldown, setCooldown] = useState(0)

    // Get remaining seconds from localStorage
    const getRemainingSeconds = useCallback((): number => {
        if (typeof window === "undefined") return 0
        const endTime = localStorage.getItem(COOLDOWN_KEY)
        if (!endTime) return 0
        const remaining = Math.ceil((parseInt(endTime, 10) - Date.now()) / 1000)
        return remaining > 0 ? remaining : 0
    }, [])

    // Start a new cooldown
    const startCooldown = useCallback((seconds: number) => {
        if (typeof window === "undefined") return
        const endTime = Date.now() + seconds * 1000
        localStorage.setItem(COOLDOWN_KEY, endTime.toString())
        setCooldown(seconds)
    }, [])

    // Clear cooldown (for testing or admin reset)
    const clearCooldown = useCallback(() => {
        if (typeof window === "undefined") return
        localStorage.removeItem(COOLDOWN_KEY)
        setCooldown(0)
    }, [])

    // Initialize and tick down
    useEffect(() => {
        // Initial load
        setCooldown(getRemainingSeconds())

        // Tick every second
        const interval = setInterval(() => {
            const remaining = getRemainingSeconds()
            setCooldown(remaining)

            // Auto-clear expired
            if (remaining <= 0) {
                localStorage.removeItem(COOLDOWN_KEY)
            }
        }, 1000)

        // Listen for storage changes from other tabs/pages
        const handleStorage = (e: StorageEvent) => {
            if (e.key === COOLDOWN_KEY) {
                setCooldown(getRemainingSeconds())
            }
        }
        window.addEventListener("storage", handleStorage)

        return () => {
            clearInterval(interval)
            window.removeEventListener("storage", handleStorage)
        }
    }, [getRemainingSeconds])

    return {
        cooldown,
        startCooldown,
        clearCooldown,
        isOnCooldown: cooldown > 0
    }
}
