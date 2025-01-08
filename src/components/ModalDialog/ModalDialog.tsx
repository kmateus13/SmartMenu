import { Button, Dialog, Flex } from "@radix-ui/themes";
import { FaUserTie } from "react-icons/fa";


export default function ModalDialog() {



    
    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <li className="h-full flex  flex-1 items-center justify-center gap-1  cursor-pointer"><FaUserTie />Chamar Garcom</li>
            </Dialog.Trigger>
            <Dialog.Content className="w-[400px]" >
                <Dialog.Title>Chamar Garcom</Dialog.Title>
                <Dialog.Description>Tem certeza que deseja chamar o garcom?</Dialog.Description>
                <Flex mt={"6"} justify="end" gap={"2"}>
                    <Dialog.Close>
                        <Button color="gray" variant="soft" >Cencelar</Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button color="red">Chamar</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>

        </Dialog.Root>
    );
}