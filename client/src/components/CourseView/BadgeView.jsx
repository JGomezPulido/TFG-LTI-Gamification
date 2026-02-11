import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"
import { useEffect } from "react";
import { useBadges } from "../../context/badgeContext";

function Badge({badge}){
    return (<div
    className={`flex-1 flex flex-col py-3 border-zinc-500 border-3 hover:bg-zinc-600  mx-auto`}>
        <p>{badge.name}</p>
        <p>{badge.description}</p>
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
    if(badges) badgesList = badges.map( (badge, id) => <Badge key={id} badge={badge}/>);
    return (
        <div>
            {badgesList}
            {role ==="Instructor" && <button className="flex-1 my-5 py-5 px-5 border-2 border-zinc-400 hover:border-zinc-600"
                onClick={createBadge}>Create new</button>}

        </div>
    )
}