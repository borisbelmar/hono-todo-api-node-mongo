import { beforeAll, afterAll, afterEach } from 'vitest'
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from './helpers/db.helper'

beforeAll(async () => {
  await setupTestDatabase()
})

afterEach(async () => {
  await clearTestDatabase()
})

afterAll(async () => {
  await teardownTestDatabase()
})
