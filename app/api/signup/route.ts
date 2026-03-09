import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { username, email, password } = body
    console.log("Connecting DB")
    await connectDB()
    console.log("Connected")
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    return NextResponse.json({
      message: "User created",
      user
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json({
      message: "Server error"
    }, { status: 500 })
  }

}