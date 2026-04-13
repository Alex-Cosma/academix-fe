import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        try {
          const res = await fetch(
            `${process.env.API_BASE_URL}/auth/oauth/${account.provider}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code: account.access_token || account.id_token,
                redirectUri:
                  process.env.NEXTAUTH_URL +
                  "/api/auth/callback/" +
                  account.provider,
              }),
            }
          )
          if (res.ok) {
            const data = await res.json()
            token.accessToken = data.accessToken
            token.refreshToken = data.refreshToken
            token.expiresAt =
              Math.floor(Date.now() / 1000) + data.expiresIn
            token.onboardingComplete =
              data.user?.onboardingComplete ?? false
          }
        } catch (error) {
          console.error("Backend auth failed:", error)
        }
      }

      if (
        token.expiresAt &&
        Date.now() / 1000 > (token.expiresAt as number) - 60
      ) {
        try {
          const res = await fetch(
            `${process.env.API_BASE_URL}/auth/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: token.refreshToken }),
            }
          )
          if (res.ok) {
            const data = await res.json()
            token.accessToken = data.accessToken
            token.expiresAt =
              Math.floor(Date.now() / 1000) + data.expiresIn
          }
        } catch {
          token.error = "RefreshTokenExpired"
        }
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      if (token.onboardingComplete !== undefined) {
        session.user.onboardingComplete = token.onboardingComplete as boolean
      }
      if (token.error) {
        session.error = token.error as string
      }
      return session
    },
  },
})
