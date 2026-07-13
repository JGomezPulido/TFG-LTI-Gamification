import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"
import { useEffect} from "react";
import { Button, Flex, Grid } from "@radix-ui/themes";
import { useInventory } from "../../context/inventoryContext";
import {PlusIcon} from "@radix-ui/react-icons"
import ItemCard from "../ItemCard";

function Item({item, navigate}){
    async function onClick() {
        navigate(`item/${item._id}`);
    }
    var texts = [{content: item.name, size: "3", strong: true}];
    var actions= [{title: "View Details", callback: onClick, condition: true}];
    return (<ItemCard text={texts} actions={actions} image={null}/>);
}

export default function ItemsView(){
    const { role} = useCourse();
    const {getAllItems, items, page, pageSize, totalPages} = useInventory();
    
    const navigate = useNavigate();
    function createItem(){
        navigate(`item/create`);
    }

    useEffect( () => {
        console.log(page, pageSize)
        getAllItems({page, count: pageSize});
    }, []);

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
                    <PlusIcon width="30" height="30" />
            </Button>}

        </Flex>
    );
}