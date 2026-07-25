import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"
import { useEffect, useState} from "react";
import { Button, Flex, Grid } from "@radix-ui/themes";
import { useInventory } from "../../context/inventoryContext";
import {PlusIcon} from "@radix-ui/react-icons"
import ItemCard from "../ItemCard";
import {Pagination} from "../Pagination"

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
    const [name, setName] = useState("");
    const navigate = useNavigate();
    function createItem(){
        navigate(`item/create`);
    }

    useEffect( () => {
        getAllItems({page, count: pageSize});
    }, []);

    useEffect(() => {
        console.log(page, totalPages)
    }, [page, totalPages])

    function searchItem (evt){
        getAllItems({page: 1, count: pageSize, name: evt.target.value});
        setName(evt.target.value);
    }
    function setPage(page) {
        getAllItems({page, count: pageSize, name: name});
    }
    var itemsList = null;
    
    if(items && Array.isArray(items)) itemsList = items.map( (item, id) => <Item key={id} item={item} navigate={navigate}/>);
    
    return (
        <Flex direction={"column"} gap={"3"} align={"center"}>
            <input onChange={searchItem} placeholder="Search..."></input>
            <Grid columns={"3"} gap="3" width={"auto"}>
                {itemsList}
            </Grid>
        <Pagination page={page} count={totalPages} onPageChange={setPage}/>
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