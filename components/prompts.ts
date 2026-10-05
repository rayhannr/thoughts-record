// Worded the way the psychologist asks, not as product labels.
export const PROMPTS = {
  situation: 'apa yang terjadi?',
  thoughts: 'apa yang muncul di pikiran?',
  feelings: 'rasanya gimana?',
  anotherFeeling: 'perasaan lainnya?',
  intensity: 'seberapa kuat?',
  valence: 'terasa gimana?',
  evidence: 'apa buktinya?'
} as const

export const DRAFT_LABEL = 'belum diuji'

export const VALENCE_LABEL = { good: 'enak', bad: 'nggak enak' } as const
