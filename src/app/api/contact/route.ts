import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { emailAddress, subject, message } = await request.json()

    if (!emailAddress || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // TODO: Integrate with your email provider (Resend, Postmark, SES, etc.)
    // For now we just log and return success.
    console.log('CONTACT_FORM', { emailAddress, subject, message })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}


