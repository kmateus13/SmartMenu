import { Product } from "@/entities/Products";
import { useCart } from "@/hook/useCart";
import { Box, Card, Flex, Inset, Text } from "@radix-ui/themes";
import { FaPlus } from "react-icons/fa";

interface ModelCardProps {
    product: Product; 
}

export default function ModelCard({product}:ModelCardProps) {


    const { addToCart } = useCart()


    return (
        <Box className="w-full  sm:w-[370px] " >
            <Card size="1" className="flex h-[112px]">
                <Inset clip="padding-box" side="left" pr="current" className="max-w-[130px]" >
                    <img
                        src={product.image_URL}
                        alt="Bold typography"
                        style={{
                            display: "block",
                            objectFit: "cover",
                            width: 200,
                            height: "100%",
                            backgroundColor: "var(--gray-5)",
                        }}
                    />
                </Inset>
                <Flex direction="column">
                    <Text size="3" weight={"bold"} >
                       {product.name}
                    </Text>
                    <Text as="p" size={"2"}>{product.description}</Text>
                    <Text as="p" weight={"bold"}>R$ {product.price.toString().replace(".", ",")}</Text>
                </Flex>


                <Box onClick={() => addToCart(product)} className=" h-6 w-6 cursor-pointer absolute right-3 bottom-2 flex items-center justify-center rounded-full text-white  bg-red-500"><FaPlus /></Box>
            </Card>
        </Box>

    );
}