// models/Note.ts
import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true })

export default mongoose.models.Note || mongoose.model("Note", NoteSchema)