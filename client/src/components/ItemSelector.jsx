import { Button, Callout, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

function Item({item, onSelected, onDeselection, onDeselected, updateAmount, setError}){
    const [amount, setAmount] = useState(item.amount)
    function handleSelection(evt){
        if(evt.target.checked) {
            onSelected({type: item.type, amount});
        }
        else {
            onDeselected(item.type)
        }
    }

    function handleValueChange(evt){
        
        try {
            const value = parseInt(evt.target.value);
            setAmount(value);
            updateAmount(item.type, parseInt(value)); 
            setError(null);
        } catch (error) {
            setError("Value was not an integer so it couldn't be parsed")
        }
        
    }
    return(
        <div>
            <input type="checkbox" defaultChecked={item.selected} onChange={(evt) =>handleSelection(evt)}></input>
            <input min={0} type="number" defaultValue={amount?amount:1} onChange={(evt) => handleValueChange(evt)}></input>
            <Text>{item.name}</Text>
        </div>
    )
}

export default function ItemSelector({items, onSelected, onDeselected, updateAmount}){
    const [error, setError] = useState(null)
    const itemList = items.map((item, idx)=> 
        <Item item={item} selected={item.selected} onSelected={onSelected} onDeselected={onDeselected} updateAmount={updateAmount} setError={setError} key={idx}></Item>)
        
    return (
        <div className="Centered">
            {itemList}
        </div>
    );
}