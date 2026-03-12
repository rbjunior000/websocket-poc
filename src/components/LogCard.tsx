import { useEffect, useRef } from 'react'
import { LogEntry } from '../hooks/useWebSocket'

interface LogCardProps {
  logs: LogEntry[]
  onClear: () => void
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function LogCard({ logs, onClear }: LogCardProps) {
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="card">
      <h2>4. Log de Eventos</h2>
      <button className="btn-secondary" onClick={onClear}>
        Limpar Log
      </button>
      <br /><br />
      <div className="log-container" ref={logContainerRef}>
        {logs.map((entry) => (
          <div key={entry.id} className="log-entry">
            <span className="log-time">[{entry.time}]</span>{' '}
            <span className={`log-${entry.type}`}>
              {escapeHtml(entry.message)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
