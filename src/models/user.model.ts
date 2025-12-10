import mongoose, { Document, Schema } from 'mongoose'
import { nanoid } from 'nanoid'

export interface IUser extends Document {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => nanoid(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const UserModel = mongoose.model<IUser>('User', userSchema)
