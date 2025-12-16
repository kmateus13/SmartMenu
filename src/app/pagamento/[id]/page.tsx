"use client"
import Header from "@/components/Header/Header";
import InvoiceModal from "@/components/InvoiceModal/InvoiceModal";
import { useOrders } from "@/hook/useOrders";
import { Button, Flex, Radio, RadioGroup, Separator } from "@radix-ui/themes";
import { usePathname } from "next/navigation";

export default function InfoTable() {

    const { orders, handleUpdateStatus } = useOrders()
    const router = usePathname()
    const id = router.replace("/pagamento/", "")

    const filteredTable = orders.filter((order) => order.table_id === +id && order.status === "READY")
    const totalPerOrder = filteredTable.map((order) => order.orderItems.reduce((total, item) => total + item.product!.price * item.quantity!, 0).toFixed(2))

    console.log(filteredTable)

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



    const handleUpdate = async () => {
        let ids: number[] = []
        try {
            filteredTable.map(async (order) => {
                ids.push(order.id)
            })

            if (ids.length > 0) {
                await handleUpdateStatus(ids, "READY")
            }

        } catch (error) {
            console.error("Erro ao atualizar ordens:", error);
        }
        // try {
        //     for (const order of filteredTable) {
        //         await handleUpdateStatus(order.id, order.status!); // Aguarda cada atualização antes de prosseguir
        //     }
        // } catch (error) {
        //     console.error("Erro ao atualizar ordens:", error);
        // }
    };

    return (
        <main className="flex min-h-screen flex-col">
            <Header description="Pagamento" title={`Mesa ${id}`} />
            <div className="flex-grow bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left column: Order summary */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-semibold mb-4">Resumo dos Pedidos</h2>
                            {filteredTable.map((order, orderIndex) => (
                                <div key={order.id} className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Pedido #{orderIndex + 1}</h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Feito em: {formartDate(order.createdAt!)}
                                    </p>
                                    <table className="w-full mb-2">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left pb-2">Item</th>
                                                <th className="text-center pb-2">Qtd</th>
                                                <th className="text-right pb-2">Preço</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems.map((item) => (
                                                <tr key={item.id} className="border-b last:border-b-0">
                                                    <td className="py-2">{item.product?.name}</td>
                                                    <td className="text-center py-2">{item.quantity}</td>
                                                    <td className="text-right py-2">R$ {(item.quantity! * item.product!.price).toFixed(2).replace(".", ",")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="text-right font-semibold">
                                        Subtotal: R$ {Number(totalPerOrder[orderIndex]).toFixed(2).replace(".", ",")}
                                    </div>
                                    {orderIndex < filteredTable.length - 1 && (
                                        <Separator orientation="horizontal" className="my-4 w-full" />
                                    )}
                                </div>

                            ))}

                            <div className="text-xl font-semibold text-right mt-4">
                                Total Geral: R$ {filteredTable.reduce((total, order) => total + order.orderItems.reduce((orderTotal, item) => orderTotal + item.product!.price * item.quantity!, 0), 0).toFixed(2).replace(".", ",")}
                            </div>

                        </div>


                        <div className="bg-white p-6 rounded-lg shadow h-56">
                            <h2 className="text-2xl font-semibold mb-4">Opções de Pagamento</h2>
                            <RadioGroup.Root defaultValue="card" className="mb-4" color="red">
                                <RadioGroup.Item value="card" className="mr-2">Cartão</RadioGroup.Item>
                                <RadioGroup.Item value="cash" className="mr-2">Dinheiro</RadioGroup.Item>
                            </RadioGroup.Root>
                            <Flex gap={"2"} >
                                <InvoiceModal orders={filteredTable} table={+id} time={new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} />
                                <Button onClick={handleUpdate}>Confirmar Pagamento</Button>
                            </Flex>
                            {/* <div className="mt-4 text-center text-gray-600">
                                Status: {filteredTable.every((order) => order.status !== "PAID") ? "Pendente" : "Pago"}
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}