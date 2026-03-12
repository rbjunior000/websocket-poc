import { useState } from 'react'

interface PublishCardProps {
  isConnected: boolean
  onPublish: (destination: string, message: string) => void
}

const DEFAULT_MESSAGE = `{
  "content": "Teste",
  "type": "MESSAGE"
}`

export function PublishCard({ isConnected, onPublish }: PublishCardProps) {
  const [destination, setDestination] = useState('')
  const [message, setMessage] = useState(DEFAULT_MESSAGE)

  const handlePublish = () => {
    onPublish(destination, message)
  }

  return (
    <div className="card">
      <h2>3. Publicar Mensagem</h2>
      <div className="row">
        <div>
          <label>Destino</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="/app/chat"
          />
        </div>
      </div>
      <label>Mensagem (JSON)</label>
      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br /><br />
      <button
        className="btn-primary"
        onClick={handlePublish}
        disabled={!isConnected}
      >
        Publicar
      </button>
    </div>
  )
}
