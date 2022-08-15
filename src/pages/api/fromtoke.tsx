

import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET
// @ts-ignore
export default async function handler (req, res) {
  const token = await getToken({ req, secret })
    // eslint-disable-next-line no-console
    console.log("JSON Web Token", token)
    console.log(token?.sub)
    res.end()
}
