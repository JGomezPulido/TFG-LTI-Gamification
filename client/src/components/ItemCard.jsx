import { Card, Strong, Text, Flex, Button, Box } from "@radix-ui/themes";

export default function ItemCard({image, text, actions, children}){

    if(text == null) text = [];
    else text = [].concat(text);

    var textList = text.map((text, id) => {
        var format = text.content;
        if(text.strong) format = <Strong>{text.content}</Strong>;

        var textEl = (
            <Flex
                    key={id}
                    align="center"
                    justify="center"
                    minHeight="1lh" 
                    width="100%">
                <Text key={id} size={text.size} align={"center"}>
                    {format}
                </Text>
            </Flex>
        );

        // Reserve fixed vertical space for the title (first item) so cards
        // stay the same height whether the title wraps to 1 or 2 lines.
        if (id === 0) {
            return (
                <Flex
                    key={id}
                    align="center"
                    justify="center"
                    style={{ minHeight: `2lh`, width: "100%" }}
                >
                    {textEl}
                </Flex>
            );
        }

        return textEl;
    })
    if(actions == null) actions = [];
    else actions = [].concat(actions);

    var actionList = actions.map((action, id) => {
        if(action.condition) return <Button key={id} onClick={action.callback}>{action.title}</Button>
        return null;
    });

    return(
        <Box width="200px">
            <Card p="0" size="4"  style={{ width: "100%"}}>
                <Flex direction={"column"} gap="2" justify={"between"} align={"center"}  width={"100%"} minWidth={"0"} flexGrow={"1"}>
                    <Flex direction="column" gap="1" align="center" justify={"start"} flexGrow={"1"} style={{  width: "100%" }}>
                        {textList}
                    </Flex>
                    {children 
                    && <Flex> {children} </Flex>}
                    <Flex gap="1" direction={"row"} width={"100%"} minWidth={"0"} justify={"center"}>
                        {actionList}
                    </Flex>
                </Flex>
            </Card>
        </Box>

    );
}