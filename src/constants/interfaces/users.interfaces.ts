import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums/users.enums'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: string
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  bio?: string
  location?: string
  website?: string
  user_name?: string
  avatar?: string
  cover_photo?: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

interface LoginPayload {
  email: string
  password: string
}

interface LogoutPayload {
  refresh_token: string
}

interface RefreshTokenPayload extends LogoutPayload {}

export {
  UserType,
  RegisterPayload,
  LoginPayload,
  LogoutPayload,
  RefreshTokenPayload
}
