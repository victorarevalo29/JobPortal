import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

const commentSchema = new Schema({
  author: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false })

// Community threads with lightweight comment threads.
const forumPostSchema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 180
  },
  content: {
    type: String,
    required: true,
    minlength: 30
  },
  author: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: [commentSchema],
    default: []
  }
}, {
  timestamps: true
})

forumPostSchema.index({ category: 1, createdAt: -1 })
forumPostSchema.index({ title: 'text', content: 'text' })

export const ForumPost = model('ForumPost', forumPostSchema)
