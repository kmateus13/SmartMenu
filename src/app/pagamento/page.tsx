"use client"
import Header from "@/components/Header/Header";
import { Table } from "@/entities/Table";
import { useOrders } from "@/hook/useOrders";
import { TableService } from "@/services/tablesService";
import { Box, Button, Heading } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Payment() {

  const [tables, setTables] = useState<Table[]>([])
  const { orders } = useOrders()

  useEffect(() => {
    const fetchTables = async () => {
      const response = await TableService.fetchTables()
      setTables(response)
    }

    fetchTables()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100">
      <Header title="Pagamento" description="Selecione a Mesa para Pagamento" />
      <Box className="container pt-10 mx-auto">
        <Heading as="h1" className="text-3xl font-bold text-center mb-8">Selecione a Mesa para Pagamento</Heading>
        <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tables.map((table) => {
            const hasReadyOrder = orders.some((order) => order.table_id === table.id && order.status === "READY");
            return (
              <Link href={`/pagamento/${table.id}`} key={table.id}>
                <Button
                  className="w-full h-24 text-xl"
                  disabled={!hasReadyOrder}
                >
                  Mesa {table.table_number}
                </Button>
              </Link>
            );
          })}
        </Box>
      </Box>
    </main>
  );
}