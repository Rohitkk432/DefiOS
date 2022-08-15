/* eslint-disable no-param-reassign */
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          // I wish to request additional permission scopes.
          scope: 'repo read:user user:email',
        }
      } 
    }
  ),
    // ...add more providers here
  ],
  
  // callbacks: {
  //   async session({ session, token, }) {
  //     // Send properties to the client, like an access_token from a provider.
  //     session.accessToken = token.accessToken
  //     return session
  //   },
  // }
  
})
