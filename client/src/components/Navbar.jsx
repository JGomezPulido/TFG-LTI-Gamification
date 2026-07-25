import { useCourse } from "../context/courseContext"
import { Heading, Flex, Text, Button, Dialog, Link, Box } from "@radix-ui/themes";
import "../nav.css"


export default function NavBar({children}){
    const {course, loading} = useCourse();

    return (
        <Flex height={"100%"} minHeight={"0"} direction={"column"}>
            <Flex className={"title-bar"} m={"0"} p={"0"} direction={"row"} justify={"center"} align={"center"}  minHeight={"10%"}>
                <Heading as={"h1"} size={"6"}>Curso</Heading>
            </Flex>
            <Flex direction={"row"} m={"0"} p={"0"} height={"100%"} minHeight={"0"} align={"stretch"} justify={"stretch"} flexGrow={"1"}>
                <Flex p={"0"} m={"0"} className={"navigation"}  minWidth={"15vw"} maxWidth={"20vw"} direction={"column"} align={"center"} justify={"stretch"} gapY={"4"} flexShrink={"0"} height={"100%"}>
                    <Link href='/dashboard'>Dash</Link>
                    <Link href='/'>Landing</Link>
                    <Text>Insignias</Text>
                    <Text>Objetos</Text>
                    <Text>Usuarios</Text>
                </Flex>
                <Flex flexGrow={"1"} justify={"center"} pt={"4"} justifySelf={"center"} overflowY={"auto"} minHeight={"0"}>
                        {children}
                </Flex>
            </Flex>
        </Flex>
    )
}