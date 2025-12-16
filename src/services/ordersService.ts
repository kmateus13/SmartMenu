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



    /* async createOrder(attributes: Omit<Order, "id">): Promise<Order> {
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
    }, */
    async createOrder(attributes: Omit<Order, "id">): Promise<Order> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attributes)
        })

        // VERIFICAÇÃO DE ERRO
        if (!response.ok) {
            // Se der erro 400/500, não tenta ler JSON se o corpo estiver vazio
            console.error(`Erro na API: ${response.status} - ${response.statusText}`);
            throw new Error("Falha ao criar pedido no servidor.");
        }

        const newOrder: Order = await response.json()
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

        if (!response.ok) {
            console.error(`Erro ao atualizar: ${response.status}`);
            throw new Error("Falha ao atualizar status");
        }

        // --- CORREÇÃO AQUI ---
        // O Java retorna status 204 (No Content), então NÃO chame response.json()
        if (response.status === 204) {
            return ids.length; // Retorna a quantidade de IDs que enviamos
        }

        // Caso você mude o backend no futuro para retornar algo:
        try {
            const result = await response.json();
            return result.updated || ids.length;
        } catch {
            return ids.length;
        }
    },

    async deleteOrder(id: number): Promise<void> {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${id}`, {
            method: "DELETE"
        })
    }
}