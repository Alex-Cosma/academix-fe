import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string
    error?: string
    user: {
      id: string
      name: string
      email: string
      image?: string
      onboardingComplete: boolean
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    expiresAt: number
    onboardingComplete: boolean
    error?: string
  }
}
