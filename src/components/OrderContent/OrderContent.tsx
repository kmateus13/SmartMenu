import { Flex, ScrollArea, Text } from "@radix-ui/themes";
import CardCart from "../CardCart/CardCart";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/ordersService";
import { Order } from "@/entities/Order";
import { OrderItem } from "@/entities/OrderItem";
import { useOrders } from "@/hook/useOrders";

interface OrderContentProps {
    idTable: number
}

export default function OrderContent({idTable}: OrderContentProps) {

    const { orders } = useOrders()
    // const [orders, setOrders] = useState<Order[]>([])

    // useEffect(() => {
    //     const fetchOrder = async () => {
    //         try {
    //             const fetchedOrders = await OrderService.fetchOrders(1);
    //             setOrders(fetchedOrders)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }

    //     fetchOrder()
    // }, [])

    const filteredTable = orders.filter((order) => order.table_id === idTable && order.status !== "PAID")
    const status = (status: string) => {
        switch (status) {
            case "WAITING":
                return "Na Fila"
            case "IN_PRODUCTION":
                return "Preparando"
            case "READY":
                return "Pronto"
            default:
                return "Na Fila"
        }
    }


    return (
        <>
            <ScrollArea scrollbars="vertical" className="w-full h-[85%] ">
                {filteredTable.map((order, index) => (
                    <Flex key={order.id} direction={"column"} gap={"2"} mt={"4"} p={"3"} className="bg-gray-100 rounded-lg">
                        <Flex className="w-full" direction={"column"} gap={"2"}>
                            <Flex className="w-full justify-between">
                                <Text weight={"bold"}>Pedido {index + 1}</Text>
                                <Flex gap={"4"}>
                                    <Text weight={"light"}>Status:</Text>
                                    <Text weight={"bold"}>{status(order.status!)}</Text>
                                </Flex>
                            </Flex>
                            <Flex className="w-full" direction={"column"} gap={"2"}>
                                <Text as="p" size={"3"} weight={"light"}>itens</Text>
                                <Flex className="w-full" direction={"column"} gap={"2"}>
                                    {order.orderItems.map((item) => (
                                        <CardCart key={item.id} orderItem={item as OrderItem} />
                                    ))}



                                </Flex>
                                <Flex className="w-full justify-end gap-2">
                                    <Text>Total:</Text>
                                    <Text weight={"bold"}>R$ {order.orderItems.reduce((total, item) => total + item.product!.price * item.quantity!, 0).toFixed(2).replace(".", ",")} </Text>
                                </Flex>
                            </Flex>
                        </Flex>

                    </Flex>
                ))}
            </ScrollArea>



            <Flex className="w-full  pr-16 absolute  gap-4 bottom-20 items-center justify-end">
                <Text as="p" size={"3"} >Total: </Text>
                <Text as="p" size={"5"} weight={"bold"}>R$ {filteredTable.reduce((total, order) => total + order.orderItems.reduce((total, item) => total + item.product!.price * item.quantity!, 0), 0).toFixed(2).replace(".", ",")}</Text>
            </Flex>
        </>
    );
}