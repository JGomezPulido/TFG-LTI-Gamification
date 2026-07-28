import { useCourse } from "../context/courseContext"
import { Heading, Flex, Text, Button, Dialog, Box, ScrollArea } from "@radix-ui/themes";
import Link  from "./MyLink"
import "./nav.css"
import { Outlet } from "react-router-dom";


export default function NavBar({children}){
    //const {course, loading} = useCourse();

    return (
        <Flex height={"100%"} minHeight={"0"} direction={"column"}>
            <Flex className={"title-bar"} m={"0"} p={"0"} direction={"row"} justify={"center"} align={"center"}  minHeight={"10%"}>
                <Heading as={"h1"} size={"6"}>Curso</Heading>
            </Flex>
            <Flex direction={"row"} m={"0"} p={"0"} height={"100%"} minHeight={"0"} align={"stretch"} justify={"stretch"} flexGrow={"1"}>
                <Flex p={"0"} m={"0"} px="5" className={"navigation"}  minWidth={"15vw"} maxWidth={"20vw"} direction={"column"} align={"start"} justify={"stretch"} gapY={"4"} flexShrink={"0"} height={"100%"}>
                    <Link to='/dashboard'>  Dash         </Link>
                    <Link to="/badges">     Badges       </Link>
                    <Link to="/items">      Objetos      </Link>
                    <Link to="/inventory">  Inventario   </Link>
                    <Link to="/assertions"> Mis Insignias</Link>
                    <Link to="/missions">   Misiones     </Link>
                </Flex>
                <ScrollArea>
                        <Flex py="5" align="start" justify="center" height={"100%"} minHeight={"0"}>
                            <Outlet/>
                        </Flex>
                </ScrollArea>
            </Flex>
        </Flex>
    )
}