"use client";
import { io, Socket } from "socket.io-client";

// Função para criar e retornar a instância do WebSocket
export const createWebSocket = (): Socket => {
  const socket: Socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`);
  

  socket.on("connect", () => {
    console.log("Conectado ao servidor WebSocket");
  });

  // socket.on("orders_update", () => {
  //   console.log("teste");
  // });

  
  socket.on("disconnect", (reason) => {
    console.warn("Desconectado do servidor WebSocket:", reason);
  });

  return socket;
};

// Função para fechar a conexão do WebSocket
export const disconnectWebSocket = (socket: Socket) => {
  if (socket) {
    socket.disconnect();
    console.log("Desconectado do servidor WebSocket");
  }
};

// Função para enviar um evento para o servidor
export const sendEvent = (socket: Socket, event: string, data: any) => {
  socket.emit(event, data, (ack: any) => {
    console.log(`Evento '${event}' enviado. Resposta do servidor:`, ack);
  });
};

// Função para ouvir um evento do servidor
export const listenEvent = (socket: Socket, event: string, callback: (data: any) => void) => {
  socket.on(event, (data) => {
    console.log(`Evento recebido: '${event}'`, data);
    callback(data);
  });
};

// Função para parar de escutar um evento
export const stopListening = (socket: Socket, event: string) => {
  socket.off(event);
  console.log(`Parou de ouvir o evento: '${event}'`);
};
