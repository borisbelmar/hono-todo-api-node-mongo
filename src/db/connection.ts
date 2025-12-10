import mongoose from 'mongoose'
import { config } from '../config'
import { logger } from '../lib/logger'

let isConnected = false

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(config.mongodb.uri)
    isConnected = true
    logger.info('✅ Connected to MongoDB')
  } catch (error) {
    logger.error('❌ Error connecting to MongoDB:', error)
    throw error
  }
}

export const disconnectFromDatabase = async (): Promise<void> => {
  if (!isConnected) {
    return
  }

  try {
    await mongoose.disconnect()
    isConnected = false
    logger.info('✅ Disconnected from MongoDB')
  } catch (error) {
    logger.error('❌ Error disconnecting from MongoDB:', error)
    throw error
  }
}
