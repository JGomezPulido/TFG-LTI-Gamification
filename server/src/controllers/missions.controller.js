import Mission from "../models/mission.model.js"
import Inventory from "../models/inventory.model.js"
import Course from "../models/course.model.js"
import User from "../models/user.model.js"
import { Roles } from "../middlewares/validateRole.js"

export const createMission = async (req, res) => {
    const {name, description, rewards} = req.body;

    try{
        const missionExists = await Mission.findOne({name: name, course: req.course});
        if(missionExists) req.status(400).json({message: `A Mission with name \"${name}\" already exists for course ${req.course}`});

        const newMission = new Mission({
            course: req.course,
            name: name,
            description: description,
            rewards: rewards,
        });

        const missionSaved = await newMission.save();
        return res.json(missionSaved);
    }catch(error){
        console.log(error);
    }
};

export const deleteMission = async (req, res) => {
    const {id: mission} = req.params;

    try {
        const deleted = await Mission.deleteOne({_id: mission, course: req.course});
        if(!deleted) return res.status(404).json(`Mission with id ${mission} not found for course with id ${course}`);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
};

export const updateMission = async (req, res) => {
    const {id: missionId} = req.params;
    const { name, description, rewards} = req.body;
    try{
        const updatedMission = await Mission.findById(missionId);
        if(!updatedMission) return res.status(400).json({message: "Couldnt find mission"});
        if (name)        updatedMission.name = name;
        if (description) updatedMission.description = description;
        if (rewards?.length > 0){
            console.log(rewards);
            rewards.forEach(reward => {
                const index = updatedMission.rewards.findIndex(
                    r => { 
                        console.log(`Document: ${r.type}, update: ${reward.type}`);
                        return r.type.toString() === reward.type
                    }
                );
                console.log(index);
                if(index >= 0){
                    var found = updatedMission.rewards[index];
                    found.amount = reward.amount;
                }else{
                    console.log(reward);
                    updatedMission.rewards.push(reward);
                }
            });
        }
        updatedMission.rewards = updatedMission.rewards.filter(r => r.amount > 0);
        console.log(updatedMission);
        await updatedMission.save();
        res.json(updatedMission.toObject());
    }catch (error){
        //console.log(error);
        return res.status(400).json({message:error.message});
    }

};

export const getAllMissions = async (req, res) => {
    try{
        const missions = await Mission.find({course: req.course});
        console.log(req.course);
        if(!missions) return res.status(400).json({message: "Couldnt find missions for this course"});
        console.log(missions);
        return res.json(missions);
    }catch (error) {
        console.log(error);
    }
};

export const getMission = async (req, res) => {
    const {id} = req.params;
    try{
        const foundMission = await Mission.findOne({_id: id, course: req.course});
        if(!foundMission) return res.status(400).json({message: "Couldn't find mission with that id for this course"});
        return res.json(foundMission);
    } catch (error){
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
};



//Estas  deberian ir en inventario?

export const enableMission = async (req, res) => {
    const {id} = req.params;
    try{
        const foundMission = await Mission.findById(id);
        if(!foundMission) return res.status(400).json({message: "Could not find mission"});
        if(foundMission.enabled) return res.status(200);
        const users = await User.find().elemMatch('roles', {course: req.course, role: Roles.Student});
        foundMission.enabled = true;
        users.forEach(async (user) => {
            console.log(user);
            const foundInventory = await Inventory.findOne({user: user._id});
            if(!foundInventory) return res.status(400).json({message: "could not find inventory for user"});
            foundInventory.missions.push({mission: foundMission._id, completed: false});
            await foundInventory.save();
        });
            
        
        await foundMission.save();
        return res.sendStatus(200);
    } catch (error){
        console.log(error.message)
        return res.status(500).json({message: error.message});
    }
}

export const giveMission = async (req, res) => {
    const { user, id: mission } = req.body;

    try {
        const foundUser = await Course.findOne({ _id: req.course, users: user });
        if (!foundUser) return res.status(400).json({ message: "Could not find user" });

        const foundMission = await Mission.findOne({ course: req.course, _id: mission });
        if (!foundMission) return res.status(400).json({ message: "Could not find mission" });

        //Nos aseguramos de que el inventario del usuario existe, si no introducimos uno nuevo sin items.
        await Inventory.findOneAndUpdate(
            { user: user, course: req.course },
            { $setOnInsert: { items: [] } },
            { upsert: true }
        );

        const missionAdded = await Inventory.findOneAndUpdate(
            {
                user: user,
                course: req.course,
                "missions.mission": { $ne: mission },
            },
            {
                $push: {
                    missions: { mission: mission, completed: false },
                },
            },
            { new: true, runValidators: true }
        );

        if (!missionAdded) return res.status(400).json({ message: "Mission already in inventory" });
        return res.status(200).json(missionAdded);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const completeMission = async (req, res) => {
    const {user, id: mission} = req.params;

    try {
        const mission = await Mission.findById(mission);
        if(!mission) return res.status(400).json({ message: "Could not find mission" });

        //Esta query hace dos cosas, primero añade los objetos necesarios al inventario del usuario, después marca la misión correspondiente como completada para el usuario
        const updatePipeline = [{
                $set: {
                    items: {
                        $filter: {
                            input: {
                                $reduce: {
                                    input: mission.rewards,
                                    initialValue: "$items",
                                    in: {
                                        $cond: {
                                            if: { $in: ["$$this.type", "$$value.item"] },
                                            then: {
                                                $map: {
                                                    input: "$$value",
                                                    as: "i",
                                                    in: {
                                                        $cond: {
                                                            if: { $eq: ["$$i.item", "$$this.type"] },
                                                            then: {
                                                                item: "$$i.item",
                                                                count: { $add: ["$$i.count", "$$this.amount"] },
                                                            },
                                                            else: "$$i",
                                                        },
                                                    },
                                                },
                                            },
                                            else: {
                                                $concatArrays: [
                                                    "$$value",
                                                    [{ item: "$$this.type", count: "$$this.amount" }],
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                            as: "i",
                            cond: { $gt: ["$$i.count", 0] },
                        },
                    },
                },
            },
        {
                $set: {
                    missions: {
                        $map: {
                            input: "$missions",
                            as: "m",
                            in: {
                                $cond: {
                                    if: { $eq: ["$$m.mission", missionId] },
                                    then: { mission: "$$m.mission", completed: true },
                                    else: "$$m",
                                },
                            },
                        },
                    },
                },
            },];
        const updatedInventory = await Inventory.findOneAndUpdate(
            {
                user,
                course: req.course,
                missions: { $elemMatch: {mission, completed: false}}
            },
            updatePipeline,
            {new: true, runValidators: true}
        );
        if(!updatedInventory) return res.status(400).json({message: "Could not update user Inventory or mission was already complete"});
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

};

export const getUserMissions = async (req, res) => {
    const {user} = req.body;
    try {
        const foundMissions = await Inventory.findOne({user, course: req.course}, 'missions').populate('missions.mission', 'name description');
        if(!foundMissions || foundMissions.length <= 0) return res.json({message: "Could not find missions for this user"});
        return res.json(foundMissions);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}