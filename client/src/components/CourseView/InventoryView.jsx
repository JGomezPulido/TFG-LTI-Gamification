import { useNavigate } from "react-router-dom";
import { useEffect} from "react";
import { useAuth } from "../../context/authContext";
import { Flex, Grid } from "@radix-ui/themes";
import { useInventory } from "../../context/inventoryContext";
import ItemCard from "../ItemCard";

function Item({item, navigate}){
    async function onClick() {
        navigate(`item/${item._id}`);
    }
    var texts = [{content: item.item.name, size: "3", strong: true},
                 {content: `Quantity: ${item.count}`, size: "1"}]

    var actions = [{title: "View Details", callback: onClick, condition: true}]
    return (
        <ItemCard image={null} text={texts} actions={actions} />
    )
}
export default function InventoryView(){
    const {user} = useAuth();
    const {getInventory, inventory} = useInventory();
    
    const navigate = useNavigate();
    useEffect( () => {
        getInventory(user.id);
    }, [])
    var itemsList = null;
    
    if(inventory && Array.isArray(inventory)) itemsList = inventory.map( (item, id) => <Item key={id} item={item} navigate={navigate}/>);

   console.log(inventory);
    return (
        <Flex direction={"row"} gap={"3"} align={"center"}>
            <Grid columns={"3"} gap="3" rows="repeat(2)" width={"auto"}>
                {itemsList}
            </Grid>
        </Flex>
    );
}