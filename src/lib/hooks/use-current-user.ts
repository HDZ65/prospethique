"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function useCurrentUser() {
    const { data: session, status, update } = useSession()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status !== 'loading') {
            setIsLoading(false)
        }
    }, [status])

    return {
        user: session?.user,
        isAuthenticated: status === 'authenticated',
        isLoading,
        updateSession: update,
    }
}