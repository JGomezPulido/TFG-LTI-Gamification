import { useForm } from "react-hook-form";

import FormInput from "../components/FormInput";
import { loginRequest } from "../api/auth.js";

export default function LoginPage(){
    const {register, handleSubmit} = useForm();
    return (
        <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
            <form onSubmit={handleSubmit(async (values) => {
                console.log(values);
                const res = await loginRequest(values);
                console.log(res);
            })}>
                <FormInput type='email' placeholder='E-mail' register={register('email', {required: true})}/>
                <FormInput type='password' placeholder='Password' register={register('password', {required: true})}/>
                <button type='submit' 
                 className='bg-zinc-700 hover:bg-zinc-600 rounded-md'>
                    Register
                </button>
            </form>
        </div>
    );
}