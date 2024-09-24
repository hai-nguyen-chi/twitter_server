import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import {
  LoginPayload,
  LogoutPayload,
  RefreshTokenPayload,
  RegisterPayload
} from '~/constants/interfaces/users.interfaces'
import { sha256 } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums/users.enums'
import { ErrorWithStatus } from '~/models/Error.schema'
import { HTTP_STATUS } from '~/constants/enums/httpStatus'
import { MESSAGES } from '~/constants/enums/messages'
import {
  RefreshTokenType,
  TokenPayload
} from '~/constants/interfaces/refreshTokens.interfaces'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { SignOptions } from 'jsonwebtoken'

class UserServices {
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async checkRefreshTokenExist(refresh_token: string) {
    const token_item = await databaseService.refreshTokens.findOne({
      token: refresh_token
    })
    return Boolean(token_item)
  }
  private async createRefreshToken({ token, user_id }: RefreshTokenType) {
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token,
        user_id
      })
    )
  }
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        algorithm: 'HS256',
        expiresIn: '15m'
      }
    })
  }
  private signRefreshToken({
    user_id,
    exp = undefined
  }: {
    user_id: string
    exp?: number
  }) {
    const payload = exp
      ? {
          user_id,
          exp,
          token_type: TokenType.RefreshToken
        }
      : {
          user_id,
          token_type: TokenType.RefreshToken
        }
    const options = exp
      ? undefined
      : ({
          algorithm: 'HS256',
          expiresIn: '30d'
        } as SignOptions)
    return signToken({
      payload,
      options
    })
  }
  private async signAccessTokenAndRefreshToken(user_id: string) {
    return await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken({ user_id })
    ])
  }
  async login(payload: LoginPayload) {
    const user = await databaseService.users.findOne({
      email: payload.email,
      password: sha256(payload.password)
    })
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.INVALID_EMAIL_OR_PASSWORD
      })
    }
    const user_id = user._id.toString()
    const [access_token, refresh_token] =
      await this.signAccessTokenAndRefreshToken(user_id)
    await this.createRefreshToken({ token: refresh_token, user_id: user_id })
    return { access_token, refresh_token }
  }
  async register(payload: RegisterPayload) {
    const user = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: sha256(payload.password)
      })
    )
    const user_id = user.insertedId.toString()
    const [access_token, refresh_token] =
      await this.signAccessTokenAndRefreshToken(user_id)
    await this.createRefreshToken({ token: refresh_token, user_id: user_id })
    return { access_token, refresh_token }
  }

  private async deleteRefreshToken(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({
      token: refresh_token
    })
  }

  async logout({ refresh_token }: LogoutPayload) {
    await this.deleteRefreshToken(refresh_token)
  }

  async refreshToken({
    user_id,
    exp,
    refresh_token
  }: {
    user_id: string
    exp?: number
    refresh_token: string
  }) {
    await this.deleteRefreshToken(refresh_token)
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken({
        user_id,
        exp
      })
    ])
    await this.createRefreshToken({
      token: new_refresh_token,
      user_id: user_id
    })
    return { new_access_token, new_refresh_token }
  }
}

const userServices = new UserServices()
export default userServices
