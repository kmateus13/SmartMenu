import { Table } from "@/entities/Table"


export const TableService = {
    async fetchTables(): Promise<Table[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tables`)
        const data: Table[] = await response.json()
        return data
    },

    async createTable(attributes: Omit<Table, "id">): Promise<Table> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const newTable: Table = await response.json()
        return newTable
    },

    async updateTable(id: number, attributes:Partial<Omit<Table, "id">>): Promise<Table>{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const updateTable: Table = await response.json()
        return updateTable
    },


    async deleteTable(id: number): Promise<void>{
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table/${id}`, {
            method: "DELETE"
        })
    }
}