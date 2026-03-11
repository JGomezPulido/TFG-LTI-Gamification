import { Box, TextField, Text } from "@radix-ui/themes";

export default function FormInput ({type, title, register, readonly = false, value=""}){
    console.log(readonly)
    return ( 
        <Box>
            <Text as="label">{title}</Text>
            <TextField.Root type={type} {...register} defaultValue={value} readOnly={readonly}/>

        </Box>
    )
}