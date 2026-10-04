# Frenchly

An AI-powered French learning platform built for Sri Lankan learners. Supports learning French through Sinhala, Tamil, and English with three interactive modes.

## Features

### Translate & Learn
- Translate Sinhala, Tamil, or English text into French
- Get IPA pronunciation, phonetic spellings in Sinhala/Tamil script, grammar notes, and example sentences
- Listen to native French pronunciation via text-to-speech

### Accent Coach
- Record your French pronunciation and get AI feedback
- Scores your accent out of 100 with specific corrections
- Tailored tips for common Sri Lankan speaker challenges (nasal vowels, silent letters, hard R, the French U)
- Guided practice with preset phrases or free practice mode

### Conversation Practice
- Chat with **Professeur Pierre**, an AI French tutor
- Three difficulty levels: Beginner, Intermediate, Advanced
- Automatic grammar corrections inline
- Live voice mode with hands-free turn-taking (speech recognition + text-to-speech)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI**: Groq API (Llama 3.3 70B)
- **Speech**: Web Speech API (recognition + synthesis)

## Getting Started

### Prerequisites
- Node.js 18+
- A [Groq API key](https://console.groq.com)

### Installation

```bash
git clone https://github.com/Rinoza-Jiffry/Frenchly.git
cd Frenchly
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Browser Support

Voice features (Accent Coach and Live Conversation mode) require Chrome or Edge for full Web Speech API support.

## Author

**Rinoza Jiffry**
