
import { Flex, Separator } from "@radix-ui/themes";

import { MdReceiptLong } from "react-icons/md";
import ModalDialog from "../ModalDialog/ModalDialog";
import Sidebar from "../Sidebar/Sidebar";

export default function Buttons() {
    return (
        <div className=" container absolute h-16 bg-gray-50 bottom-0 left-1/2 -translate-x-1/2 flex justify-center w-full gap-2">
            <ul className="flex w-full items-center">
                <Sidebar isOrder={true} name="Pedidos" iconName={<MdReceiptLong />} styleButton={<li className="h-full flex  flex-1 items-center justify-center gap-1 cursor-pointer"><MdReceiptLong />Pedidos</li>}/>
                <Separator orientation="vertical" decorative className="h-10" />
                <ModalDialog />
            </ul>
        </div>
    );
}