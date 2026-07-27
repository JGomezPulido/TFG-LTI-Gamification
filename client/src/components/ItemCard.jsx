import { Card, Strong, Text, Flex, Button, Box } from "@radix-ui/themes";

export default function ItemCard({image, text, actions, children}){

    if(text == null) text = [];
    else text = [].concat(text);

    var textList = text.map((text, id) => {
        var format = text.content;
        if(text.strong) format = <Strong>{text.content}</Strong>;

        return (
        <Text key={id} size={text.size} align={"center"}>
            {format}
        </Text>)
        ;
    })
    if(actions == null) actions = [];
    else actions = [].concat(actions);

    var actionList = actions.map((action, id) => {
        if(action.condition) return <Button key={id} onClick={action.callback}>{action.title}</Button>
        return null;
    });

    return(
        <Box width="200px" height="150px">
            <Card p="1" size="4" height="100%" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                <Flex direction={"column"} gap="2" justify={"between"} align={"center"} height={"100%"}>
                    <Flex direction="column" gap="1" align="center" justify={"center"} flexGrow={"1"} style={{ overflow: "hidden", width: "100%" }}>
                        {textList}
                    </Flex>
                    {children 
                    && <Flex> {children} </Flex>}
                    <Flex direction={"row"}>
                        {actionList}
                    </Flex>
                </Flex>
            </Card>
        </Box>

    );
}