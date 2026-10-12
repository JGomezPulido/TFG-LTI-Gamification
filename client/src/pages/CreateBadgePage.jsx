import { useForm } from "react-hook-form";
import { useBadges } from "../context/badgeContext";
import FormInput from "../components/FormInput";
import { useCourse } from "../context/courseContext";
import { useNavigate } from "react-router-dom";
import { Card, Flex, Button, Heading } from "@radix-ui/themes";
import { useEffect } from "react";

export default function CreateBadgePage(){
    const {register, handleSubmit, formState: {errors: formErrors}} = useForm();
    const {createBadge} = useBadges();
    const {course} = useCourse();
    const navigate = useNavigate();

    const sendData = handleSubmit(async (values, evt) => {
        evt?.preventDefault();
        try{
            const formData = new FormData();
            
            values.image = values.image[0];
            Object.entries(values).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                formData.append(key, value);
            });
                            
            await createBadge(formData);
            navigate(`/course/${course.id}`);
        }catch (error){
            console.log("Could not create badge: ", error);
        }
    });

    return (
        <Card>
            <form onSubmit={sendData}>
                <Flex direction={"column"} gap="3">

                    <Heading as={"h1"} size={"6"}>Create new badge</Heading>
                    <FormInput type='text' title='name' register={register('name', {required: "Name is required"})} error={formErrors.name}/>
                    <FormInput type='text' title='description' register={register('description', {required: "Description is required"})} error={formErrors.description}/>
                    <FormInput type='text' title='criteria' register={register('criteria', {required: "Criteria is required"})} error={formErrors.criteria}/>
                    <FormInput type='file' title='image' register={register('image', {required: "Image is required"})} error={formErrors.image}/>
                    <Button type='submit'>
                        Create Badge
                    </Button>
                </Flex>
            </form>
           
        </Card>
    )
}