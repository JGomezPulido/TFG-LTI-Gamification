import { useEffect } from "react";
import { useBadges } from "../../context/badgeContext"
import { useNavigate } from "react-router-dom";
import { Grid, Card, Flex, Strong, Button, Text } from "@radix-ui/themes";
import ItemCard from "../ItemCard";
function Badge({badge, navigate}){
    async function onClick() {
        navigate(`badge/${badge._id}`);
    }
    var texts = [{content: badge.name, strong: true, size: "4"},
                 {content: badge.description, size: "2"},
    ]

    var actions = [{title: "View Details", callBack: onClick, condition: true}];
    return (
        <ItemCard text={texts} actions={actions}/>
    )
}

export default function AssertionsView({course}){
    const {getAssertions, assertions} = useBadges();
    const navigate = useNavigate();
    useEffect(() => {
        getAssertions();
    }, [])
    var assertionList = null;
    if(assertions && Array.isArray(assertions)) assertionList = assertions.map( (assertion, id) => <Badge key={id} badge={assertion} navigate={navigate}/>);
    return (
        <Grid columns={"3"} rows="repeat(2)" gap="3">
            {assertionList}
        </Grid>
    )
}