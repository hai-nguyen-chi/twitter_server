import { ObjectId } from 'mongodb'
import { FollowerType } from '~/constants/interfaces/followers.interfaces'

class Follower {
  _id: ObjectId
  user_id: ObjectId
  follower_user_id: ObjectId
  created_at: Date

  constructor({ _id, user_id, follower_user_id, created_at }: FollowerType) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.follower_user_id = follower_user_id
    this.created_at = created_at || new Date()
  }
}

export default Follower
