import { OrderItem } from "./OrderItem";

export type OrderStatus = "WAITING" | "IN_PRODUCTION" | "READY" | "PAID"

export interface Order{
    id: number,
    status?: OrderStatus,
    orderItems: Array<Partial<OrderItem>>,
    createdAt?: string,
    table_id: number,
}