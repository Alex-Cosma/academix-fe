import { useState, useMemo, useCallback } from 'react'
import { QuizQuestion, QUIZ_LEVELS, NodeProgress } from '../types'
import { getLevelQuestions, getQuizForNode, getLevelSummary } from '../data/quizData'
import { gradeQuestion, computeScore, PASS_THRESHOLD } from '../utils/quizGrader'

interface Props {
  nodeId: string
  nodeName: string
  progress: NodeProgress
  onComplete: (level: number, score: number, xp: number) => void
  onClose: () => void
}

interface QuestionResult {
  question: QuizQuestion
  userAnswer: string
  correct: boolean
}

export default function QuizDialog({ nodeId, nodeName, progress, onComplete, onClose }: Props) {
  const nextLevel = progress.completedLevels + 1
  const quizExists = getQuizForNode(nodeId) !== null
  const questions = useMemo(() => getLevelQuestions(nodeId, nextLevel), [nodeId, nextLevel])
  const summary = useMemo(() => getLevelSummary(nodeId, nextLevel), [nodeId, nextLevel])
  const levelInfo = QUIZ_LEVELS[nextLevel - 1]

  const [phase, setPhase] = useState<'summary' | 'quiz' | 'results'>('summary')
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [freeTextAnswer, setFreeTextAnswer] = useState('')
  const [collectedResults, setCollectedResults] = useState<QuestionResult[]>([])

  const handleSubmit = useCallback(() => {
    if (!questions) return
    const question = questions[currentQuestionIdx]
    const answer = question.questionType === 'multiple-choice' ? selectedAnswer : freeTextAnswer
    const correct = gradeQuestion(question, answer)
    const result: QuestionResult = { question, userAnswer: answer, correct }
    const updatedResults = [...collectedResults, result]

    if (currentQuestionIdx === questions.length - 1) {
      setCollectedResults(updatedResults)
      setPhase('results')
    } else {
      setCollectedResults(updatedResults)
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setSelectedAnswer('')
      setFreeTextAnswer('')
    }
  }, [questions, currentQuestionIdx, selectedAnswer, freeTextAnswer, collectedResults])

  // Mastered state
  if (nextLevel > 4) {
    return (
      <div className="quiz-overlay" onClick={onClose}>
        <div className="quiz-card" onClick={e => e.stopPropagation()}>
          <div className="quiz-header">
            <h2>{nodeName}</h2>
            <span className="quiz-badge quiz-badge-mastered">Mastered!</span>
          </div>
          <p className="quiz-message">You have completed all 4 quiz levels for this node.</p>
          <button className="quiz-btn quiz-btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  // Coming soon state
  if (!quizExists || !questions) {
    return (
      <div className="quiz-overlay" onClick={onClose}>
        <div className="quiz-card" onClick={e => e.stopPropagation()}>
          <div className="quiz-header">
            <h2>{nodeName}</h2>
            <span className="quiz-badge">Level {nextLevel}: {levelInfo?.name}</span>
          </div>
          <p className="quiz-message">Quiz coming soon for this node!</p>
          <button className="quiz-btn quiz-btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  // Summary / reading phase
  if (phase === 'summary' && summary) {
    return (
      <div className="quiz-overlay" onClick={onClose}>
        <div className="quiz-card quiz-card-summary" onClick={e => e.stopPropagation()}>
          <div className="quiz-header">
            <h2>{nodeName}</h2>
            <span className="quiz-badge">Level {nextLevel}: {levelInfo?.name}</span>
            <button className="quiz-close" onClick={onClose}>&times;</button>
          </div>
          <div className="quiz-summary-content">
            {summary.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <button
            className="quiz-btn quiz-btn-primary"
            onClick={() => setPhase('quiz')}
          >
            Start Quiz ({questions.length} questions)
          </button>
        </div>
      </div>
    )
  }

  // Results screen
  if (phase === 'results') {
    const correctCount = collectedResults.filter(r => r.correct).length
    const score = computeScore(correctCount, collectedResults.length)
    const passed = score >= PASS_THRESHOLD
    const xp = passed ? (levelInfo?.xp ?? 0) : 0

    return (
      <div className="quiz-overlay" onClick={onClose}>
        <div className="quiz-card quiz-card-results" onClick={e => e.stopPropagation()}>
          <div className="quiz-header">
            <h2>{nodeName}</h2>
            <span className="quiz-badge">Level {nextLevel}: {levelInfo?.name}</span>
          </div>
          <div className="quiz-score-display">
            <div className={`quiz-score-circle ${passed ? 'quiz-score-pass' : 'quiz-score-fail'}`}>
              {score}%
            </div>
            <p className={`quiz-result-text ${passed ? 'quiz-pass' : 'quiz-fail'}`}>
              {passed ? 'Passed!' : 'Not quite...'}
            </p>
            {passed && <p className="quiz-xp-earned">+{xp} XP</p>}
            {!passed && <p className="quiz-retry-hint">You need 70% to pass. Try again!</p>}
          </div>
          <div className="quiz-breakdown">
            <h3>Question Breakdown</h3>
            {collectedResults.map((r, i) => (
              <div key={r.question.id} className={`quiz-breakdown-item ${r.correct ? 'correct' : 'incorrect'}`}>
                <span className="quiz-breakdown-icon">{r.correct ? '\u2713' : '\u2717'}</span>
                <span className="quiz-breakdown-label">Q{i + 1}: {r.correct ? 'Correct' : 'Incorrect'}</span>
              </div>
            ))}
          </div>
          <button
            className="quiz-btn quiz-btn-primary"
            onClick={() => {
              if (passed) {
                onComplete(nextLevel, score, xp)
              }
              onClose()
            }}
          >
            {passed ? 'Continue' : 'Close'}
          </button>
        </div>
      </div>
    )
  }

  // Active question
  const question = questions[currentQuestionIdx]
  const currentAnswer = question.questionType === 'multiple-choice' ? selectedAnswer : freeTextAnswer

  return (
    <div className="quiz-overlay" onClick={onClose}>
      <div className="quiz-card" onClick={e => e.stopPropagation()}>
        <div className="quiz-header">
          <h2>{nodeName}</h2>
          <span className="quiz-badge">Level {nextLevel}: {levelInfo?.name}</span>
          <button className="quiz-close" onClick={onClose}>&times;</button>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="quiz-question-count">
          Question {currentQuestionIdx + 1} of {questions.length}
        </p>
        <p className="quiz-question-text">{question.questionText}</p>
        {question.questionType === 'multiple-choice' && question.options ? (
          <div className="quiz-options">
            {question.options.map(opt => (
              <label key={opt} className={`quiz-option ${selectedAnswer === opt ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="quiz-answer"
                  value={opt}
                  checked={selectedAnswer === opt}
                  onChange={() => setSelectedAnswer(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            className="quiz-textarea"
            placeholder="Type your answer here..."
            value={freeTextAnswer}
            onChange={e => setFreeTextAnswer(e.target.value)}
            rows={4}
          />
        )}
        <button
          className="quiz-btn quiz-btn-primary"
          disabled={!currentAnswer.trim()}
          onClick={handleSubmit}
        >
          {currentQuestionIdx === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}
