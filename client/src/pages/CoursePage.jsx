import { useEffect, useState } from "react";
import { useCourse } from "../context/courseContext";
import UsersView from "../components/CourseView/UserView";
import BadgeView from "../components/CourseView/BadgeView";
import AssertionsView from "../components/CourseView/AssertionView";
import { useParams } from "react-router-dom";
import { Box, Button, Container, Flex, Tabs, Text } from "@radix-ui/themes";


function Render(state, course){
    if (state === "Users"){
        return <UsersView />
    } 
    else if (state === "Badges"){
        return <BadgeView />
    }
    else if(state === "Awarded"){
        return <AssertionsView />
    }
}

export default function CoursePage (){
    const {role, course, loading, loginCourse} = useCourse();
    const params = useParams();
    useEffect(() => {
        if(loading) loginCourse(params.course_id);
    }, []);
    if(loading) {
       
        return <div> Loading... </div>;
    }
    return(
        <Flex direction="column" gap="3" justify="between" align="center">
            <Text size="5"> Curso: {course.name} </Text>
            <Tabs.Root defaultValue="users">
                <Tabs.List mb="3" justify={"center"}>
                    <Tabs.Trigger value="users">Users</Tabs.Trigger>
                    <Tabs.Trigger value="badges">Badges</Tabs.Trigger>
                    <Tabs.Trigger value="assertions">Assertions</Tabs.Trigger>
                </Tabs.List>
                <Flex width={"80vw"} maxWidth={"80vw"} justify={"center"} align={"center"} mx="10">
                    <Tabs.Content value="users"> <UsersView/> </Tabs.Content>
                    <Tabs.Content value="badges"> <BadgeView/> </Tabs.Content>
                    <Tabs.Content value="assertions"> <AssertionsView/> </Tabs.Content>
                </Flex>
            </Tabs.Root>
        </Flex>
    )
}