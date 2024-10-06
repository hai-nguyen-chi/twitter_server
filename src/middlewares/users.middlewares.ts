import { config } from 'dotenv'
import { checkSchema, ParamSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/enums/httpStatus'
import { MESSAGES } from '~/constants/enums/messages'
import { UserVerifyStatus } from '~/constants/enums/users.enums'
import { ErrorWithStatus } from '~/models/Error.schema'
import databaseService from '~/services/database.services'
import userServices from '~/services/users.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

config()

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
            const decoded_authorization = await verifyToken({
              token,
              secretOrPublicKey: process.env
                .JWT_ACCESS_TOKEN_SECRET_KEY as string
            })
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
              await verifyToken({
                token: value,
                secretOrPublicKey: process.env
                  .JWT_REFRESH_TOKEN_SECRET_KEY as string
              }),
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

const verifyEmailTokenValidator = validate(
  checkSchema({
    email_verify_token: {
      custom: {
        options: async (value: string, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: MESSAGES.INVALID_EMAIL_VERIFY_TOKEN,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          const [decoded_email_verify_token, user] = await Promise.all([
            await verifyToken({
              token: value,
              secretOrPublicKey: process.env
                .JWT_VERIFY_EMAIL_TOKEN_SECRET_KEY as string
            }),
            await userServices.checkVerifyEmailTokenExist(value)
          ])
          if (!user) {
            throw new ErrorWithStatus({
              message: MESSAGES.INVALID_EMAIL_VERIFY_TOKEN,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          if (user.verify === UserVerifyStatus.Verified) {
            throw new ErrorWithStatus({
              message: MESSAGES.EMAIL_ALREADY_VERIFIED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          req.decoded_email_verify_token = decoded_email_verify_token
        }
      }
    }
  })
)

const forgotPasswordValidator = validate(
  checkSchema({
    email: {
      custom: {
        options: async (value: string) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: MESSAGES.PLEASE_ENTER_EMAIL,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          const user = await userServices.checkEmailExist(value)
          if (!user) {
            throw new ErrorWithStatus({
              message: MESSAGES.EMAIL_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
        }
      }
    }
  })
)

const forgot_password_token: ParamSchema = {
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      const [decoded_forgot_password_token, user] = await Promise.all([
        await verifyToken({
          token: value,
          secretOrPublicKey: process.env
            .JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY as string
        }),
        await userServices.checkForgotPasswordTokenExist(value)
      ])
      if (!user) {
        throw new ErrorWithStatus({
          message: MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      req.decoded_forgot_password_token = decoded_forgot_password_token
    }
  }
}

const verifyForgotPasswordValidator = validate(
  checkSchema({
    forgot_password_token
  })
)

const resetPasswordValidator = validate(
  checkSchema({
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
    forgot_password_token
  })
)

export {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  verifyEmailTokenValidator,
  forgotPasswordValidator,
  verifyForgotPasswordValidator,
  resetPasswordValidator
}
