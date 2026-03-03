import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"
import { useEffect, useState } from "react";
import { useBadges } from "../../context/badgeContext";

function Badge({badge, navigate}){
    async function onClick() {
        navigate(`badge/${badge._id}`);
    }
    return (
    <div className={`flex-1 flex flex-row  w-full`}>
        <button
        onClick={onClick}
        className={`flex-4 flex flex-col py-3 border-zinc-500 border-3 hover:bg-zinc-600 items-center w-full`}>
            <p>{badge.name}</p>
            <p>{badge.description}</p>
        </button>
    </div>)
}
export default function BadgeView(){
    const { role} = useCourse();
    const { getBadges, badges } = useBadges();
    
    const navigate = useNavigate();
    function createBadge(){
        navigate(`badge/create`);
    }
    useEffect( () => {
        console.log("getting badges");
        getBadges();
    }, [])
    var badgesList = null;
    console.log(badges);
    
    if(badges && Array.isArray(badges)) badgesList = badges.map( (badge, id) => <Badge key={id} badge={badge} navigate={navigate}/>);
   
    return (
        <div>
            {badgesList}
            {role ==="Instructor" && <button className="flex-1 my-5 py-5 px-5 border-2 border-zinc-400 hover:border-zinc-600"
                onClick={createBadge}>Create new</button>}

        </div>
    )
}