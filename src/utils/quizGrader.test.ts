import { describe, it, expect } from 'vitest'
import { gradeQuestion, computeScore, PASS_THRESHOLD } from './quizGrader'
import { QuizQuestion } from '../types'

describe('gradeQuestion', () => {
  describe('multiple-choice', () => {
    const mcQuestion: QuizQuestion = {
      id: 'mc1',
      questionType: 'multiple-choice',
      questionText: 'What is 2+2?',
      options: ['3', '4', '5'],
      correctAnswer: '4',
    }

    it('returns true for correct answer', () => {
      expect(gradeQuestion(mcQuestion, '4')).toBe(true)
    })

    it('returns false for wrong answer', () => {
      expect(gradeQuestion(mcQuestion, '3')).toBe(false)
    })

    it('returns false for empty answer', () => {
      expect(gradeQuestion(mcQuestion, '')).toBe(false)
    })

    it('is case-sensitive for MC answers', () => {
      const q: QuizQuestion = {
        id: 'mc2',
        questionType: 'multiple-choice',
        questionText: 'Pick one',
        options: ['Alpha', 'Beta'],
        correctAnswer: 'Alpha',
      }
      expect(gradeQuestion(q, 'alpha')).toBe(false)
    })
  })

  describe('free-text', () => {
    const ftQuestion: QuizQuestion = {
      id: 'ft1',
      questionType: 'free-text',
      questionText: 'Describe fire',
      correctAnswer: '',
      keywords: ['heat', 'combustion', 'oxygen'],
      minKeywords: 2,
    }

    it('passes when enough keywords matched', () => {
      expect(gradeQuestion(ftQuestion, 'Fire involves heat and combustion')).toBe(true)
    })

    it('fails when too few keywords matched', () => {
      expect(gradeQuestion(ftQuestion, 'Fire is hot')).toBe(false)
    })

    it('is case-insensitive for keyword matching', () => {
      expect(gradeQuestion(ftQuestion, 'HEAT and COMBUSTION are important')).toBe(true)
    })

    it('matches keywords as substrings', () => {
      expect(gradeQuestion(ftQuestion, 'preheating and combustion process')).toBe(true)
    })

    it('defaults minKeywords to 1 when not specified', () => {
      const q: QuizQuestion = {
        id: 'ft2',
        questionType: 'free-text',
        questionText: 'Describe fire',
        correctAnswer: '',
        keywords: ['warmth', 'light'],
      }
      expect(gradeQuestion(q, 'it gives warmth')).toBe(true)
    })

    it('handles missing keywords array', () => {
      const q: QuizQuestion = {
        id: 'ft3',
        questionType: 'free-text',
        questionText: 'Say something',
        correctAnswer: '',
      }
      // No keywords → matched.length = 0, minKeywords defaults to 1 → false
      expect(gradeQuestion(q, 'anything')).toBe(false)
    })
  })
})

describe('computeScore', () => {
  it('returns 0 for 0 total', () => {
    expect(computeScore(0, 0)).toBe(0)
  })

  it('returns 100 for perfect score', () => {
    expect(computeScore(5, 5)).toBe(100)
  })

  it('returns 0 for all wrong', () => {
    expect(computeScore(0, 5)).toBe(0)
  })

  it('rounds to nearest integer', () => {
    expect(computeScore(1, 3)).toBe(33)
    expect(computeScore(2, 3)).toBe(67)
  })
})

describe('PASS_THRESHOLD', () => {
  it('is 70', () => {
    expect(PASS_THRESHOLD).toBe(70)
  })
})
