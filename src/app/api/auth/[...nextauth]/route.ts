import { handlers } from "@/lib/auth/next-auth"

export const runtime = 'nodejs'

export const GET = handlers.GET
export const POST = handlers.POST
