"use client";
import { Order, OrderStatus } from "@/entities/Order";
import { createContext, useEffect, useState } from "react";
import {
  createWebSocket,
  disconnectWebSocket,
  listenEvent,
  sendEvent,
} from "@/services/webSockect";
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


  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const fetchedOrders = await OrderService.fetchAllOrder();
  //       setOrders(fetchedOrders);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchOrders();

  // }, []);	


  useEffect(() => {
    // Cria a conexão WebSocket
    const socket = createWebSocket();

    // Ouve atualizações de pedidos via WebSocket
    listenEvent(socket, "orders_update", (updatedOrders) => {
      console.log("Orders updated via WebSocket:", updatedOrders);
      setOrders(updatedOrders); // Atualiza o estado com os pedidos recebidos
    });

    // Limpa a conexão WebSocket ao desmontar o componente
    // return () => {
    //   disconnectWebSocket(socket);
    // };
  }, []);

  const handleUpdateStatus = async (ids: number[], status: OrderStatus) => {
    try {
        const newStatus: OrderStatus =
            status === "WAITING"
                ? "IN_PRODUCTION"
                : status === "IN_PRODUCTION"
                    ? "READY"
                    : "PAID";

        // Atualiza todos os IDs de uma vez
        const updatedCount = await OrderService.updateOrders(ids, newStatus);

        console.log(`${updatedCount} orders updated.`);

        // Emite o evento para o WebSocket
        const socket = createWebSocket();
        sendEvent(socket, "orders_update", { ids, status: newStatus });
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
