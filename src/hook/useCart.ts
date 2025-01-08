import { CartContext } from "@/contexts/CartContext"
import { useContext } from "react"


export const useCart = () => {
    return useContext(CartContext)
}