"use client";
import { Box, Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { FaShoppingCart } from "react-icons/fa";
import CardCart from "../CardCart/CardCart";
import CartContent from "../CartContent/CartContent";
import OrderContent from "../OrderContent/OrderContent";
import { ReactElement, useEffect, useState } from "react";
import { OrderService } from "@/services/ordersService";
import { useCart } from "@/hook/useCart";
import { Order } from "@/entities/Order";
import { usePathname } from "next/navigation";
import { TableService } from "@/services/tablesService";
import { createWebSocket, sendEvent } from "@/services/webSockect";
import { Badge } from "@mui/material";



interface SidebarProps {
    styleButton: ReactElement
    name: string
    iconName: ReactElement
    isOrder?: boolean
}


export default function Sidebar(props: SidebarProps) {

    const [tableId, setTableId] = useState(0)
    const { cart, clearCart } = useCart()
    const router = usePathname()
    const id = router.replace("/mesa/", "")

    useEffect(() => {
        const fetchTables = async () => {
            const response = await TableService.fetchTables()
            const filteredTable = response.filter((table) => table.qr_code_hash === id)
            setTableId(filteredTable[0].id)
            console.log(tableId)
        }

        fetchTables()
    }, [])


    const handleCreateOrder = async () => {


        const order: Omit<Order, "id"> = {
            orderItems: cart.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
            })),
            table_id: tableId,
        };

        try {
            const response = await OrderService.createOrder(order);
            const socket = createWebSocket();
            sendEvent(socket, "orders_update", order);
            clearCart()
        } catch (error) {
            console.error("Erro ao criar ordem:", error);
        }
    };


    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {!props.isOrder ?
                    <Badge color="success" badgeContent={cart.length} >
                        {props.styleButton}
                    </Badge> :
                    props.styleButton
                }
            </Dialog.Trigger>
            <Dialog.Content className="fixed overflow-hidden top-0 right-0 w-[400px]  lg:w-[400px] rounded-none rounded-s-2xl h-dvh ">
                <Dialog.Title>
                    <Flex gap={"2"}>
                        {props.iconName}
                        {props.name}
                    </Flex>
                </Dialog.Title>


                {props.isOrder ? <OrderContent idTable={tableId} /> : <CartContent />}

                <Flex className="w-full  absolute items-center bottom-6  ">
                    {props.isOrder ? (
                        <Flex className="w-full items-center pr-16  gap-6 justify-end">
                            <Dialog.Close><Button className="w-full " variant="soft" color="gray">Fechar</Button></Dialog.Close>
                        </Flex>
                    ) : (
                        <Flex className="w-full items-center pr-16  gap-6 justify-end">
                            <Dialog.Close><Button onClick={ clearCart} className="w-32" variant="soft" color="gray">Cancelar</Button></Dialog.Close>
                            <Button disabled={cart.length === 0} onClick={handleCreateOrder} className="w-32" color="red">Enviar</Button>
                        </Flex>
                    )}
                </Flex>

            </Dialog.Content>
        </Dialog.Root>
    );
}