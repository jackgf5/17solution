import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { signJwtAccessToken } from "@/lib/jwt"
import prisma from "@/lib/prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please Fill All Fields")
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        })

        if (!user || !user?.hashedPassword) {
          throw new Error("User Not Found")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid Password")
        }

        const { hashedPassword, ...userWithoutPassword } = user

        const accessToken = signJwtAccessToken(userWithoutPassword)
        const result = {
          ...userWithoutPassword,
          accessToken,
        }

        return result
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.username = user.username
        token.accessToken = user.accessToken
      }

      return token
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role
        session.user.id = token.id
        session.user.username = token.username
        session.user.accessToken = token.accessToken
      }

      return session
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
