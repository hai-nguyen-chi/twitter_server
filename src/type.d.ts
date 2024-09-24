import { Request } from 'express'
import { TokenPayload } from '~/constants/interfaces/refreshTokens.interfaces'

declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
