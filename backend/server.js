import Hapi from '@hapi/hapi'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import User from './models/User.js'
import Item from './models/Item.js'
import 'dotenv/config'

mongoose.connect(process.env.MONGO_URI)

mongoose.connection.once('open', () => {
  console.log('MongoDB connected')
})

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost',
    routes: {
      cors: { origin: ['*'] }
    }
  })

  // ---------- LOGIN ----------
  server.route({
    method: 'POST',
    path: '/api/login',
    handler: async (req, h) => {
      const { username, password } = req.payload

      if (!username || !password) {
        return h.response({ error: 'Username and password required' }).code(400)
      }

      const user = await User.findOne({ username })
      if (!user) {
        return h.response({ error: 'Invalid username or password' }).code(401)
      }

      const match = await bcrypt.compare(password, user.passwordHash)
      if (!match) {
        return h.response({ error: 'Invalid username or password' }).code(401)
      }

      return {
        success: true,
        sessionId: uuidv4(),
        user: { id: user._id, username: user.username }
      }
    }
  })

  // ---------- GET ALL ITEMS ----------
  server.route({
    method: 'GET',
    path: '/api/items',
    handler: async () => {
      return await Item.find().sort({ dueDate: 1 })
    }
  })

  // ---------- CREATE ITEM ----------
  server.route({
    method: 'POST',
    path: '/api/items',
    handler: async (req, h) => {
      const { title, description, dueDate } = req.payload

      if (!title || !title.trim()) {
        return h.response({ error: 'Title required' }).code(400)
      }

      const item = new Item({
        title: title.trim(),
        description: description || '',
        dueDate: dueDate || ''
      })

      await item.save()
      return h.response(item).code(201)
    }
  })

  // ---------- UPDATE ITEM ----------
  server.route({
    method: 'PUT',
    path: '/api/items/{id}',
    handler: async (req, h) => {
      const { title, description, dueDate } = req.payload

      if (!title || !title.trim()) {
        return h.response({ error: 'Title required' }).code(400)
      }

      const item = await Item.findByIdAndUpdate(
        req.params.id,
        {
          title: title.trim(),
          description: description || '',
          dueDate: dueDate || ''
        },
        { new: true }
      )

      if (!item) {
        return h.response({ error: 'Item not found' }).code(404)
      }

      return item
    }
  })

  // ---------- DELETE ITEM ----------
  server.route({
    method: 'DELETE',
    path: '/api/items/{id}',
    handler: async (req, h) => {
      const item = await Item.findByIdAndDelete(req.params.id)

      if (!item) {
        return h.response({ error: 'Item not found' }).code(404)
      }

      return item
    }
  })

  await server.start()
  console.log('Server running at:', server.info.uri)
}

export const startServer = async () => {
  await init()
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

