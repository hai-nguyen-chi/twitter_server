import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
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

export default usersRoute
