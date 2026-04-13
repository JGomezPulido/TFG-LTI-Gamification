import { Card, Strong, Text, Flex, Button } from "@radix-ui/themes";

export default function ItemCard({image, text, actions, children}){

    if(text == null) text = [];
    else text = [].concat(text);

    var textList = text.map((text, id) => {
        var format = text.content;
        if(text.strong) format = <Strong>{text.content}</Strong>;

        return (
        <Text key={id} size={text.size}>
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
    
    <Card size="4"
    p="1">
        <Flex direction={"column"} gap="2" align={"center"}>
            {textList}
            {children 
            && <Flex> {children} </Flex>}
            <Flex direction={"row"}>
                {actionList}
            </Flex>
        </Flex>
    </Card>

    );
}