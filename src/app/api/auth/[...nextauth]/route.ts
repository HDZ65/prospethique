import NextAuth from 'next-auth';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { JWT } from "next-auth/jwt";
import { Account } from "next-auth";
import { Session } from "next-auth";
export const authOptions = {
providers: [
  LinkedInProvider({
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    authorization: {
      params: {
        scope: 'openid profile email w_member_social',
      },
    },
  }),
],
callbacks: {
  async jwt({ token, account }: { token: JWT; account: Account | null }) {
    if (account) {
      token.accessToken = account.access_token;
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: JWT }) {
    session.accessToken = token.accessToken;
    return session;
  },
},
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };