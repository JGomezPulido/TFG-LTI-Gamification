import { useCourse } from "../context/courseContext"
import { Heading, Flex, Text, Button, Dialog, Link } from "@radix-ui/themes";
import "../nav.css"

export default function NavBar({children}){
    const {course, loading} = useCourse();

    return (
        <Flex p={"0"} m={"0"} direction={"column"} justify={"stretch"} align={"stretch"} minHeight={"100vh"}>
            <Flex className={"title-bar"} m={"0"} p={"0"} direction={"row"} justify={"center"} align={"center"} flexShrink={"0"} minHeight={"10vh"}
            height="100%">
                <Heading as={"h1"} size={"6"}>Curso</Heading>
            </Flex>
            <Flex direction={"row"} m={"0"} p="0" minHeight={"100%"} height="100%" align={"stretch"} justify={"stretch"} flexGrow={1} flexShrink={"0"}>
                <Flex p={"0"} m={"0"} className={"navigation"}  minWidth={"15vw"} maxWidth={"20vw"} direction={"column"}  align={"center"} justify={"stretch"} gapY={"4"} flexShrink={"0"}>
                    <Link href='/dashboard'>Dash</Link>
                    <Link href='/'>Landing</Link>
                    <Text>Insignias</Text>
                    <Text>Objetos</Text>
                    <Text>Usuarios</Text>
                </Flex>
                <Flex  flexGrow="1" justify="center" pt="4" justifySelf={"center"}>
                        {children}
                </Flex>
            </Flex>
        </Flex>
    )
}