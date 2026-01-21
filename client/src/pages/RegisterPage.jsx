import { useForm } from "react-hook-form";

import FormInput from "../components/FormInput";
import { registerRequest } from "../api/auth.js";

import { useAuth } from "../context/authContext.jsx";

export default function RegisterPage(){
    const {register, handleSubmit} = useForm();
    const {signup, user} = useAuth(); 
    console.log(user)
    return (
        <div className='flex h-screen items-center justify-center'>
        <div className='flex bg-zinc-800 max-w-md px-10 pt-2 pb-5 rounded-md'>
            
            <form onSubmit={handleSubmit(async (values) => {
                signup(values);
            })}>
                <h1 className="my-2 font-bold self-center">Register</h1>
                <FormInput type='email' placeholder='E-mail' register={register('email', {required: true})}/>
                <FormInput type='password' placeholder='Password' register={register('password', {required: true})}/>
               
                <button type='submit' 
                    className='bg-zinc-700 hover:bg-zinc-600 rounded-md my-2 p-2'>
                    Register
                </button>
            </form>
        </div>
        </div>
    );
}