import mongoose, { Document, Schema } from 'mongoose'
import { nanoid } from 'nanoid'

export interface ILocation {
  latitude: number
  longitude: number
}

export interface ITodo extends Document {
  id: string
  userId: string
  title: string
  completed: boolean
  location?: ILocation
  photoUri?: string
  createdAt: Date
  updatedAt: Date
}

const locationSchema = new Schema<ILocation>(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
)

const todoSchema = new Schema<ITodo>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => nanoid(),
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    location: {
      type: locationSchema,
      required: false,
    },
    photoUri: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

// Crear índices
todoSchema.index({ userId: 1, createdAt: -1 })
todoSchema.index({ userId: 1, completed: 1 })

export const TodoModel = mongoose.model<ITodo>('Todo', todoSchema)
