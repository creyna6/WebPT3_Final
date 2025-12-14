import request from 'supertest'
import mongoose from 'mongoose'
import Hapi from '@hapi/hapi'
import Item from '../models/Item.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { startServer } from '../server.js'

let server
let createdItemId

beforeAll(async () => {
  process.env.NODE_ENV = 'test'

  server = Hapi.server({ port: 0 })
  await startServer()

  await User.deleteMany({})
  await Item.deleteMany({})

  await User.create({
    username: 'testuser',
    passwordHash: bcrypt.hashSync('password123', 10)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})

test('POST /api/login works', async () => {
  const res = await request('http://localhost:4000')
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })

  expect(res.statusCode).toBe(200)
  expect(res.body.success).toBe(true)
})

test('POST /api/items creates item', async () => {
  const res = await request('http://localhost:4000')
    .post('/api/items')
    .send({
      title: 'Test Assignment',
      description: 'Test Description',
      dueDate: '2025-12-20'
    })

  expect(res.statusCode).toBe(201)
  expect(res.body.title).toBe('Test Assignment')

  createdItemId = res.body._id
})

test('GET /api/items returns items', async () => {
  const res = await request('http://localhost:4000')
    .get('/api/items')

  expect(res.statusCode).toBe(200)
  expect(res.body.length).toBeGreaterThan(0)
})

test('PUT /api/items updates item', async () => {
  const res = await request('http://localhost:4000')
    .put(`/api/items/${createdItemId}`)
    .send({
      title: 'Updated Assignment',
      description: 'Updated',
      dueDate: '2025-12-25'
    })

  expect(res.statusCode).toBe(200)
  expect(res.body.title).toBe('Updated Assignment')
})

test('DELETE /api/items deletes item', async () => {
  const res = await request('http://localhost:4000')
    .delete(`/api/items/${createdItemId}`)

  expect(res.statusCode).toBe(200)
})
