import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailTokenController,
  resetPasswordController,
  verifyEmailTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/handlers'

const usersRoute = Router()

usersRoute.post('/register', registerValidator, wrapHandler(registerController))
usersRoute.post('/login', loginValidator, wrapHandler(loginController))
usersRoute.post(
  '/logout',
  accessTokenValidator,
  refreshTokenValidator,
  wrapHandler(logoutController)
)
usersRoute.post(
  '/refresh_token',
  refreshTokenValidator,
  wrapHandler(refreshTokenController)
)
usersRoute.post(
  '/verify_email',
  verifyEmailTokenValidator,
  wrapHandler(verifyEmailTokenController)
)
usersRoute.post(
  '/resend_verify_email',
  accessTokenValidator,
  wrapHandler(resendVerifyEmailTokenController)
)
usersRoute.post(
  '/forgot_password',
  forgotPasswordValidator,
  wrapHandler(forgotPasswordController)
)
usersRoute.post(
  '/verify_forgot_password',
  verifyForgotPasswordValidator,
  wrapHandler(verifyEmailTokenController)
)
usersRoute.post(
  '/reset_password',
  resetPasswordValidator,
  wrapHandler(resetPasswordController)
)
export default usersRoute
