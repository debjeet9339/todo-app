import mongoose from "mongoose"
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Note from "@/models/Note"
import jwt from "jsonwebtoken"

function verifyToken(token: string | undefined) {
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  
  await connectDB()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const notes = await Note.find({
    userId: new mongoose.Types.ObjectId(decoded.userId)
  }).sort({ createdAt: -1 })
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  await connectDB()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { title, description } = await req.json()

  if (!title || !description) {
    return NextResponse.json({ message: "Title and description are required" }, { status: 400 })
  }

  const note = await Note.create({
  title,
  description,
  userId: new mongoose.Types.ObjectId(decoded.userId)
})

  return NextResponse.json(note, { status: 201 })
}