"use client"
import Buttons from "@/components/Buttons/Buttons";
import ModelCard from "@/components/ModelCard/ModelCard";
import Categories from "@/components/Categories/Categories";
import Header from "@/components/Header/Header";
import { Flex, Heading, ScrollArea } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Product } from "@/entities/Products";
import { ProductService } from "@/services/productsService";
import { CartContextProvider } from "@/contexts/CartContext";
import { usePathname } from "next/navigation";
import { TableService } from "@/services/tablesService";



export default function mesa({ params }: { params: { id: string } }) {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
    const [tableExists, setTableExists] = useState<boolean>(false);


    const router = usePathname()
    const id = router.replace("/mesa/", "")

    useEffect(() => {
        const fetchTables = async () => {
          const response =  await TableService.fetchTables()
          const filteredTable = response.some((table) => table.qr_code_hash === id)
        //   const filteredTable = response.findIndex((table) => table.qr_code_hash === id)
          setTableExists(filteredTable)
        }

        fetchTables()
    }, [])


    useEffect(() => {
        async function fetchProduct() {
            try {
                if (selectedCategory === null || selectedCategory === 1) {
                    const fetchedProduct = await ProductService.fetchProducts();
                    setProducts(fetchedProduct);
                } else {
                    const fetchedProduct = await ProductService.fetchProducts(selectedCategory)
                    setProducts(fetchedProduct);
                }

            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [selectedCategory]);



    

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!tableExists) {
        return <p>Esta pagina nao existe!</p>;
    }

    return (
        <CartContextProvider>
            <main className=" relative w-screen h-screen  flex items-center flex-col">
                <Header isMenu description="Bem vindo(a) ao" title="Cardápio" />
                <div className=" container " >
                    <Categories onSelectedCategory={(categoryId) => setSelectedCategory(categoryId)} />
                    <section className="h- px-4" style={{height: "calc(100vh - 300px)"}}>
                        <Heading as="h2">Todos os produtos</Heading>
                        <ScrollArea className="h-full mt-1" scrollbars="vertical" type="hover"  >
                            <Flex className="flex-col lg:flex-row lg:flex-wrap" gap='2'>
                                {products.map((product) => (
                                    <ModelCard product={product} key={product.id} />
                                ))}
                            </Flex>
                        </ScrollArea>
                    </section>
                    <Buttons />
                </div>
            </main>
        </CartContextProvider>

    );
}