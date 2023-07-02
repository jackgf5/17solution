import { Role } from "@prisma/client"
import { DefaultSession, DefaultUser } from "next-auth"

interface IUser extends DefaultUser {
  role?: Role
  username: string
  accessToken: string
  expoToken: string | null
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
