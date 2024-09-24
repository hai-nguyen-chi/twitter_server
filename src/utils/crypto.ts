import { createHash } from 'crypto'
import { config } from 'dotenv'
config()

function sha256(content: string) {
  return createHash('sha256')
    .update(content + process.env.HASH_KEY)
    .digest('hex')
}

export { sha256 }
