import { SimNode, CATEGORY_COLORS, CATEGORY_LABELS, Category, NodeProgress, QUIZ_LEVELS } from '../types'
import { formatYear } from '../utils/formatYear'

interface Props {
  node: SimNode
  onClose: () => void
  progress?: NodeProgress
  isLocked?: boolean
  onStartQuiz?: (nodeId: string) => void
}

export default function NodeDetail({ node, onClose, progress, isLocked, onStartQuiz }: Props) {
  const color = CATEGORY_COLORS[node.category as Category] || '#999'
  const completedLevels = progress?.completedLevels ?? 0

  return (
    <div className="detail-panel">
      <button className="detail-close" onClick={onClose}>
        &times;
      </button>
      <div className="detail-header" style={{ borderLeftColor: color }}>
        <h2>{node.name}</h2>
        <div className="detail-meta">
          <span className="detail-year">{formatYear(node.year)}</span>
          <span className="detail-era">{node.era}</span>
          <span className="detail-category" style={{ color }}>
            {CATEGORY_LABELS[node.category as Category] || node.category}
          </span>
        </div>
      </div>

      {isLocked ? (
        <div className="detail-locked-message">
          <span className="detail-lock-icon">&#128274;</span>
          <p>Complete 2 quiz levels on the prerequisite node to unlock this technology.</p>
        </div>
      ) : (
        <>
          <p className="detail-description">{node.description}</p>

          {/* Quiz Progress */}
          <div className="detail-quiz-progress">
            <h3 className="detail-quiz-title">
              Quiz Progress
              {completedLevels >= 4 && <span className="detail-mastered-badge">Mastered!</span>}
            </h3>
            <div className="detail-levels">
              {QUIZ_LEVELS.map(lvl => {
                const completed = completedLevels >= lvl.level
                const isNext = lvl.level === completedLevels + 1
                return (
                  <div
                    key={lvl.level}
                    className={`detail-level ${completed ? 'completed' : ''} ${isNext ? 'next' : ''}`}
                  >
                    <div className="detail-level-dot" style={completed ? { background: color } : undefined} />
                    <span className="detail-level-name">{lvl.name}</span>
                    <span className="detail-level-xp">{lvl.xp} XP</span>
                    {completed && <span className="detail-level-check">&#10003;</span>}
                  </div>
                )
              })}
            </div>
            {completedLevels < 4 && onStartQuiz && (
              <button
                className="detail-quiz-btn"
                style={{ background: color + '1A', color, borderColor: color + '4D' }}
                onClick={() => onStartQuiz(node.id)}
              >
                Start Level {completedLevels + 1} Quiz
              </button>
            )}
          </div>

          {completedLevels >= 3 ? (
            <a
              href={node.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-link"
            >
              Read on Wikipedia &rarr;
            </a>
          ) : (
            <p className="detail-wiki-locked">
              Complete 3 quiz levels to unlock the Wikipedia link
            </p>
          )}
          <div className="detail-stats">
            <span>{node.connectionCount} connections</span>
            {progress && <span> &middot; {progress.totalXp} XP earned</span>}
          </div>
        </>
      )}
    </div>
  )
}
