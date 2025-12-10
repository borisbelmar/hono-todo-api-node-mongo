import { Context } from 'hono'
import type { Todo } from '../../types/todo.types'
import { TodoModel } from '../../models/todo.model'

type Variables = {
  userId: string
}

export const listTodosController = async (c: Context<{ Variables: Variables }>) => {
  try {
    const userId = c.get('userId')
    const todoDocs = await TodoModel.find({ userId }).sort({ createdAt: -1 })

    const todoList: Todo[] = todoDocs.map((doc) => ({
      id: doc.id,
      userId: doc.userId,
      title: doc.title,
      completed: doc.completed,
      location: doc.location,
      photoUri: doc.photoUri,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }))

    return c.json({
      success: true,
      data: todoList,
      count: todoList.length,
    })
  } catch {
    return c.json({
      success: false,
      error: 'Failed to fetch todos',
    }, 500)
  }
}
