"use client";
import { Order, OrderStatus } from "@/entities/Order";
import { createContext, useEffect, useState } from "react";
import {
  createWebSocket,
  subscribeToOrders,
  disconnectWebSocket
} from "@/services/stompService";
import { OrderService } from "@/services/ordersService";

type OrderContextType = {
  orders: Order[];
  handleUpdateStatus: (id: number[], status: OrderStatus) => void;
};

export const OrderContext = createContext({} as OrderContextType);

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. Carga Inicial via REST
  useEffect(() => {
    const fetchOrders = async () => {
       try {
         const fetchedOrders = await OrderService.fetchAllOrder();
         setOrders(fetchedOrders);
       } catch (error) {
         console.log(error);
       }
    };
    fetchOrders();
  }, []);

  // 2. Conexão WebSocket com Delay de Segurança
  useEffect(() => {
    // Inicia a conexão
    createWebSocket();

    // --- A CORREÇÃO MÁGICA ---
    // Esperamos 1 segundo para garantir que o Handshake terminou antes de assinar.
    // Isso evita que o subscribe seja ignorado por "cliente desconectado".
    const subscriptionTimer = setTimeout(() => {
        
        console.log("👂 Tentando assinar tópico de pedidos...");
        
        subscribeToOrders((updatedOrders) => {
            console.log("🔥 Context recebeu atualização:", updatedOrders.length);
            
            // USE O SPREAD OPERATOR [...array]
            // Isso força o React a entender que é um array NOVO e renderizar a tela.
            setOrders([...updatedOrders]); 
        });

    }, 1000); // 1000ms = 1 segundo de espera

    return () => {
      clearTimeout(subscriptionTimer);
      disconnectWebSocket();
    };
  }, []);

  const handleUpdateStatus = async (ids: number[], status: OrderStatus) => {
    try {
        const newStatus: OrderStatus =
            status === "WAITING"
                ? "IN_PRODUCTION"
                : status === "IN_PRODUCTION"
                    ? "READY" 
                    : "PAID";

        // Chama REST e o Java avisa o WebSocket
        await OrderService.updateOrders(ids, newStatus);
        console.log(`Status atualizado para ${newStatus}. Aguardando WebSocket...`);

    } catch (error) {
        console.error("Failed to update order status:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, handleUpdateStatus }}>
      {children}
    </OrderContext.Provider>
  );
};