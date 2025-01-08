import { Button, Flex, Text } from "@radix-ui/themes";
import CardCart from "../CardCart/CardCart";
import { useCart } from "@/hook/useCart";
import { OrderItem } from "@/entities/OrderItem";
import { useState } from "react";



export default function CartContent() {



    const { cart } = useCart()


    const calculateTotal = (cart: OrderItem[]) => {
        return cart.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
    };

    const total = calculateTotal(cart);


    return (
        <>
            <Flex className="flex flex-col gap-2">

                {cart.map((item) => (
                    <CardCart key={item.id} orderItem={item} isCart />
                ))}


            </Flex>
            <Flex className="w-full  pr-16 absolute  gap-4 bottom-20 items-center justify-end">
                <Text as="p" size={"3"} >Total: </Text>
                <Text as="p" size={"5"} weight={"bold"}>R$ {total.toFixed(2)}</Text>

            </Flex>
        </>
    );
}