import { Context } from 'hono'
import { nanoid } from 'nanoid'
import type { Todo } from '../../types/todo.types'
import type { CreateTodoInput } from '../../schemas/todo.schema'
import { TodoModel } from '../../models/todo.model'

type Variables = {
  userId: string
}

export const createTodoController = async (c: Context<{ Variables: Variables }>) => {
  try {
    const body = await c.req.json() as CreateTodoInput
    const userId = c.get('userId')

    const id = nanoid()

    const newTodoDoc = await TodoModel.create({
      id,
      userId,
      title: body.title,
      completed: body.completed ?? false,
      location: body.location,
      photoUri: body.photoUri,
    })

    const newTodo: Todo = {
      id: newTodoDoc.id,
      userId: newTodoDoc.userId,
      title: newTodoDoc.title,
      completed: newTodoDoc.completed,
      location: newTodoDoc.location,
      photoUri: newTodoDoc.photoUri,
      createdAt: newTodoDoc.createdAt.toISOString(),
      updatedAt: newTodoDoc.updatedAt.toISOString(),
    }

    return c.json({
      success: true,
      data: newTodo,
    }, 201)
  } catch {
    return c.json({
      success: false,
      error: 'Invalid request body',
    }, 400)
  }
}
