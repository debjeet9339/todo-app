import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import {connectDB} from '@/lib/db'
import mongoose from 'mongoose'

const resetSchema = new mongoose.Schema({
  email: String, otp: String, expiresAt: Date, used: Boolean, attempts: Number,
})
const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', resetSchema)
const userSchema = new mongoose.Schema({ email: String }, { strict: false })
const User = mongoose.models.User || mongoose.model('User', userSchema)

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json()
    if (!email || !otp || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    await connectDB()
    const record = await PasswordReset.findOne({ email: email.toLowerCase() })

    if (!record) {
      return NextResponse.json({ message: 'No reset request found. Please start over.' }, { status: 400 })
    }
    if (new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ message: 'Your reset session has expired. Please start over.' }, { status: 400 })
    }
    if (record.used) {
      return NextResponse.json({ message: 'This reset code has already been used.' }, { status: 400 })
    }
    if (record.otp !== otp) {
      return NextResponse.json({ message: 'Invalid reset session. Please start over.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const result = await User.updateOne(
      { email: email.toLowerCase() },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    await PasswordReset.deleteOne({ email: email.toLowerCase() })
    return NextResponse.json({ message: 'Password reset successfully.' })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}