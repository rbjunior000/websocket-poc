import { useEffect } from 'react'
import { useWebSocket } from './hooks/useWebSocket'
import { ConnectionCard } from './components/ConnectionCard'
import { SubscriptionCard } from './components/SubscriptionCard'
import { PublishCard } from './components/PublishCard'
import { LogCard } from './components/LogCard'


function App() {
  const {
    status,
    isConnected,
    logs,
    subscriptions,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    addLog,
    clearLogs
  } = useWebSocket()

  useEffect(() => {
    addLog('POC WebSocket pronta. Insira a URL e Token para conectar.', 'info')
  }, [addLog])

  return (
    <>
      <h1>WebSocket POC - LicitaGov</h1>

      <ConnectionCard
        status={status}
        isConnected={isConnected}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <SubscriptionCard
        isConnected={isConnected}
        subscriptions={subscriptions}
        onSubscribe={subscribe}
        onUnsubscribe={unsubscribe}
      />

      <PublishCard
        isConnected={isConnected}
        onPublish={publish}
      />

      <LogCard
        logs={logs}
        onClear={clearLogs}
      />
    </>
  )
}

export default App
