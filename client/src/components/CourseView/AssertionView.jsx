import { useEffect } from "react";
import { useBadges } from "../../context/badgeContext"
import { useNavigate } from "react-router-dom";

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

export default function AssertionsView({course}){
    const {getAssertions, assertions} = useBadges();
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Assertion useEffect");
        getAssertions();
    }, [])
    var assertionList = null;
    if(assertions && Array.isArray(assertions)) assertionList = assertions.map( (assertion, id) => <Badge key={id} badge={assertion} navigate={navigate}/>);
    return (
        <div>
            {assertionList}
        </div>
    )
}