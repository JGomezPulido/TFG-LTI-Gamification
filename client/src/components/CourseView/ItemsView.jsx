import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"
import { useEffect} from "react";

import { Button, Flex, Text, Card, Grid, Strong } from "@radix-ui/themes";
import { useInventory } from "../../context/inventoryContext";

function Item({item, navigate}){
    async function onClick() {
        navigate(`item/${item._id}`);
    }
    return (
   
        <Card size="4"
        p="1">
            <Flex direction={"column"} gap="2" align={"center"}>
                <Text size="3"><Strong>{item.name}</Strong></Text>
                <Flex direction={"row"}>
                    <Button onClick={onClick}>View Details</Button>
                </Flex>
            </Flex>
        </Card>
    )
}
export default function ItemsView(){
    const { role} = useCourse();
    const {getAllItems, items} = useInventory();
    
    const navigate = useNavigate();
    function createItem(){
        navigate(`item/create`);
    }
    useEffect( () => {
        getAllItems();
    }, [])
    var itemsList = null;
    
    if(items && Array.isArray(items)) itemsList = items.map( (item, id) => <Item key={id} item={item} navigate={navigate}/>);
   
    return (
        <Flex direction={"row"} gap={"3"} align={"center"}>
            <Grid columns={"3"} gap="3" rows="repeat(2)" width={"auto"}>
                {itemsList}
            </Grid>
            {role ==="Instructor" && 
            <Button
                className="FloatingButton"
                variant="classic"
                color="green"
                radius="full"
                
                onClick={createItem}>
                    <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Button>}

        </Flex>
    )
}