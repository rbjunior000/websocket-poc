import { useState, useCallback, useRef } from 'react'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'
export type LogType = 'info' | 'success' | 'error' | 'message'

export interface LogEntry {
  id: number
  time: string
  message: string
  type: LogType
}

export interface Subscription {
  topic: string
  subscription: StompSubscription
}

export function useWebSocket() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [subscriptions, setSubscriptions] = useState<Map<string, Subscription>>(new Map())

  const stompClientRef = useRef<Client | null>(null)
  const logIdRef = useRef(0)

  const addLog = useCallback((message: string, type: LogType = 'info') => {
    const time = new Date().toLocaleTimeString()
    const id = ++logIdRef.current
    setLogs(prev => [...prev, { id, time, message, type }])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const connect = useCallback((baseUrl: string, token: string) => {
    if (!baseUrl) {
      addLog('URL Base e obrigatoria!', 'error')
      return
    }

    setStatus('connecting')
    addLog(`Conectando a ${baseUrl}/ws...`)

    const wsUrl = `${baseUrl}/ws${token ? `?token=${token}` : ''}`

    try {

      const client = new Client({
        brokerURL: wsUrl,
        reconnectDelay: 5000,
        heartbeatIncoming: 20000,
        heartbeatOutgoing: 20000,
        debug: (str) => {
          console.log('STOMP:', str)
        },
        onConnect: (frame) => {
          setStatus('connected')
          addLog('Conectado com sucesso!', 'success')
          addLog(`Frame: ${frame}`, 'info')
        },
        onStompError: (frame) => {
          addLog(`Erro STOMP: ${frame.headers.message}`, 'error')
          addLog(`Detalhes: ${frame.body}`, 'error')
        },
        onDisconnect: () => {
          setStatus('disconnected')
          addLog('Desconectado', 'info')
        },
        onWebSocketError: (event) => {
          addLog(`Erro WebSocket: ${event.type}`, 'error')
          console.error('WebSocket Error:', event)
        },
        onWebSocketClose: (event) => {
          addLog(`WebSocket fechado: code=${event.code}, reason=${event.reason || 'N/A'}`, 'info')
          setStatus('disconnected')
        }
      })

      stompClientRef.current = client
      client.activate()
    } catch (error) {
      addLog(`Erro ao conectar: ${(error as Error).message}`, 'error')
      setStatus('disconnected')
    }
  }, [addLog])

  const disconnect = useCallback(() => {
    const client = stompClientRef.current
    if (client) {
      subscriptions.forEach((sub) => {
        if (sub.subscription) {
          sub.subscription.unsubscribe()
        }
      })
      setSubscriptions(new Map())

      client.deactivate()
      stompClientRef.current = null
    }
    setStatus('disconnected')
    addLog('Desconectado manualmente', 'info')
  }, [subscriptions, addLog])

  const subscribe = useCallback((topic: string) => {
    if (!topic) {
      addLog('Topic e obrigatorio!', 'error')
      return
    }

    const client = stompClientRef.current
    if (!client?.connected) {
      addLog('WebSocket nao conectado!', 'error')
      return
    }

    addLog(`Inscrevendo em: ${topic}...`)

    try {
      const subscription = client.subscribe(topic, (message: IMessage) => {
        try {
          const data = JSON.parse(message.body)
          addLog(`[${topic}] Mensagem recebida:`, 'message')
          addLog(JSON.stringify(data, null, 2), 'message')
        } catch {
          addLog(`[${topic}] Mensagem (raw): ${message.body}`, 'message')
        }
      })

      const subId = `${topic}-${Date.now()}`
      setSubscriptions(prev => {
        const newMap = new Map(prev)
        newMap.set(subId, { topic, subscription })
        return newMap
      })
      addLog(`Inscrito em ${topic}!`, 'success')
    } catch (error) {
      addLog(`Erro ao inscrever: ${(error as Error).message}`, 'error')
    }
  }, [addLog])

  const unsubscribe = useCallback((subId: string) => {
    setSubscriptions(prev => {
      const newMap = new Map(prev)
      const sub = newMap.get(subId)
      if (sub?.subscription) {
        sub.subscription.unsubscribe()
        newMap.delete(subId)
        addLog(`Inscricao cancelada: ${sub.topic}`, 'info')
      }
      return newMap
    })
  }, [addLog])

  const publish = useCallback((destination: string, messageText: string) => {
    if (!destination) {
      addLog('Destino e obrigatorio!', 'error')
      return
    }

    const client = stompClientRef.current
    if (!client?.connected) {
      addLog('WebSocket nao conectado!', 'error')
      return
    }

    try {
      const message = JSON.parse(messageText)
      client.publish({
        destination,
        body: JSON.stringify(message)
      })
      addLog(`Publicado em ${destination}: ${messageText}`, 'success')
    } catch (error) {
      addLog(`Erro ao publicar: ${(error as Error).message}`, 'error')
    }
  }, [addLog])

  const isConnected = status === 'connected'

  return {
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
  }
}
