import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Contact form is not configured yet. Please email sreeshanthsoma@gmail.com instead!" },
        { status: 503 }
      )
    }

    const embed = {
      title: "New Portfolio Message",
      color: 0x007aff, // macOS blue
      fields: [
        { name: "From", value: name.trim(), inline: true },
        { name: "Email", value: email.trim(), inline: true },
        ...(phone?.trim() ? [{ name: "Phone", value: phone.trim(), inline: true }] : []),
        { name: "Message", value: message.trim() },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "sreeshanthsoma.live" },
    }

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!discordResponse.ok) {
      console.error("Discord webhook error:", await discordResponse.text())
      return NextResponse.json(
        { error: "Failed to send message. Please try again!" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again!" },
      { status: 500 }
    )
  }
}
