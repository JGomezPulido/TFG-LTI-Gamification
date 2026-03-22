import { useEffect } from "react";
import { useCourse } from "../../context/courseContext"
import { useNavigate } from "react-router-dom";
import { Card, Text, Flex, Grid, Strong, Button } from "@radix-ui/themes";

function User({user, index, onClick}){
    const navigate = useNavigate();
    var hideButton = false;
    function profile (user) {
        return navigate(`/profile/${user}`)
    }
    if(!onClick) {
        hideButton = true
        onClick = profile;
    }   
    return(
        <Card size="4">
           <Flex direction={"column"} align={"center"}>
                <Text size="5" > <Strong> {user.username} </Strong></Text>
                <Text>{user.email}</Text>
                <Button onClick={()=>profile(user._id)}>View</Button>
                {!hideButton &&
                <Button  onClick={()=>onClick(user._id)}>Award</Button>}
            </Flex>
        </Card>
    )
}
export default function UsersView({onClick}){
    const {course, userList, getUserList} = useCourse();

    useEffect( () => {
        getUserList(course.id);
    }, [])
    const users = userList?.map((user, index) => <User key={index} index={index} user={user} onClick={onClick}/>);
    return (
        <Grid columns={"3"} rows="repeat(2)" gap="3">
        
            {users}
        
        </Grid>
    )
}