import { ObjectId } from 'mongodb'

interface FollowerType {
  _id?: ObjectId
  user_id: ObjectId
  follower_user_id: ObjectId
  created_at?: Date
}

export { FollowerType }
