// models/Advice.js
import mongoose from 'mongoose'

const AdviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: false },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Advice || mongoose.model('Advice', AdviceSchema)
