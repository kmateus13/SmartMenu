"use client";
import { Client, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Variável para manter a instância do cliente ativa
let client: Client | null = null;

export const createWebSocket = (): Client => {
  // Se já existir cliente ativo, retorna ele (evita múltiplas conexões)
  if (client && client.active) return client;

  client = new Client({
    // A URL deve apontar para o endpoint que configuramos no Java (/ws)
    // O SockJS cuida de montar a URL completa (http://localhost:8080/ws)
    webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`),
    
    // Configurações de debug e reconexão
    reconnectDelay: 5000, // Tenta reconectar a cada 5s se cair
    debug: (str) => {
      console.log(str);
    },

    // Callback de quando conecta com sucesso
    onConnect: () => {
      console.log("Conectado ao servidor STOMP (Spring Boot)!");
      
      // EXEMPLO: Já se inscreve automaticamente no tópico de pedidos assim que conectar
      // Isso substitui o listenEvent solto
      subscribeToOrders(); 
    },

    // Callback de erros
    onStompError: (frame) => {
      console.error("Erro no Broker: " + frame.headers["message"]);
      console.error("Detalhes: " + frame.body);
    },
  });

  client.activate(); // Inicia a conexão
  return client;
};

export const disconnectWebSocket = () => {
  if (client) {
    client.deactivate();
    console.log("Desconectado do servidor WebSocket");
    client = null;
  }
};

// --- MUDANÇA DE CONCEITO: ASSINAR TÓPICOS ---

// Função específica para ouvir as ordens (substitui o listenEvent genérico)
export const subscribeToOrders = (callback?: (orders: any) => void) => {
  if (!client || !client.connected) return;

  // No Java configuramos: messagingTemplate.convertAndSend("/topic/orders", ...)
  client.subscribe("/topic/orders", (message: Message) => {
    if (message.body) {
      const data = JSON.parse(message.body);
      console.log("Pedidos recebidos via WebSocket:", data);
      if (callback) callback(data);
    }
  });
};

// Função genérica para publicar mensagens (enviar para o Java)
// Útil se você criar endpoints com @MessageMapping no futuro
export const sendMessage = (destination: string, data: any) => {
  if (client && client.connected) {
    client.publish({
      destination: destination, // Ex: "/app/novo-pedido"
      body: JSON.stringify(data),
    });
  } else {
    console.warn("Não é possível enviar mensagem: Cliente desconectado.");
  }
};