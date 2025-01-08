
import { Flex, Text } from "@radix-ui/themes";
import OrderModal from "../OrderModal/OrderModal";
import { Order } from "@/entities/Order";

interface OrderBoardProps {
    icon: React.ReactElement
    title: string
    orders: Order[]
}

export default function OrderBoard({icon, title, orders}: OrderBoardProps) {
    return (
        <Flex className="min-w-[235px] flex-1 flex-col items-center gap-6 p-4 my-10 mx-auto rounded-lg border">
            <Flex align={"center"} gap={"2"}>
                {icon}
                <Text as="p" size={"4"} weight={"bold"}>{title}</Text>
                <Text as="p" size={"1"}>({orders.length})</Text>
            </Flex>
            <Flex direction={"column"} gap={"2"} className="w-full">
                {orders.map((order) => (
                    <OrderModal key={order.id} order={order} />))}
                
            </Flex>
        </Flex>
    );
}