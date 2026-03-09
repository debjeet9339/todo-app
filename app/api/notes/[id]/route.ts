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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()

  const { id } = await params

  const token = req.headers.get("Authorization")?.split(" ")[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { title, description } = await req.json()

  const note = await Note.findOneAndUpdate(
    { _id: id, userId: new mongoose.Types.ObjectId(decoded.userId) },
    { title, description },
    { new: true }
  )

  if (!note) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 })
  }

  return NextResponse.json(note)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()

  const { id } = await params

  const token = req.headers.get("Authorization")?.split(" ")[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const note = await Note.findOneAndDelete({
    _id: id,
    userId: new mongoose.Types.ObjectId(decoded.userId)
  })

  if (!note) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Deleted" })
}