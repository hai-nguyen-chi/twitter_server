import { check, checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/enums/httpStatus'
import { MESSAGES } from '~/constants/enums/messages'
import { ErrorWithStatus } from '~/models/Error.schema'
import userServices from '~/services/users.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

const registerValidator = validate(
  checkSchema(
    {
      name: {
        trim: true,
        isString: true,
        isLength: {
          options: {
            min: 1,
            max: 255
          }
        },
        notEmpty: {
          errorMessage: MESSAGES.PLEASE_ENTER_NAME
        }
      },
      email: {
        notEmpty: {
          errorMessage: MESSAGES.PLEASE_ENTER_EMAIL
        },
        isEmail: true,
        custom: {
          options: async (value) => {
            const user = await userServices.checkEmailExist(value)
            if (user) {
              throw new ErrorWithStatus({
                message: MESSAGES.EMAIL_ALREADY_EXIST,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: MESSAGES.PLEASE_ENTER_PASSWORD
        },
        isString: true,
        isStrongPassword: {
          options: {
            returnScore: true
          }
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: MESSAGES.PLEASE_ENTER_CONFIRM_PASSWORD
        },
        isString: true,
        isStrongPassword: {
          options: {
            returnScore: true
          }
        },
        custom: {
          options: (value, { req }) => value === req.body.password,
          errorMessage: MESSAGES.PASSWORD_DO_NOT_MATCH
        }
      },
      date_of_birth: {
        isString: true,
        notEmpty: {
          errorMessage: MESSAGES.PLEASE_ENTER_DATE_OF_BIRTH
        }
      }
    },
    ['body']
  )
)

const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: MESSAGES.PLEASE_ENTER_EMAIL
        },
        isEmail: true
      },
      password: {
        notEmpty: {
          errorMessage: MESSAGES.PLEASE_ENTER_PASSWORD
        }
      }
    },
    ['body']
  )
)

const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const token = value.split(' ')[1]
            if (!token) {
              throw new ErrorWithStatus({
                message: MESSAGES.INVALID_ACCESS_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const decoded_authorization = await verifyToken({ token })
            req.decoded_authorization = decoded_authorization
          }
        }
      }
    },
    ['headers']
  )
)

const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: MESSAGES.INVALID_REFRESH_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              await verifyToken({ token: value }),
              await userServices.checkRefreshTokenExist(value)
            ])
            if (!refresh_token) {
              throw new ErrorWithStatus({
                message: MESSAGES.INVALID_REFRESH_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.decoded_refresh_token = decoded_refresh_token
          }
        }
      }
    },
    ['body']
  )
)

export {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator
}
