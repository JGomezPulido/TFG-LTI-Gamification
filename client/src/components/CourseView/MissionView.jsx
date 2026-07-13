import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"
import { useEffect} from "react";
import { Button, Flex, Grid } from "@radix-ui/themes";
import { useMissions } from "../../context/missionContext";
import {PlusIcon} from "@radix-ui/react-icons"
import ItemCard from "../ItemCard";

function Mission({mission, enableMission, navigate}){
    async function onClick() {
        navigate(`mission/${mission._id}`);
    }
    var texts = [{content: mission.name, size: "3", strong: true}, {content: mission.enabled ?"Enabled":"Disabled", size: "2", strong: true}];
    var actions= [
        {title: "View Details", callback: onClick, condition: true},
        {title: !mission.enabled ? "Enable" : "Disable", callback: ()=>enableMission(mission._id), condition:true}
    ];
    return (<ItemCard text={texts} actions={actions} image={null}/>);
}

export default function MissionView(){
    const { role} = useCourse();
    const {getAllMissions, enableMission, missions} = useMissions();
    const navigate = useNavigate();
    function createItem(){
        navigate(`mission/create`);
    }

    useEffect( () => {
        getAllMissions();
    }, []);

    var itemsList = null;
    
    if(missions && Array.isArray(missions)) itemsList = missions.map( (item, id) => <Mission key={id} mission={item} navigate={navigate} enableMission={enableMission}/>);
    
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