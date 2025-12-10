import { Context } from 'hono'
import { vi } from 'vitest'

interface MockVariables {
  userId?: string
}

interface CreateMockContextOptions {
  variables?: MockVariables
  method?: string
  path?: string
  body?: unknown
  headers?: Record<string, string>
  params?: Record<string, string>
}

export const createMockContext = (options: CreateMockContextOptions = {}): Context => {
  const {
    variables = {},
    method = 'GET',
    path = '/',
    body,
    headers = {},
    params = {},
  } = options

  // Mock del request
  const mockRequest = {
    method,
    url: `http://localhost${path}`,
    headers: new Headers(headers),
    header: vi.fn((name: string) => headers[name] || null),
    json: vi.fn(async () => body),
    formData: vi.fn(async () => {
      const formData = new FormData()
      if (body && typeof body === 'object') {
        Object.entries(body).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value)
          } else if (typeof value === 'string') {
            formData.append(key, value)
          }
        })
      }
      return formData
    }),
    param: vi.fn((key: string) => {
      // Retornar params proporcionados en las opciones
      if (params[key]) {
        return params[key]
      }
      // Extrae parámetros de la URL si están en formato /resource/:id
      const parts = path.split('/')
      if (parts.length > 2 && key === 'id') {
        return parts[parts.length - 1]
      }
      if (key === 'userId' && parts.includes('images')) {
        return parts[2] // /images/:userId/:imageId
      }
      if (key === 'imageId' && parts.includes('images')) {
        return parts[3]
      }
      return undefined
    }),
  } as unknown as Request

  // Mock del contexto
  const mockContext = {
    req: mockRequest,
    get: vi.fn((key: string) => {
      if (key === 'userId') return variables.userId
      return undefined
    }),
    set: vi.fn(),
    json: vi.fn((data: unknown, status?: number) => {
      return new Response(JSON.stringify(data), {
        status: status || 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }),
    text: vi.fn((text: string, status?: number) => {
      return new Response(text, {
        status: status || 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }),
    html: vi.fn((html: string, status?: number) => {
      return new Response(html, {
        status: status || 200,
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }),
  } as unknown as Context

  return mockContext
}

// Helper para parsear la respuesta JSON
export const parseJsonResponse = async (response: Response) => {
  const text = await response.text()
  return JSON.parse(text)
}
