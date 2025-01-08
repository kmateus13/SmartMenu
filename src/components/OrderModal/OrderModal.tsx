import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import CardCart from "../CardCart/CardCart";
import { Order, OrderStatus } from "@/entities/Order";
import { OrderItem } from "@/entities/OrderItem";
import { OrderService } from "@/services/ordersService";
import { useOrders } from "@/hook/useOrders";
import { useEffect, useState } from "react";
import { TableService } from "@/services/tablesService";

interface OrderModalProps {
    order: Order
}

export default function OrderModal({ order }: OrderModalProps) {

    const {handleUpdateStatus} =useOrders()
    const [tableNumber, setTableNumber] = useState(0)

    useEffect(() => {
        const fetchTables = async () => {
          const response =  await TableService.fetchTables()
          const filteredTable = response.filter((table) => table.id === order.table_id)
          setTableNumber(filteredTable[0].table_number)
        }

        fetchTables()
    }, [])
    
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
        <Dialog.Root>
            <Dialog.Trigger>
                <Button color="red" className="w-full h-20">Mesa N° {tableNumber}</Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Pedido N° {order.id}</Dialog.Title>

                <Flex direction={"column"}>
                    <Text >Status do Pedido:</Text>
                    <Text weight={"bold"}>{status(order.status!)}</Text>
                </Flex>

                <Flex direction={"column"} mt={"2"} gap={"2"}>
                    <Text size={"2"}>Itens</Text>
                    <Flex direction={"column"} gap={"1"}>
                        {order.orderItems.map((orderItem) => (
                            <CardCart key={orderItem.id} orderItem={orderItem as OrderItem} />
                        ))}
                    </Flex>
                </Flex>
                <Flex className="w-full justify-between my-5">
                    <Text >Total:</Text>
                    <Text size={"4"} weight={"bold"}>R$ {order.orderItems.reduce((total, item) => total + item.product!.price * item.quantity!, 0).toFixed(2).replace(".", ",")}</Text>
                </Flex>
                <Flex className="w-full justify-end gap-4">
                    <Dialog.Close>
                        <Button color="gray" variant="soft">Cancelar Pedido</Button>
                    </Dialog.Close>
                    {order.status !== "READY" &&
                        <Dialog.Close>
                            <Button color="red" onClick={() => handleUpdateStatus([order.id], order.status as OrderStatus,) } >
                                {order.status === "WAITING" ? "Preparar Pedido" : "Finalizar Pedido"}
                            </Button>
                        </Dialog.Close>
                    }

                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}