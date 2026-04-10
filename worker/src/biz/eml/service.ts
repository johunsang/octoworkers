type SendPayload = {
  from: string
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendViaResend(apiKey: string, payload: SendPayload): Promise<{ id: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: payload.from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  })

  if (!res.ok) {
    throw new Error(`Email delivery failed (status ${res.status})`)
  }

  return res.json() as Promise<{ id: string }>
}
