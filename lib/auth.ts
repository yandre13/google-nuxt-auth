import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from './db'
// import { getServerSession } from '#auth'
import { nanoid } from 'nanoid'

const runtimeConfig = useRuntimeConfig()
// console.log('authOptions', process.env.NODE_ENV)

export const authOptions: NextAuthOptions = {
  secret: runtimeConfig.NUXT_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: runtimeConfig.public.GOOGLE_CLIENT_ID,
      clientSecret: runtimeConfig.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }

      return session
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        token.id = user!.id
        return token
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        })
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      }
    },
    redirect() {
      return '/'
    },
  },
}
// export const getAuthSession = () => getServerSession(authOptions)
