import { useState } from 'react'
import { Subscription } from '../hooks/useWebSocket'

interface SubscriptionCardProps {
  isConnected: boolean
  subscriptions: Map<string, Subscription>
  onSubscribe: (topic: string) => void
  onUnsubscribe: (subId: string) => void
}

const TOPIC_OPTIONS = [
  { value: '/topic/chatroom', label: 'Chatroom' },
  { value: '/topic/etapa/licitacao/', label: 'Etapa Licitacao (+ ID)' },
  { value: '/topic/lotes/licitacao/', label: 'Lotes Licitacao (+ ID)' },
  { value: '/topic/classificacao/lote/', label: 'Classificacao Lote (+ ID)' },
  { value: '/topic/lances/lote/', label: 'Lances Lote (+ ID)' },
  { value: 'custom', label: 'Customizado...' }
]

export function SubscriptionCard({
  isConnected,
  subscriptions,
  onSubscribe,
  onUnsubscribe
}: SubscriptionCardProps) {
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0].value)
  const [topicId, setTopicId] = useState('')
  const [customTopic, setCustomTopic] = useState('')

  const getFullTopic = () => {
    if (selectedTopic === 'custom') {
      return customTopic
    }
    if (selectedTopic.endsWith('/') && topicId) {
      return selectedTopic + topicId
    }
    return selectedTopic
  }

  const handleSubscribe = () => {
    const topic = getFullTopic()
    if (topic) {
      onSubscribe(topic)
    }
  }

  return (
    <div className="card">
      <h2>2. Subscricoes (Topics)</h2>
      <div className="row">
        <div>
          <label>Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {TOPIC_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>ID (se aplicavel)</label>
          <input
            type="text"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            placeholder="Ex: 123"
          />
        </div>
      </div>

      {selectedTopic === 'custom' && (
        <div>
          <label>Topic Customizado</label>
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="/topic/meu-topic"
          />
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleSubscribe}
        disabled={!isConnected}
      >
        Inscrever
      </button>

      <div className="topics-list">
        {subscriptions.size === 0 ? (
          <em>Nenhuma inscricao ativa</em>
        ) : (
          Array.from(subscriptions.entries()).map(([id, sub]) => (
            <div key={id} className="topic-item">
              <span>{sub.topic}</span>
              <button
                className="btn-danger"
                onClick={() => onUnsubscribe(id)}
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                Cancelar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
