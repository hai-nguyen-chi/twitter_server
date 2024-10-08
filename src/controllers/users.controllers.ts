import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HTTP_STATUS } from '~/constants/enums/httpStatus'
import { MESSAGES } from '~/constants/enums/messages'
import { TokenPayload } from '~/constants/interfaces/refreshTokens.interfaces'
import {
  ChangePasswordPayload,
  FollowerPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LogoutPayload,
  RefreshTokenPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload
} from '~/constants/interfaces/users.interfaces'
import userServices from '~/services/users.services'

const registerController = async (
  req: Request<ParamsDictionary, any, RegisterPayload>,
  res: Response
) => {
  const result = await userServices.register(req.body)
  res.status(HTTP_STATUS.CREATED).json(result)
}

const loginController = async (
  req: Request<ParamsDictionary, any, LoginPayload>,
  res: Response
) => {
  const result = await userServices.login(req.body)
  res.status(HTTP_STATUS.OK).json(result)
}

const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutPayload>,
  res: Response
) => {
  await userServices.logout(req.body)
  res.status(HTTP_STATUS.NO_CONTENT).json()
}

const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenPayload>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { user_id, exp } = req.decoded_refresh_token as TokenPayload
  const result = await userServices.refreshToken({
    user_id,
    exp,
    refresh_token
  })
  res.status(HTTP_STATUS.OK).json(result)
}

const verifyEmailTokenController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const result = await userServices.verifyEmail(user_id)
  res.status(HTTP_STATUS.OK).json(result)
}

const resendVerifyEmailTokenController = async (
  req: Request,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await userServices.resendVerifyEmail(user_id)
  res.status(HTTP_STATUS.NOT_FOUND).json()
}

const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordPayload>,
  res: Response
) => {
  const { email } = req.body
  await userServices.forgotPassword(email)
  res.status(HTTP_STATUS.NOT_FOUND).json()
}

const verifyForgotPasswordController = async (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.VERIFIED_SUCCESS })
}

const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordPayload>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await userServices.resetPassword(user_id, password)
  res.status(HTTP_STATUS.OK).json(result)
}

const profileController = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const result = await userServices.getProfile(user_id)
  res.status(HTTP_STATUS.OK).json(result)
}

const updateProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfilePayload>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await userServices.updateProfile(user_id, req.body)
  res.status(HTTP_STATUS.NO_CONTENT).json()
}

const followerController = async (
  req: Request<ParamsDictionary, any, FollowerPayload>,
  res: Response
) => {
  const { follower_user_id } = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  await userServices.follow(user_id, follower_user_id)
  res.status(HTTP_STATUS.NO_CONTENT).json()
}

const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordPayload>,
  res: Response
) => {
  const { email, password } = req.body
  await userServices.changePassword({
    email,
    password
  })
  res.status(HTTP_STATUS.NO_CONTENT).json()
}

export {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  verifyEmailTokenController,
  resendVerifyEmailTokenController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  profileController,
  updateProfileController,
  followerController,
  changePasswordController
}
