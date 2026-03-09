import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {

  try {

    const { email, password } = await req.json()

    await connectDB()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    return NextResponse.json({
      message: "Login successful",
      token,
      username: user.username,
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }

}