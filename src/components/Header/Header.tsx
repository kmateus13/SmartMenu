"use client";
import { FaShoppingCart } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import { Box, Flex } from "@radix-ui/themes";

interface HeaderProps {
    title: string
    description: string
    isMenu?: boolean
}

export default function Header(props: HeaderProps) {
    return (
        <header className="w-full h-28 bg-red-500 flex justify-center">
            <Flex className=" container h-full items-center justify-between px-6">
                <Box>
                    <h4 className="font-medium">{props.description}</h4>
                    <h1 className="text-3xl font-black uppercase text-white">{props.title}</h1>
                </Box>
                {props.isMenu && (
                    
                    <Box className="cursor-pointer">
                        <Sidebar name="Carrinho" iconName={<FaShoppingCart />} styleButton={<FaShoppingCart size={30} color="white" />} />
                    </Box>
                )}

            </Flex>
        </header>

    );
}

