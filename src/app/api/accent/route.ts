import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL, ACCENT_SYSTEM } from '@/lib/claude'
import { parseJsonFromLLM } from '@/lib/parseJson'

export async function POST(req: NextRequest) {
  try {
    const { spokenText, targetPhrase } = await req.json()

    if (!spokenText?.trim()) {
      return NextResponse.json({ error: 'Spoken text is required' }, { status: 400 })
    }

    const userMessage = targetPhrase
      ? `The learner was trying to say: "${targetPhrase}"\nWhat was captured by speech recognition: "${spokenText}"\nPlease analyze their pronunciation and provide detailed feedback.`
      : `The learner spoke this French text (captured by speech recognition): "${spokenText}"\nPlease analyze their pronunciation and provide detailed feedback.`

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: ACCENT_SYSTEM },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 2048,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const choice = completion.choices[0]
    if (choice?.finish_reason === 'length') {
      console.error('Accent analysis truncated — response hit token limit')
      return NextResponse.json({ error: 'Response too long, please try a shorter phrase' }, { status: 500 })
    }

    const responseText = choice?.message?.content ?? ''
    return NextResponse.json(parseJsonFromLLM(responseText))
  } catch (error) {
    console.error('Accent analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
