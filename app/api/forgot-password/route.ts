import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
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
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase() })

    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      await PasswordReset.findOneAndUpdate(
        { email: email.toLowerCase() },
        { email: email.toLowerCase(), otp, expiresAt, used: false, attempts: 0 },
        { upsert: true, new: true }
      )

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      await transporter.sendMail({
        from: `"Apex Notes" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your password reset code',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem;background:#faf8f4;border-radius:16px;">
            <h2 style="font-family:Georgia,serif;color:#1a1714;margin-bottom:0.5rem;">Password Reset</h2>
            <p style="color:#9c9288;font-size:14px;margin-bottom:1.5rem;line-height:1.6;">
              Use the code below to reset your Apex Notes password. It expires in <strong>10 minutes</strong>.
            </p>
            <div style="background:#f0ece5;border:1.5px solid #e5dfd6;border-radius:12px;padding:1.25rem;text-align:center;margin-bottom:1.5rem;">
              <span style="font-size:2.5rem;font-weight:700;letter-spacing:0.3em;color:#1a1714;font-family:monospace;">${otp}</span>
            </div>
            <p style="color:#b5ada4;font-size:12px;">If you didn't request this, ignore this email.</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ message: 'If an account exists, a reset code was sent.' })
  } catch (err) {
    console.error('[forgot-password]', err)
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}