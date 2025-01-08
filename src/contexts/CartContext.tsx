import { OrderItem } from "@/entities/OrderItem";
import { Product } from "@/entities/Products";
import { createContext, useState } from "react";

type CartContextType = {
    cart: OrderItem[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: number) => void
    updateQuantity: (productId: number, operation: "increment" | "decrement") => void
    clearCart: () => void
}

export const CartContext = createContext({} as CartContextType)

interface CartProviderProps {
    children: React.ReactNode
}

export const CartContextProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<OrderItem[]>([]);



    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product_id === product.id);

            if (existingItem) {
                // Atualiza a quantidade do item existente
                return prevCart.map((item) =>
                    item.product_id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1, // Incrementa a quantidade
                        }
                        : item
                );
            }

            // Adiciona um novo item ao carrinho
            const newItem: OrderItem = {
                id: prevCart.length + 1,
                quantity: 1,
                product: product,
                order_id: 0,
                product_id: product.id,
            };

            return [...prevCart, newItem];
        });
    };




    const removeFromCart = (productId: number) => {
        setCart((currentState) => currentState.filter((item) => item.id !== productId));
    };




    const updateQuantity = (orderId: number, operation: "increment" | "decrement") => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === orderId
                    ? {
                        ...item,
                        quantity: operation === "increment"
                            ? item.quantity + 1
                            : Math.max(item.quantity - 1, 0), // Garante que a quantidade não fique negativa
                    }
                    : item
            ).filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
    };




    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}