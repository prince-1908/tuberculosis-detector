import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabaseClient"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string, password: string };

        const { data, error } = await supabase.from('user').select("*");

        if (error || !data) return null;

        const user = data.find(user => user.email === email && user.password === password);

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET!,
})

export { handler as GET, handler as POST }
