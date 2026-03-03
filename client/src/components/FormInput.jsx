export default function FormInput ({type, placeholder, register, readonly = false, value=""}){

    return (
         <input type={type} placeholder={placeholder} {...register} { ...({readOnly: readonly, defaultValue: value})}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                />
    )
}