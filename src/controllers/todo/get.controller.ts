import { Context } from 'hono'
import type { Todo } from '../../types/todo.types'
import { TodoModel } from '../../models/todo.model'

type Variables = {
  userId: string
}

export const getTodoController = async (c: Context<{ Variables: Variables }>) => {
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

    const todo: Todo = {
      id: todoDoc.id,
      userId: todoDoc.userId,
      title: todoDoc.title,
      completed: todoDoc.completed,
      location: todoDoc.location,
      photoUri: todoDoc.photoUri,
      createdAt: todoDoc.createdAt.toISOString(),
      updatedAt: todoDoc.updatedAt.toISOString(),
    }

    return c.json({
      success: true,
      data: todo,
    })
  } catch {
    return c.json({
      success: false,
      error: 'Failed to fetch todo',
    }, 500)
  }
}
