class ErrorWithStatus {
  message: string
  status: number

  constructor({ message, status }: ErrorWithStatus) {
    this.message = message
    this.status = status
  }
}

class ErrorEntity {
  key: string
  message: string

  constructor({ key, message }: ErrorEntity) {
    this.key = key
    this.message = message
  }
}

export { ErrorEntity, ErrorWithStatus }
