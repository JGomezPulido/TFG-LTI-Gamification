import { Card, DataList, Text, Grid, Flex, Strong } from "@radix-ui/themes";
import { useEffect } from "react";
import { useCourse } from "../context/courseContext";
import { useParams } from "react-router-dom";

export default function ProfilePage(){
    const {getProfile, profile} = useCourse();
    const params = useParams();
    useEffect(()=>{
        console.log(params)
        getProfile(params.id);
    }, [params]);

    const assertionList = profile?.assertions.map( (assertion, id) => 
                            <Card key={id} size="5">
                                <Flex direction="column" gap="2">
                                    <Text><Strong>{assertion.name}</Strong></Text>
                                    <Text>{assertion.description}</Text>
                                </Flex>
                            </Card>);
    return (
       <Card>
            <DataList.Root orientation={"vertical"}>
                <DataList.Item align="center">
                    <DataList.Label>User</DataList.Label>
                    <DataList.Value>
                        <Text>{profile?.username}</Text>
                    </DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                    <DataList.Label>E-mail</DataList.Label>
                    <DataList.Value>
                        <Text>{profile?.email}</Text>
                    </DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                    <DataList.Label>Assertions</DataList.Label>
                    <DataList.Value>
                        {profile?.assertions.length === 0?
                        <Text>This user has no assertions</Text>:
                        <Grid columns={"3"} rows="repeat(2)" gap="1">
                            {assertionList}
                        </Grid>
                        }
                    </DataList.Value>
                </DataList.Item>
            </DataList.Root>
       </Card>
    );
}