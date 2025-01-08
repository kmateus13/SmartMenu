import { Product } from "@/entities/Products"


export const ProductService = {
    async fetchProducts(categoryId?: number): Promise<Product[]> {
        const query = categoryId ? `?category_id=${categoryId}` : ''
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products${query}`)
        const data: Product[] = await response.json()
        return data
    },



    async createProduct(attributes: Omit<Product, "id">): Promise<Product> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const newProduct: Product = await response.json()
        return newProduct
    },

    async updateProduct(id: number, attributes:Partial<Omit<Product, "id">>): Promise<Product>{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(attributes)
        })

        const updateProduct: Product = await response.json()
        return updateProduct
    },


    async deleteProduct(id: number): Promise<void>{
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
            method: "DELETE"
        })
    }
}