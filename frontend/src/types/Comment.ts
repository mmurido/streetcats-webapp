import type { User } from './User'

export interface Comment {
  id: number
  user: User
  post: number
  text: string
  is_liked: boolean
  heart_count: number
  created_at: string
}
