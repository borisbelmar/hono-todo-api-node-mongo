import { Context } from 'hono'
import type { Todo } from '../../types/todo.types'
import type { PatchTodoInput } from '../../schemas/todo.schema'
import { TodoModel } from '../../models/todo.model'

type Variables = {
  userId: string
}

export const patchTodoController = async (c: Context<{ Variables: Variables }>) => {
  try {
    const id = c.req.param('id')
    const userId = c.get('userId')
    const existingTodo = await TodoModel.findOne({ id, userId })

    if (!existingTodo) {
      return c.json({
        success: false,
        error: 'Todo not found',
      }, 404)
    }

    const body = await c.req.json() as PatchTodoInput

    // Actualizar solo los campos proporcionados
    // Nota: La eliminación de imágenes se debe manejar en el controlador de imágenes
    if (body.title !== undefined) {
      existingTodo.title = body.title
    }
    if (body.completed !== undefined) {
      existingTodo.completed = body.completed
    }
    if (body.location !== undefined) {
      existingTodo.location = body.location
    }
    if (body.photoUri !== undefined) {
      existingTodo.photoUri = body.photoUri
    }

    await existingTodo.save()

    const updatedTodo: Todo = {
      id: existingTodo.id,
      userId: existingTodo.userId,
      title: existingTodo.title,
      completed: existingTodo.completed,
      location: existingTodo.location,
      photoUri: existingTodo.photoUri,
      createdAt: existingTodo.createdAt.toISOString(),
      updatedAt: existingTodo.updatedAt.toISOString(),
    }

    return c.json({
      success: true,
      data: updatedTodo,
    })
  } catch {
    return c.json({
      success: false,
      error: 'Invalid request body',
    }, 400)
  }
}
