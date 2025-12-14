import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: String
})

export default mongoose.model('Item', itemSchema)
