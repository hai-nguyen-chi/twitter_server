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

interface ForgotPasswordPayload {
  email: string
}

interface ResetPasswordPayload {
  forgot_password_token: string
  password: string
  confirm_password: string
}

interface ChangePasswordPayload {
  email: string
  old_password?: string
  password: string
  confirm_password?: string
}

interface UpdateProfilePayload {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  user_name?: string
  avatar?: string
  cover_photo?: string
}

interface FollowerPayload {
  follower_user_id: string
}

export {
  UserType,
  RegisterPayload,
  LoginPayload,
  LogoutPayload,
  RefreshTokenPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
  UpdateProfilePayload,
  FollowerPayload
}
