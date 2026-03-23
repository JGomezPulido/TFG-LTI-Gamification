import Item from "../models/item.model.js"
import Inventory from "../models/inventory.model.js"

export const createItem = async (req, res) => {
    const {name, description, image} = req.body;
    console.log(req.body);
    try{
        const itemExists = await Item.findOne({course: req.course, name: name});
        console.log(itemExists)
        if(itemExists) return res.status(400).json({message: "An item with this name already exists for this course"});

        const newItem = new Item({
            course: req.course, 
            name: name, 
            description: 
            description, 
            image: image
        });

        const itemSaved = newItem.save();
        return res.json(itemSaved);
    }catch(error) {
        console.log(error);
        return res.status(404).json({message: error.message});
    }
};

export const getItem = async (req, res) => {
    const {id} = req.params;
    try {
        const item = await Item.findOne({_id: id, course: req.course}, '-course');
        if(!item) return res.status(404).json({message: "Item could not be found"});
        return res.json(item);
    } catch (error) {
        console.log(error);
        return res.status(404).json({message: error.message});
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({course: req.course}).select('-course').sort('-name');
        console.log(items);
        return res.json(items);
    } catch (error) {
        console.log(error);
        return res.status(404).json({message: error.message});
    }
};

export const updateItem = async (req, res) => {
    const {id} = req.params;
    try {
        const updatedItem = await Item.findOneAndUpdate(
            {_id: id, course: req.course},
            req.body,
            {new: true, runValidators: true}
        );

        if(!updatedItem) return res.status(404).json({message: "Item not found"});
        console.log(updatedItem);
        res.json(updatedItem);
    } catch (error) {
        console.log(error);
        return res.status(404).json({message: error.message});
    }
};

export const deleteItem = async (req, res) => {
    console.log(req.params.id);
    const item = await Item.deleteOne({_id: req.params.id, course: req.course});
    if(!item) return res.status(400).json({message: "Badge not found"});
    res.sendStatus(200);
};

export const getInventory = async (req, res) => {
    const {user} = req.params;

    try {
        const inv = Inventory.findOne({course: req.course, user: user})
        .select('items')
        .populate('items.item');

        if(!inv) return res.json({items: []});
        console.log(inv);
        res.json(inv);
    } catch (error) {
        console.log(error);
        return res.status(404).json({message: error.message});
    }
};

export const addItemToInventory = async (req, res) => {
    const {user} = req.params;
    const {item} = req.body;
    const course = req.course;
    try {
        var inv = await Inventory.findOneAndUpdate(
            {course, user},
            [
                {
                    $set: {
                        course,
                        user,
                        items: {
                            $cond: [
                                { $in: [item, "$items.item"] },
                                {
                                    $map: {
                                        input: "$items",
                                        as: "i",
                                        in: {
                                            $cond: [
                                                { $eq: ["$$i.item", item] },
                                                {
                                                    item: "$$i.item",
                                                    count: { $add: ["$$i.count", 1] }
                                                },
                                                "$$i"
                                            ]
                                        }
                                    }
                                },
                                {
                                    $concatArrays: [
                                        { $ifNull: ["$items", []] },
                                        [{ item: item, count: 1 }]
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            {upsert: true, new: true, updatePipeline: true}
        );
        return res.json(inv);
    } catch (error) {
        console.log(error);
        return res.status(404).json({message: error.message});
    }
};

export const delItemFromInventory = async (req, res) => {
    const {user} = req.params;
    const {item} = req.body;
    const course = req.course;

    try {
        const inv = await Inventory.findOneAndUpdate(
            { course, user },
            [
                {
                    $set: {
                        items: {
                            $filter: {
                                input: {
                                    $map: {
                                        input: { $ifNull: ["$items", []] },
                                        as: "i",
                                        in: {
                                            $cond: [
                                                { $eq: ["$$i.item", item] },
                                                {
                                                    item: "$$i.item",
                                                    count: { $subtract: ["$$i.count", 1] }
                                                },
                                                "$$i"
                                            ]
                                        }
                                    }
                                },
                                as: "i",
                                cond: { $gt: ["$$i.count", 0] }
                            }
                        }
                    }
                }
            ],
            {new: true}
        ).select('items');
        if(!inv) res.json({items: []});
        res.json(inv);
    } catch (error) {
        console.log(error);
        return res.status(404).json({message: error.message});
    }
};
