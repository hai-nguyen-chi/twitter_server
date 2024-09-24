import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
config()

const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET_KEY as string,
  options = { algorithm: 'HS256' }
}: {
  payload: Object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, function (err, token) {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  })
}

const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET_KEY as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, function (err, decoded) {
      if (err) {
        throw reject(err)
      }
      resolve(decoded as Object)
    })
  })
}

export { signToken, verifyToken }
