import type { User } from './User'
import type { Location } from './Location'
import type { Comment } from './Comment'

export interface Post {
  id: number
  user: User
  location: Location
  title: string
  description: string
  created_at: string
  view_count: number
  heart_count: number
  comment_count: number
  is_liked: boolean
  image_urls: string[]
  comments?: Comment[]
}
