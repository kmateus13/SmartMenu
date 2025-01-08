
import { OrderContext } from "@/contexts/OrderContext"
import { useContext } from "react"


export const useOrders = () => {
    return useContext(OrderContext)
}