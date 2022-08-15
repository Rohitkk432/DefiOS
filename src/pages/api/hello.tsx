import { getSession } from "next-auth/react"


// @ts-ignore
export default async function handler (req, res) {
  const session = await getSession({req})
  if(session) {
  res.status(200).json({ name : 'Abhi'})
  } else {
  res.status(401).json({ name : 'Permission Denied'})
  }
}
