import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { SegmentedControl, Flex, Tooltip } from "@radix-ui/themes";
import { GridIcon, TableIcon, ViewHorizontalIcon } from "@radix-ui/react-icons";

import ListView from "./ListView";
import { useCourse } from "../context/courseContext";


export default function GeneralView({fetchFnc, queryKey, tableColumns, renderCard}){
    const [mode, setMode] = useState("Grid");
    const navigate = useNavigate();
    const {role} = useCourse();

    return(
        <ListView fetchFnc={fetchFnc} queryKey={queryKey}>
             <Flex gap="3" align="center" justify="center" wrap="wrap">
                <ListView.Search placeholder="Search by name..." />
 
                <SegmentedControl.Root value={mode} onValueChange={setMode}>
                    <Tooltip content="Grid Mode">
                        <SegmentedControl.Item value="Grid">
                            <GridIcon />
                        </SegmentedControl.Item>
                    </Tooltip>
                    <Tooltip content="Table Mode">
                        <SegmentedControl.Item value="Table">
                            <ViewHorizontalIcon />
                        </SegmentedControl.Item>
                    </Tooltip>
                </SegmentedControl.Root>
            </Flex>

            {mode === "Grid" && 
                <ListView.Grid renderCard={renderCard}/>}

            {mode === "Table" &&
                <ListView.Table columns={tableColumns}/> }

            <ListView.Pagination/>
            <ListView.CreateButton show={role==="Instructor"} onClick={() => navigate("/item/create")}/>
        </ListView>
    )
}