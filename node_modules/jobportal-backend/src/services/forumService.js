import { ForumPost } from '../models/ForumPost.js'
import { AppError } from '../utils/AppError.js'

export const createForumPost = (payload) => ForumPost.create(payload)

export const listForumPosts = async (filters = {}) => {
  const query = {}
  if (filters.category) query.category = filters.category
  return ForumPost.find(query).populate('author', 'name role').sort('-createdAt')
}

export const getForumPostById = async (id) => {
  const post = await ForumPost.findById(id).populate('author', 'name role').populate('comments.author', 'name role')
  if (!post) {
    throw new AppError('Entrada de foro no encontrada', 404)
  }
  return post
}

export const updateForumPostById = async (id, payload) => {
  const updated = await ForumPost.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  if (!updated) {
    throw new AppError('Entrada de foro no encontrada', 404)
  }
  return updated
}

export const deleteForumPostById = async (id) => {
  const deleted = await ForumPost.findByIdAndDelete(id)
  if (!deleted) {
    throw new AppError('Entrada de foro no encontrada', 404)
  }
  return deleted
}

export const addCommentToPost = async (postId, payload) => {
  const post = await ForumPost.findById(postId)
  if (!post) {
    throw new AppError('Entrada de foro no encontrada', 404)
  }
  post.comments.push(payload)
  await post.save()
  await post.populate('comments.author', 'name role')
  return post
}
