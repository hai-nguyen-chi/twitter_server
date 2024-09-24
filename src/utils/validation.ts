import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/enums/httpStatus'
import { ErrorWithStatus, ErrorEntity } from '~/models/Error.schema'
import lodash from 'lodash'

const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObj = errors.mapped()
    for (const key in errorsObj) {
      const { msg } = errorsObj[key]
      if (
        msg instanceof ErrorWithStatus &&
        msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY
      ) {
        next(msg)
      }
    }
    next(
      lodash
        .values(errorsObj)
        .map(
          (item: any) => new ErrorEntity({ key: item.path, message: item.msg })
        )
    )
  }
}

export { validate }
