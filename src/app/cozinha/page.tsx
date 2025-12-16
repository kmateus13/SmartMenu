"use client"
import Header from "@/components/Header/Header";
import OrderBoard from "@/components/OrderBoard/OrderBoard";
import { OrderProvider } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/entities/Order";
import { useOrders } from "@/hook/useOrders";

import { Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";

import { AiOutlineClockCircle } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineRestaurantMenu } from "react-icons/md";

export default function Cozinha() {

    const { orders } = useOrders()
    


    const filterOrdersByStatus = (status: OrderStatus) => {
        return orders.filter((order) => order.status === status);
    };

    return (
        <main className=" min-h-screen overflow-x-hidden flex items-center flex-col">
            <Header title="Cozinha" description="Acompanhamento de pedidos" />
            <ScrollArea scrollbars="horizontal" >
                <Flex className="container flex-1 w-full h-auto gap-8 my-0 mx-auto">
                    <OrderBoard title="Na Fila" icon={<AiOutlineClockCircle />} orders={filterOrdersByStatus("WAITING")} />
                    <OrderBoard title="Preparando" icon={<MdOutlineRestaurantMenu />} orders={filterOrdersByStatus("IN_PRODUCTION")} />
                    <OrderBoard title="Pronto" icon={<IoMdCheckmarkCircleOutline />} orders={filterOrdersByStatus("READY")} />
                </Flex>
            </ScrollArea>
        </main>
    )
}