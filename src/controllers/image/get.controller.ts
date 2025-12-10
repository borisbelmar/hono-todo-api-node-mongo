import { Context } from 'hono'
import { getFromR2, buildImageKey } from '../../utils/r2'
import { logger } from '../../lib/logger'
import { Readable } from 'stream'

export const getImageController = async (c: Context) => {
  try {
    const userId = c.req.param('userId')
    const imageId = c.req.param('imageId')
    const imageKey = buildImageKey(userId, imageId)

    const { body, contentType } = await getFromR2(imageKey)

    // Convertir Node.js Readable stream a Web ReadableStream si es necesario
    let bodyStream
    if (body instanceof Readable) {
      // Convertir Readable a Buffer
      const chunks: Uint8Array[] = []
      for await (const chunk of body) {
        chunks.push(chunk)
      }
      bodyStream = Buffer.concat(chunks)
    } else {
      bodyStream = body
    }

    // Convertir el body a Response
    return new Response(bodyStream, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error: unknown) {
    const err = error as { name?: string; $metadata?: { httpStatusCode?: number } }
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return c.json({
        success: false,
        error: 'Imagen no encontrada',
      }, 404)
    }

    logger.error('Error getting image:', error)
    return c.json({
      success: false,
      error: 'Error al obtener la imagen',
    }, 500)
  }
}
