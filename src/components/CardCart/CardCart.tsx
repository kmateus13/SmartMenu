import { OrderItem } from "@/entities/OrderItem";
import { Product } from "@/entities/Products";
import { useCart } from "@/hook/useCart";
import { Box, Card, Flex, Inset, Text } from "@radix-ui/themes";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa";

interface CardCartProps {
    isCart?: boolean
    orderItem: OrderItem
}

export default function CardCart({ isCart, orderItem }: CardCartProps) {

    console.log(orderItem)

    const { updateQuantity } = useCart()

    return (
        <Box className="w-full " >
            <Card className="flex h-20">
                <Inset clip="padding-box" side="left" pr="current"  className="w-32 h-20" >
                    {/* <img
                        src={orderItem.product.image_URL}
                        alt="Bold typography"
                        style={{
                            display: "block",
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "var(--gray-5)",
                        }}
                    /> */}
                    <Flex className="w-full h-full">
                        <Image src={orderItem.product.image_URL} alt="Product Image" width={112} height={80}  />
                    </Flex>
                </Inset>
                <Flex gap={"3"}>
                    <Flex>
                        <Text size="2" weight={"light"} >{orderItem.quantity}x</Text>
                    </Flex>
                    <Flex direction="column" gap={"1"} className="w-32">
                        <Text size="2" weight={"bold"} >
                            {orderItem.product.name}
                        </Text>
                        <Text as="p" size={"2"} weight={"regular"}>R$ {(orderItem.product.price * orderItem.quantity).toFixed(2).replace(".", ",")}</Text>
                    </Flex>

                    {isCart &&
                        <Flex className="gap-2 h-full items-center">
                            <Box onClick={() => updateQuantity(orderItem.id, "decrement")} className=" h-5 w-5 cursor-pointer  flex items-center justify-center rounded-full text-white  bg-red-500"><FaMinus /></Box>
                            <Box onClick={() => updateQuantity(orderItem.id, "increment")} className=" h-5 w-5 cursor-pointer   flex items-center justify-center rounded-full text-white  bg-red-500"><FaPlus /></Box>
                        </Flex>
                    }


                </Flex>



            </Card>
        </Box>
    );
}