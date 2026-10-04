import { NextRequest } from 'next/server'
import { groq, MODEL, CONVERSATION_SYSTEM } from '@/lib/claude'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages, difficulty = 'beginner' } = await req.json() as {
      messages: Message[]
      difficulty: 'beginner' | 'intermediate' | 'advanced'
    }

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 })
    }

    const systemWithDifficulty = `${CONVERSATION_SYSTEM}

Current learner level: ${difficulty.toUpperCase()}. Adapt your vocabulary and sentence complexity accordingly.`

    // Build Groq message history
    const groqMessages = [
      { role: 'system' as const, content: systemWithDifficulty },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    // Streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await groq.chat.completions.create({
            model: MODEL,
            messages: groqMessages,
            max_tokens: 1024,
            temperature: 0.5,
            stream: true,
          })
          for await (const chunk of result) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) controller.enqueue(encoder.encode(text))
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Conversation error:', error)
    return new Response(JSON.stringify({ error: 'Conversation failed' }), { status: 500 })
  }
}
