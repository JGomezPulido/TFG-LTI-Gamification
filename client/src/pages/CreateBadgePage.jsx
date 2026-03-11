import { useForm } from "react-hook-form";
import { useBadges } from "../context/badgeContext";
import FormInput from "../components/FormInput";
import { useCourse } from "../context/courseContext";
import { useNavigate } from "react-router-dom";
import { Card, Flex, Button, TextField } from "@radix-ui/themes";

export default function CreateBadgePage(){
    const {register, handleSubmit} = useForm();
    const {createBadge} = useBadges();
    const {course} = useCourse();
    const navigate = useNavigate();
    return (
        <Card>
            <form onSubmit={handleSubmit(async (values) => {
                try{
                    await createBadge(values);
                    console.log("here");
                    navigate(`/course/${course.id}`);
                }catch (error){
                    console.log("Could not create badge: ", error.response.data.message);
                }
            })}>
                <Flex direction={"column"} gap="3">
                
                    <h1 className="my-2 font-bold self-center content-center justify-center">Create new badge</h1>
                    <FormInput type='text' title='name' register={register('name', {required: true})}/>
                    <FormInput type='text' title='description' register={register('description', {required: true})}/>
                    <FormInput type='text' title='criteria' register={register('criteria', {required: true})}/>
                    <FormInput type='text' title='image' register={register('image', {required: true})}/>
                    <Button type='submit'>
                        Create Badge
                    </Button>
                </Flex>
            </form>
           
        </Card>
    )
}