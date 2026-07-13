import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"
import { useEffect} from "react";
import { useBadges } from "../../context/badgeContext";
import { Button, Flex, Grid} from "@radix-ui/themes";
import ItemCard from "../ItemCard";
import { PlusIcon } from "@radix-ui/react-icons";

function Badge({badge, nav}){
    var text = [{content: badge.name, strong: true, size: "4"},
                {content: badge.description, size: "2"}];
                
    var actions = [{title: "View Details", callback: ()=>nav(`badge/${badge._id}`), condition: true}];
    return <ItemCard image={null} text={text} actions={actions}></ItemCard>
}

export default function BadgeView(){
    const { role} = useCourse();
    const { getBadges, badges } = useBadges();
    
    const navigate = useNavigate();
    function createBadge(){
        navigate(`badge/create`);
    }
    useEffect( () => {
        getBadges();
    }, []);
    var badgesList = null;
    
    if(badges && Array.isArray(badges)) badgesList = badges.map( (badge, id) => {
        return <Badge key={id} badge={badge} nav={navigate}/>
    });
    
    return (
        <Flex direction={"row"} gap={"3"} align={"center"}>
            <Grid columns={"3"} gap="3" rows="repeat(2)" width={"auto"}>
                {badgesList}
            </Grid>
            {role ==="Instructor" && 
            <Button
                className="FloatingButton"
                variant="classic"
                color="green"
                radius="full"
                
                onClick={createBadge}>
                   <PlusIcon width={"30"} height={"30"}/>
            </Button>}

        </Flex>
    )
}