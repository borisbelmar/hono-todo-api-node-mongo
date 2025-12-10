import { Context } from 'hono'
import { deleteFromR2, existsInR2, buildImageKey } from '../../utils/r2'
import { logger } from '../../lib/logger'

type Variables = {
  userId: string
}

export const deleteImageController = async (c: Context<{ Variables: Variables }>) => {
  try {
    const userId = c.req.param('userId')
    const imageId = c.req.param('imageId')
    const currentUserId = c.get('userId')

    // Verificar que el usuario sea dueño de la imagen
    if (userId !== currentUserId) {
      return c.json({
        success: false,
        error: 'No tienes permisos para eliminar esta imagen',
      }, 403)
    }

    const imageKey = buildImageKey(userId, imageId)

    // Verificar que la imagen existe
    const exists = await existsInR2(imageKey)
    if (!exists) {
      return c.json({
        success: false,
        error: 'Imagen no encontrada',
      }, 404)
    }

    // Eliminar de R2
    await deleteFromR2(imageKey)

    return c.json({
      success: true,
      data: {
        message: 'Imagen eliminada exitosamente',
      },
    })
  } catch (error) {
    logger.error('Error deleting image:', error)
    return c.json({
      success: false,
      error: 'Error al eliminar la imagen',
    }, 500)
  }
}
