import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

await mongoose.connect('mongodb://127.0.0.1:27017/webpt3')

await User.create({
  username: 'testuser',
  passwordHash: bcrypt.hashSync('password123', 10)
})

console.log('User created')
process.exit()
