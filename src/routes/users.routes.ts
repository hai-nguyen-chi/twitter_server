import { Router } from 'express'
import {
  changePasswordController,
  followerController,
  forgotPasswordController,
  loginController,
  logoutController,
  profileController,
  refreshTokenController,
  registerController,
  resendVerifyEmailTokenController,
  resetPasswordController,
  updateProfileController,
  verifyEmailTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  changePasswordValidator,
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

/*
  Description: Register a user
  Method: POST
  Payload: {
    name: string
    email: string
    password: string
    confirm_password: string
    date_of_birth: string
  }
*/
usersRoute.post('/register', registerValidator, wrapHandler(registerController))

/*
  Description: Login a user
  Method: POST
  Payload: {
    email: string
    password: string
  }
*/
usersRoute.post('/login', loginValidator, wrapHandler(loginController))

/*
  Description: Logout a user
  Method: POST
  Payload: {
    refresh_token: string
  }
*/
usersRoute.post(
  '/logout',
  accessTokenValidator,
  refreshTokenValidator,
  wrapHandler(logoutController)
)

/*
  Description: Refresh token for user
  Method: POST
  Payload: {
    refresh_token: string
  }
*/
usersRoute.post(
  '/refresh_token',
  refreshTokenValidator,
  wrapHandler(refreshTokenController)
)

/*
  Description: Verify email for user
  Method: POST
  Payload: {
    email_verify_token: string
  }
*/
usersRoute.post(
  '/verify_email',
  verifyEmailTokenValidator,
  wrapHandler(verifyEmailTokenController)
)

/*
  Description: Resend verify email for user
  Method: POST
  Payload: {}
*/
usersRoute.post(
  '/resend_verify_email',
  accessTokenValidator,
  wrapHandler(resendVerifyEmailTokenController)
)

/*
  Description: Forgot password
  Method: POST
  Payload: {
    email: string
  }
*/
usersRoute.post(
  '/forgot_password',
  forgotPasswordValidator,
  wrapHandler(forgotPasswordController)
)

/*
  Description: Verify forgot password
  Method: POST
  Payload: {
    forgot_password_token: string
  }
*/
usersRoute.post(
  '/verify_forgot_password',
  verifyForgotPasswordValidator,
  wrapHandler(verifyEmailTokenController)
)

/*
  Description: Reset password
  Method: POST
  Payload: {
    forgot_password_token: string
    password: string
    confirm_password: string
  }
*/
usersRoute.post(
  '/reset_password',
  resetPasswordValidator,
  wrapHandler(resetPasswordController)
)

/*
  Description: Get profile
  Method: GET
  Payload: {}
*/
usersRoute.get(
  '/profile/:user_id',
  accessTokenValidator,
  wrapHandler(profileController)
)

/*
  Description: Update profile
  Method: PATCH
  Payload: {
    name?: string
    date_of_birth?: string
    bio?: string
    location?: string
    website?: string
    user_name?: string
    avatar?: string
    cover_photo?: string
  }
  Improve: check permission
*/
usersRoute.patch(
  '/profile/:user_id',
  accessTokenValidator,
  wrapHandler(updateProfileController)
)

/*
  Description: Update follower
  Method: PUT
  Payload: {
    follower_user_id: string
  }
*/
usersRoute.put(
  '/follower',
  accessTokenValidator,
  wrapHandler(followerController)
)

/*
  Description: Update follower
  Method: PUT
  Payload: {
    email: string
    old_password: string
    password: string
    confirm_password: string
  }
*/
usersRoute.post(
  '/change_password',
  changePasswordValidator,
  wrapHandler(changePasswordController)
)
export default usersRoute
