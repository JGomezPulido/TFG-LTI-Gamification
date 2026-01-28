import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import FormInput from "../components/FormInput";


import { useAuth } from "../context/authContext.jsx";

export default function RegisterPage(){
    const {register, handleSubmit} = useForm();
    const location = useLocation();
    const {signup} = useAuth();  
    const navigate = useNavigate();
    var ltiUser = null;
    if(location.state) ltiUser = location.state.ltiUser;
    return (
        <div className='flex h-screen items-center justify-center'>
        <div className='flex bg-zinc-800 max-w-md px-10 pt-2 pb-5 rounded-md'>
            
            <form onSubmit={handleSubmit(async (values) => {
                try{
                    await signup({...values, ltiUser});
                    navigate("/");
                }catch(error){

                }
                
            })}>
                <h1 className="my-2 font-bold self-center">Register</h1>
                <FormInput type='text' placeholder={`Username`} register={register(`username`, {required: true})} readonly={ltiUser} value={ltiUser?.username}/>
                <FormInput type='email' placeholder='E-mail' register={register('email', {required: true})} readonly={ltiUser} value={ltiUser?.email}/>
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