import { useCourse } from "../context/courseContext"
import { Heading, Flex, ScrollArea } from "@radix-ui/themes";
import Link  from "./MyLink"
import "./nav.css"
import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";



export default function NavBar({children}){
    const {course, loading, loginCourse} = useCourse();
    const params = useParams();
    useEffect(() => {
        if(loading) loginCourse(params.course_id);
    },[])
    return (
        <Flex height={"100%"} minHeight={"0"} direction={"column"}>
            <Flex className={"title-bar"} m={"0"} p={"0"} direction={"row"} justify={"start"} align={"center"}  minHeight={"10%"}>
                <span style={{width: "var(--nav-sidebar-width)"}}></span>
                <Flex align={"center"} justify={"center"} minWidth={"0"} width={"100%"}>
                    <Heading as={"h1"} size={"6"}>Curso</Heading>
                </Flex>
            </Flex>
            <Flex direction={"row"} m={"0"} p={"0"} height={"100%"} minHeight={"0"} align={"stretch"} justify={"stretch"} flexGrow={"1"}>
                <Flex p={"0"} m={"0"} px="5" className={"navigation"} width="var(--nav-sidebar-width)"  direction={"column"} align={"start"} justify={"stretch"} gapY={"4"} height={"100%"} overflow={"clip"}>
                    <Link to='dashboard'>  Dash         </Link>
                    <Link to="badges">     Badges       </Link>
                    <Link to="items">      Objetos      </Link>
                    <Link to="inventory">  Inventario   </Link>
                    <Link to="assertions"> Mis Insignias</Link>
                    <Link to="missions">   Misiones     </Link>
                </Flex>
                <ScrollArea>
                        <Flex py="5" align="start" justify="center" height={"100%"} minHeight={"0"} minWidth={"0"}>
                            <Outlet/>
                        </Flex>
                </ScrollArea>
            </Flex>
        </Flex>
    )
}