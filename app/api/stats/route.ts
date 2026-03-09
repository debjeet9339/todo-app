import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Note from "@/models/Note"

export async function GET() {
  try {
    await connectDB()
    const totalNotes = await Note.countDocuments()
    return NextResponse.json({ totalNotes })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ totalNotes: 0 })
  }
}