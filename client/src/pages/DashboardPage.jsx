import { getAllItemsRequest } from "../api/inventory";
import ListView from "../components/ListView";
import Course from "../components/CourseButton";
import { getImageUrl } from "../api/image"
import { useAuth } from "../context/authContext";
import { useCourse } from "../context/courseContext";
import { Avatar, Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

import GeneralView from "../components/GeneralView";

export default function DashboardPage(){
    const {role} = useCourse();
    const navigate = useNavigate();
    const columns = [
        {title: "Name", render: (item) => item.name},
        {title: "Actions", render: (item) => (<Button onClick={()=>navigate(`../item/${item._id}`)}>View</Button>)}
    ]
    async function fetchData(page, count, name) {
        try{
            const res = await getAllItemsRequest({page, count, name});
            return res.data;
        }catch(error){
            return error;
        }
    }

    function renderItem (item){
        return (
            <div>
                <Avatar size="9" src={getImageUrl(item.image)}/>
                <div>{item.name}</div>
            </div>
        );
    }

    return (
        <GeneralView queryKey={["ItemsRequest"]} fetchFnc={fetchData} tableColumns={columns} renderCard={renderItem}>

        </GeneralView>
    );
}