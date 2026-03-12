import { useState, useEffect } from 'react'
import { ConnectionStatus } from '../hooks/useWebSocket'

interface ConnectionCardProps {
  status: ConnectionStatus
  isConnected: boolean
  onConnect: (baseUrl: string, token: string) => void
  onDisconnect: () => void
}

export function ConnectionCard({ status, isConnected, onConnect, onDisconnect }: ConnectionCardProps) {
  const [baseUrl, setBaseUrl] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    const savedBaseUrl = localStorage.getItem('ws_poc_baseUrl')
    if (savedBaseUrl) {
      setBaseUrl(savedBaseUrl)
    }
  }, [])

  const handleBaseUrlChange = (value: string) => {
    setBaseUrl(value)
    localStorage.setItem('ws_poc_baseUrl', value)
  }

  const handleConnect = () => {
    onConnect(baseUrl, token)
  }

  const statusText = {
    connected: 'Conectado',
    connecting: 'Conectando...',
    disconnected: 'Desconectado'
  }

  return (
    <div className="card">
      <h2>1. Conexao</h2>
      <div className="row">
        <div>
          <label>URL Base (sem /ws/chat)</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => handleBaseUrlChange(e.target.value)}
            placeholder="https://api.exemplo.com.br"
          />
          <p className="help-text">Ex: https://api.licitagov.com.br</p>
        </div>
        <div>
          <label>Token JWT</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIs..."
          />
        </div>
      </div>
      <div>
        <span className={`status ${status}`}>{statusText[status]}</span>
      </div>
      <button
        className="btn-primary"
        onClick={handleConnect}
        disabled={isConnected}
      >
        Conectar
      </button>
      <button
        className="btn-danger"
        onClick={onDisconnect}
        disabled={!isConnected}
      >
        Desconectar
      </button>
    </div>
  )
}
