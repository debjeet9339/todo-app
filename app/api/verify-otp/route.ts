import { NextRequest, NextResponse } from 'next/server'
import {connectDB} from '@/lib/db'
import mongoose from 'mongoose'

const resetSchema = new mongoose.Schema({
  email: String, otp: String, expiresAt: Date, used: Boolean, attempts: Number,
})
const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', resetSchema)

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()
    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and code are required.' }, { status: 400 })
    }

    await connectDB()
    const record = await PasswordReset.findOne({ email: email.toLowerCase() })

    if (!record) {
      return NextResponse.json({ message: 'No reset request found. Please request a new code.' }, { status: 400 })
    }
    if (new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ message: 'This code has expired. Please request a new one.' }, { status: 400 })
    }
    if (record.attempts >= 5) {
      return NextResponse.json({ message: 'Too many attempts. Please request a new code.' }, { status: 429 })
    }

    await PasswordReset.updateOne({ email: email.toLowerCase() }, { $inc: { attempts: 1 } })

    if (record.otp !== otp) {
      return NextResponse.json({ message: 'Incorrect code. Please try again.' }, { status: 400 })
    }
    if (record.used) {
      return NextResponse.json({ message: 'This code has already been used.' }, { status: 400 })
    }

    return NextResponse.json({ message: 'OTP verified.' })
  } catch (err) {
    console.error('[verify-otp]', err)
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}