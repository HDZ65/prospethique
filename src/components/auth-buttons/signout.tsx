"use client"
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm font-medium"
            aria-label="Se déconnecter"
        >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
        </button>
    )
}