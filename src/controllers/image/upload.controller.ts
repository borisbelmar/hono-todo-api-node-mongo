import { Context } from 'hono'
import { nanoid } from 'nanoid'
import { uploadToR2, buildImageKey } from '../../utils/r2'
import { logger } from '../../lib/logger'

type Variables = {
  userId: string
}

export const uploadImageController = async (c: Context<{ Variables: Variables }>) => {
  try {
    const formData = await c.req.formData()
    const image = formData.get('image') as File | null

    if (!image || !(image instanceof File)) {
      return c.json({
        success: false,
        error: 'Se requiere una imagen',
      }, 400)
    }

    // Validar que sea una imagen
    if (!image.type.startsWith('image/')) {
      return c.json({
        success: false,
        error: 'El archivo debe ser una imagen',
      }, 400)
    }

    // Validar tamaño máximo (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB en bytes
    if (image.size > maxSize) {
      return c.json({
        success: false,
        error: 'La imagen no puede pesar más de 5MB',
      }, 400)
    }

    const userId = c.get('userId')

    // Generar nombre único para la imagen
    const extension = image.name.split('.').pop()
    const imageId = `${nanoid()}.${extension}`
    const imageKey = buildImageKey(userId, imageId)

    // Convertir File a Buffer
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a R2
    const imageUrl = await uploadToR2(imageKey, buffer, image.type)

    return c.json({
      success: true,
      data: {
        url: imageUrl,
        key: imageKey,
        size: image.size,
        contentType: image.type,
      },
    }, 201)
  } catch (error) {
    logger.error('Error uploading image:', error)
    return c.json({
      success: false,
      error: 'Error al subir la imagen',
    }, 500)
  }
}
