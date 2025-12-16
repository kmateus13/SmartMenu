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
// REMOVIDO: import { createWebSocket, sendEvent } from "@/services/webSockect";
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
    // Nota: Certifique-se que sua lógica de ID da mesa está correta com a nova API
    const id = router.replace("/mesa/", "")

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await TableService.fetchTables()
                // Certifique-se que sua Entity Java "RestaurantTable" retorna esse campo qr_code_hash
                const filteredTable = response.filter((table: any) => table.qr_code_hash === id)

                if (filteredTable.length > 0) {
                    setTableId(filteredTable[0].id)
                }
            } catch (error) {
                console.error("Erro ao buscar mesas", error)
            }
        }

        fetchTables()
    }, [id])


    /* const handleCreateOrder = async () => {
        // Monta o objeto conforme o Java espera (OrderRequest DTO)
        const order: Omit<Order, "id"> = {
            orderItems: cart.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
            })),
            table_id: tableId,
        };

        try {
            // 1. Apenas chama a API REST (POST /orders)
            await OrderService.createOrder(order);
            
            // REMOVIDO: O Java já notifica o WebSocket automaticamente após salvar.
            // const socket = createWebSocket();
            // sendEvent(socket, "orders_update", order);

            clearCart();
            
            // Opcional: Adicionar um Toast/Alerta de sucesso aqui
            console.log("Pedido enviado com sucesso!");

        } catch (error) {
            console.error("Erro ao criar ordem:", error);
        }
    }; */

    const handleCreateOrder = async () => {
        // Validação básica
        if (!tableId || tableId === 0) {
            console.error("Mesa não identificada.");
            return;
        }

        // --- LIMPEZA DOS DADOS ---
        // Criamos um objeto novo, garantindo que NÃO vai nenhum lixo extra
        const orderPayload = {
            table_id: tableId,
            orderItems: cart.map((item) => {
                // TRUQUE: Garante que pega o ID, não importa a estrutura do seu carrinho
                // Às vezes o ID está em item.product_id, às vezes em item.product.id
                const realId = item.product_id || (item.product ? item.product.id : null);

                return {
                    product_id: realId,
                    quantity: item.quantity
                };
            }).filter(item => item.product_id !== null) // Remove itens sem ID (segurança extra)
        };

        console.log("JSON LIMPO PARA O JAVA:", JSON.stringify(orderPayload, null, 2));

        try {
            // Enviamos o payload limpo
            await OrderService.createOrder(orderPayload as any);

            clearCart();
            // Adicione um aviso visual para o usuário aqui se quiser
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
                            <Dialog.Close><Button onClick={clearCart} className="w-32" variant="soft" color="gray">Cancelar</Button></Dialog.Close>
                            {/* Adicionei validação extra: só envia se tiver mesa selecionada */}
                            <Button disabled={cart.length === 0 || tableId === 0} onClick={handleCreateOrder} className="w-32" color="red">Enviar</Button>
                        </Flex>
                    )}
                </Flex>

            </Dialog.Content>
        </Dialog.Root>
    );
}