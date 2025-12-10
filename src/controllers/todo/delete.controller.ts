import { Context } from 'hono'
import type { Todo } from '../../types/todo.types'
import { TodoModel } from '../../models/todo.model'

type Variables = {
  userId: string
}

export const deleteTodoController = async (c: Context<{ Variables: Variables }>) => {
  try {
    const id = c.req.param('id')
    const userId = c.get('userId')
    const todoDoc = await TodoModel.findOne({ id, userId })

    if (!todoDoc) {
      return c.json({
        success: false,
        error: 'Todo not found',
      }, 404)
    }

    // Nota: La eliminación de imágenes se debe manejar en el controlador de imágenes

    const deletedTodo: Todo = {
      id: todoDoc.id,
      userId: todoDoc.userId,
      title: todoDoc.title,
      completed: todoDoc.completed,
      location: todoDoc.location,
      photoUri: todoDoc.photoUri,
      createdAt: todoDoc.createdAt.toISOString(),
      updatedAt: todoDoc.updatedAt.toISOString(),
    }

    await TodoModel.deleteOne({ id, userId })

    return c.json({
      success: true,
      data: deletedTodo,
      message: 'Todo deleted successfully',
    })
  } catch {
    return c.json({
      success: false,
      error: 'Failed to delete todo',
    }, 500)
  }
}
