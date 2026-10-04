/**
 * Robustly extract and parse a JSON object from an LLM response.
 * Handles: markdown code fences, unescaped apostrophes, trailing commas.
 */
export function parseJsonFromLLM(text: string): unknown {
  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  let cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').trim()

  // Extract the first {...} block
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON object found in response')

  cleaned = match[0]

  // Try direct parse first
  try {
    return JSON.parse(cleaned)
  } catch {
    // Fix unescaped single quotes inside JSON string values
    // Replace ' with \u2019 (right single quotation mark) only inside string values
    const fixed = cleaned
      .replace(/:\s*"([^"]*)"/g, (_match, val: string) => {
        const escaped = val
          .replace(/\\/g, '\\\\')       // must be first
          .replace(/\t/g, '\\t')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
        return `: "${escaped}"`
      })
      // Remove trailing commas before } or ]
      .replace(/,\s*([}\]])/g, '$1')

    return JSON.parse(fixed)
  }
}
