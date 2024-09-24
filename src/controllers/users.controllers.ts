import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HTTP_STATUS } from '~/constants/enums/httpStatus'
import { TokenPayload } from '~/constants/interfaces/refreshTokens.interfaces'
import {
  LoginPayload,
  LogoutPayload,
  RefreshTokenPayload,
  RegisterPayload
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

export {
  registerController,
  loginController,
  logoutController,
  refreshTokenController
}
