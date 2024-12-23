import type { NextAuthConfig } from "next-auth";

import LinkedIn from "next-auth/providers/linkedin"
export const authConfig = {
    providers: [LinkedIn],
} satisfies NextAuthConfig