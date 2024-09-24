import { ObjectId } from 'mongodb'
import { TokenType } from '../enums/users.enums'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: string
}

interface TokenPayload {
  user_id: string
  token_type: TokenType
  iat: number
  exp: number
}

export { RefreshTokenType, TokenPayload }
