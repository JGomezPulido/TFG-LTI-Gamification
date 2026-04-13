import { useEffect } from "react";
import { useCourse } from "../../context/courseContext"
import { useNavigate } from "react-router-dom";
import { Card, Text, Flex, Grid, Strong, Button } from "@radix-ui/themes";
import ItemCard from "../ItemCard";

function User({user, onClick}){
    const navigate = useNavigate();
    var hideButton = false;
    function profile (user) {
        return navigate(`/profile/${user}`)
    }
    if(!onClick) {
        hideButton = true
        onClick = profile;
    }   
    var texts = [{content: user.username, strong: true, size: "4"},
                {content: user.email}
    ];

    var actions = [{title: "View", callback: ()=>profile(user._id), condition: true},
                   {title: "Award", callback: ()=>onClick(user._id), condition: !hideButton}
    ];
    return(
        <ItemCard text={texts} actions={actions} image={null}/>
    )
}
export default function UsersView({onClick}){
    const {course, userList, getUserList} = useCourse();

    useEffect( () => {
        getUserList(course.id);
    }, [])
    const users = userList?.map((user, index) => <User key={index} user={user} onClick={onClick}/>);
    return (
        <Grid columns={"3"} rows="repeat(2)" gap="3">
        
            {users}
        
        </Grid>
    )
}