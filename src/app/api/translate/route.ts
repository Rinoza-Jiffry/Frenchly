import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL, TRANSLATE_SYSTEM } from '@/lib/claude'
import { parseJsonFromLLM } from '@/lib/parseJson'

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const isSinhala = sourceLang === 'sinhala'
    const isTamil = sourceLang === 'tamil'

    const languageInstruction = isSinhala
      ? `IMPORTANT: The user speaks Sinhala. Follow these rules strictly:
- "french": the French translation (in French)
- "ipa": IPA notation (keep as IPA symbols)
- "phonetic": MUST be written using Sinhala script letters to approximate the French sounds. For example "Je vais" → "ෂ් වේ", "bonjour" → "බොං ෂූර්", "école" → "එකෝල්". Use Sinhala vowels and consonants to mimic French sounds. Never use English letters in this field.
- "literal": word-by-word translation in Sinhala (සිංහල)
- "grammarNote": grammar explanation in Sinhala (සිංහල), or null
- "example": example sentence in French
- "exampleTranslation": translation of example sentence in Sinhala (සිංහල)
- "tips": pronunciation tips written in Sinhala (සිංහල)`
      : isTamil
      ? `IMPORTANT: The user speaks Tamil. Follow these rules strictly:
- "french": the French translation (in French)
- "ipa": IPA notation (keep as IPA symbols)
- "phonetic": MUST be written using Tamil script letters to approximate the French sounds. For example "bonjour" → "போஞ்சூர்", "merci" → "மேர்சி", "oui" → "வீ". Use Tamil vowels and consonants to mimic French sounds. Never use English letters in this field.
- "literal": word-by-word translation in Tamil (தமிழ்)
- "grammarNote": grammar explanation in Tamil (தமிழ்), or null
- "example": example sentence in French
- "exampleTranslation": translation of example sentence in Tamil (தமிழ்)
- "tips": pronunciation tips written in Tamil (தமிழ்)`
      : `The user speaks English. All explanations should be in English. The "phonetic" field should use English letters to approximate French sounds.`

    const userMessage = isSinhala
      ? `Please translate this Sinhala text to French: "${text}"`
      : isTamil
      ? `Please translate this Tamil text to French: "${text}"`
      : `Please translate this English text to French: "${text}"`

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: `${TRANSLATE_SYSTEM}\n\n${languageInstruction}` },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1024,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json(parseJsonFromLLM(responseText))
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
