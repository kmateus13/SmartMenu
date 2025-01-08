import { Order } from "@/entities/Order";
import { useOrders } from "@/hook/useOrders";
import { OrderService } from "@/services/ordersService";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useRef } from "react";


interface ModalProps {
    orders: Order[]
    table: number
    time: string
}

export default function InvoiceModal({ orders, table, time }: ModalProps) {
    const receiptRef = useRef<HTMLDivElement>(null)
    const {handleUpdateStatus} =useOrders()

    const totalPrice = orders.reduce((total, order) => total + order.orderItems.reduce((orderTotal, item) => orderTotal + item.product!.price * item.quantity!, 0), 0).toFixed(2)
    console.log(totalPrice)
    const handlePrint = () => {
        if (receiptRef.current) {
            const printWindow = window.open('', '_blank')
            if (printWindow) {
                printWindow.document.write('<html><head><title>Cupom Não Fiscal</title>')
                printWindow.document.write('<style>')
                printWindow.document.write(`
              body { font-family: monospace; }
              .receipt { white-space: pre-wrap; padding: 20px; }
            `)
                printWindow.document.write('</style></head><body>')
                printWindow.document.write('<div class="receipt">')
                printWindow.document.write(receiptRef.current.innerText)
                printWindow.document.write('</div></body></html>')
                printWindow.document.close()
                printWindow.print()
            }
        }

       
        
    }

    const formartDate = (date: string) => {
        const newDate = new Date(date)
        return newDate.toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }



    console.log(orders)





    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button color="red" onClick={handlePrint}>Imprimir Pedido</Button>
            </Dialog.Trigger>
            <Dialog.Content className="w-[400px]">
                <Dialog.Title className="text-lg font-semibold text-center mb-4">Cupom Não Fiscal</Dialog.Title>
                <div ref={receiptRef} className="font-mono text-sm whitespace-pre-wrap">
                    {`
=====================================
      RESTAURANTE DELÍCIA
      CNPJ: 00.000.000/0001-00
=====================================

Mesa: ${table}
Data: ${time}
${orders.map((order, index) => `
-------------------------------------
Pedido #${index + 1}
Feito em: ${formartDate(order.createdAt!)}
-------------------------------------
ITEM              QTD     VALOR
-------------------------------------
${order.orderItems.map(item =>
                        `${item.product!.name.padEnd(15)} ${item.quantity!.toString().padStart(3)}    R$ ${(item.quantity! * item.product!.price).toFixed(2).padStart(6)}`
                    ).join('\n')}
-------------------------------------
Subtotal:            R$ ${order.orderItems.reduce((sum, item) => sum + item.quantity! * item.product!.price, 0).toFixed(2)}
`).join('\n')}
-------------------------------------
TOTAL GERAL:         R$ ${Number(totalPrice).toFixed(2)}
=====================================

     Obrigado pela preferência!
       Volte sempre :)
`}
                </div>
                <Flex className="w-full justify-around mt-6 ">
                    <Button onClick={handlePrint} color="red" className="cursor-pointer">Imprimir</Button>
                    <Dialog.Close>
                        <Button color="gray" variant="soft" className="cursor-pointer">Fechar</Button>
                    </Dialog.Close>
                </Flex>

            </Dialog.Content>

        </Dialog.Root>
    );
}