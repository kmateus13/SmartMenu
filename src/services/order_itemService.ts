import { OrderItem } from "@/entities/OrderItem"


export const OrderItemService = {
    async fetchOrderItems(): Promise<OrderItem[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orderItems`)
        const data: OrderItem[] = await response.json()
        return data
    },

    async createOrderItem(attributes: Omit<OrderItem, "id">): Promise<OrderItem> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orderItems`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const newOrderItem: OrderItem = await response.json()
        return newOrderItem
    },

    async updateOrderItem(id: number, attributes:Partial<Omit<OrderItem, "id">>): Promise<OrderItem>{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orderItems/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const updateOrderItem: OrderItem = await response.json()
        return updateOrderItem
    },


    async deleteOrderItem(id: number): Promise<void>{
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orderItems/${id}`, {
            method: "DELETE"
        })
    }
}