import { Category } from "@/entities/Category"


export const categoryService = {
    async fetchCategories(): Promise<Category[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category`)
        const data: Category[] = await response.json()
        return data
    },

    async createCategory(attributes: Omit<Category, "id">): Promise<Category> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const newCategory: Category = await response.json()
        return newCategory
    },

    async updateCategory(id: number, attributes:Partial<Omit<Category, "id">>): Promise<Category>{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const updateCategory: Category = await response.json()
        return updateCategory
    },


    async deleteCategory(id: number): Promise<void>{
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${id}`, {
            method: "DELETE"
        })
    }
}