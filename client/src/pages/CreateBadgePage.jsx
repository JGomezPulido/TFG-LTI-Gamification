import { useForm } from "react-hook-form";
import { useBadges } from "../context/badgeContext";
import FormInput from "../components/FormInput";

export default function CreateBadgePage(){
    const {register, handleSubmit} = useForm();
    const {createBadge} = useBadges();

    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='flex bg-zinc-800 max-w-md px-10 pt-2 pb-5 rounded-md'>
                
                <form onSubmit={handleSubmit(async (values) => {
                    try{
                        await createBadge(values);
                        console.log("logeando");
                        navigate('/dashboard');
                    }catch (error){
                        console.log("Hubo un error al logear: ", error)
                    }
                })}>
                    <h1 className="my-2 font-bold self-center">Login</h1>
                    <FormInput type='text' placeholder='name' register={register('name', {required: true})}/>
                    <FormInput type='text' placeholder='description' register={register('description', {required: true})}/>
                    <FormInput type='text' placeholder='criteria' register={register('criteria', {required: true})}/>
                    <FormInput type='text' placeholder='image' register={register('image', {required: true})}/>
                    <button type='submit' 
                        className='bg-zinc-700 hover:bg-zinc-600 rounded-md my-2 p-2'>
                        Create Badge
                    </button>
                </form>
            </div>
        </div>
    )
}