import { useEffect } from "react";
import { useBadges } from "../../context/badgeContext"
import { useNavigate } from "react-router-dom";
import { Grid, Card, Flex, Strong, Button, Text } from "@radix-ui/themes";
function Badge({badge, navigate}){
    async function onClick() {
        navigate(`badge/${badge._id}`);
    }
    return (
    <Card size="4"
    p="1">
        <Flex direction={"column"} gap="2" align={"center"}>
            <Text size="3"><Strong>{badge.name}</Strong></Text>
            <Text size="2">{badge.description}</Text>
            <Flex direction={"row"}>
                <Button onClick={onClick}>View Details</Button>
            </Flex>
        </Flex>
    </Card>
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