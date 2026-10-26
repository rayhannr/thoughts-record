// Worded the way the psychologist asks, not as product labels.
export const PROMPTS = {
  situation: 'apa yang terjadi?',
  thoughts: 'apa yang muncul di pikiran?',
  feelings: 'rasanya gimana?',
  anotherFeeling: 'perasaan lainnya?',
  intensity: 'seberapa kuat?',
  valence: 'terasa gimana?',
  balanced: 'apa pikiran alternatifnya?',
  after: 'setelah itu, seberapa kuat?'
} as const

// The working name of the feature; change it here.
export const ROOT_CAUSE = {
  title: 'root cause analysis',
  condition: 'kondisi apa yang kamu alami?',
  triggers: 'apa di masa lalu yang mungkin jadi pemicunya?',
  triggersHint: 'satu paragraf untuk satu pemicu'
} as const

export const DRAFT_LABEL = 'belum diuji'

export const VALENCE_LABEL = { good: 'enak', bad: 'nggak enak' } as const
