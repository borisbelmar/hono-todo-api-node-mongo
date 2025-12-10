import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { type Readable } from 'stream'
import { r2Client } from '../lib/r2'
import { config } from '../config'
import { logger } from '../lib/logger'

/**
 * Sube un archivo a R2
 */
export const uploadToR2 = async (
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    })

    await r2Client.send(command)

    // Retornar la URL pública si está configurada
    const publicUrl = config.r2.publicUrl
      ? `${config.r2.publicUrl}/${key}`
      : key

    logger.info(`File uploaded to R2: ${key}`)
    return publicUrl
  } catch (error) {
    logger.error('Error uploading to R2:', error)
    throw error
  }
}

/**
 * Obtiene un archivo de R2
 */
export const getFromR2 = async (key: string): Promise<{ body: Readable | ReadableStream | Blob; contentType?: string }> => {
  try {
    const command = new GetObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
    })

    const response = await r2Client.send(command)

    if (!response.Body) {
      throw new Error('No body in R2 response')
    }

    return {
      body: response.Body,
      contentType: response.ContentType,
    }
  } catch (error) {
    logger.error('Error getting from R2:', error)
    throw error
  }
}

/**
 * Elimina un archivo de R2
 */
export const deleteFromR2 = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
    })

    await r2Client.send(command)
    logger.info(`File deleted from R2: ${key}`)
  } catch (error) {
    logger.error('Error deleting from R2:', error)
    throw error
  }
}

/**
 * Verifica si un archivo existe en R2
 */
export const existsInR2 = async (key: string): Promise<boolean> => {
  try {
    const command = new HeadObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
    })

    await r2Client.send(command)
    return true
  } catch (error: unknown) {
    const err = error as { name?: string; $metadata?: { httpStatusCode?: number } }
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return false
    }
    logger.error('Error checking R2 existence:', error)
    throw error
  }
}

/**
 * Construye la key de R2 para una imagen
 */
export const buildImageKey = (userId: string, imageId: string): string => {
  return `${userId}/${imageId}`
}

/**
 * Extrae el key de R2 desde una URL de imagen
 */
export const extractImageKeyFromUrl = (url: string | undefined): string | null => {
  if (!url) return null

  // Si es una URL completa, extraer solo el path
  try {
    const urlObj = new URL(url)
    // Remover el slash inicial si existe
    return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname
  } catch {
    // Si no es una URL válida, asumir que es el key directamente
    return url
  }
}
