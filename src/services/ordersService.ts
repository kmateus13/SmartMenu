import { Order, OrderStatus } from "@/entities/Order"



export const OrderService = {
    async fetchOrders(tableId: number): Promise<Order[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table/${tableId}/orders`)
        const data: Order[] = await response.json()
        return data
    },

    async fetchAllOrder(): Promise<Order[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`)
        const data: Order[] = await response.json()
        return data
    },



    async createOrder(attributes: Omit<Order, "id">): Promise<Order> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const newOrder: Order = await response.json()
        console.log(newOrder)
        return newOrder
    },


    async updateOrders(ids: number[], status: OrderStatus): Promise<number> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids, status }),
        });
    
        const result = await response.json();
        return result.updated; // Retorna o número de linhas atualizadas
    },

    async deleteOrder(id: number): Promise<void>{
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${id}`, {
            method: "DELETE"
        })
    }
}