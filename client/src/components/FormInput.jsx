import { Box, TextField, Text, Callout } from "@radix-ui/themes";
import { InfoCircledIcon} from "@radix-ui/react-icons"

export default function FormInput ({type, title, register, readonly = false, value="", error}){
    console.log(readonly)
    return ( 
        <Box>
            <Text as="label">{title}</Text>
            <TextField.Root type={type} {...register} defaultValue={value} readOnly={readonly}/>
            {error && 
            <Callout.Root>
                <Callout.Icon>
                    <InfoCircledIcon/>
                </Callout.Icon>
                <Callout.Text>
                    {error.message}
                </Callout.Text>
            </Callout.Root>}
        </Box>
    );
}