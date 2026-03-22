import fetch from "node-fetch";
import BadgeClass from "../models/badge.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
export const awardBadge = async (req, res) => {
    const {badge, user} = req.params;
    const course = req.course;
    try {
        const foundBadge = await BadgeClass.findOne({_id: badge, course: course});
        if(!foundBadge) return res.status(404).json({messsage: "Could not find badge"});
        console.log(foundBadge);
        const foundUser  = await User.findByIdAndUpdate(user,  
        {
            "$addToSet": {
                assertions: foundBadge._id
            }
        });
        console.log(foundUser);
        if(!foundUser) return res.status(404).json({messsage: "Could not find user"});
        res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }    
};

export const getAssertions = async (req, res) => {
    const user = req.user;
    const course = req.course;

    try {
        console.log(course);
        const {assertions }= await User.findById(user.id)
            .populate({path: "assertions",  
               match: { course: course},
               select: "_id name image description criteria"
        });
        console.log(assertions);
        if(!assertions)  res.sendStatus(404);
    
        res.json(assertions);
    } catch (error) {
        console.log(error.message);
        res.sendStatus(404);
    }
}
export const createBadge = async (req, res) => {
    const {name, description, criteria, image, alignment, tags} = req.body;
    const id = req.course;
    try{
        const badgeExists = await BadgeClass.findOne({name: name, course: id});
        if(badgeExists) return res.status(400).json({message: "A badge with that name already exists for this course"})
        const foundCourse = await Course.findById(id);
        if(!foundCourse) return res.status(404).json({message:"Course could not be found"});
        const newBadge = new BadgeClass({
            name,
            description,
            criteria,
            image,
            alignment, 
            tags,
            course: foundCourse._id,
        });
        const savedBadge = await newBadge.save();
        res.json(savedBadge);
    }catch (error){
        res.status(400).json({message: error.message});
    }
};

export const deleteBadge = async (req, res) => {
    console.log(req.params.id);
    const badge = await BadgeClass.findByIdAndDelete(req.params.id);
    if(!badge) return res.status(400).json({message: "Badge not found"});
    res.status(200).json(badge);
};

export const updateBadge = async (req, res) => {
    try{
        const badge = await BadgeClass.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators:true,
            }
        );
        if(!badge) return res.status(400).json({message: "Badge not found"});
        res.status(200).json(badge);
    }catch (error){
        res.status(400).json({message: `Update failed: ${error.message}`});
    }
};

export const getBadges = async (req, res) => {
    const course = req.course;
    try{
        const foundBadges = await BadgeClass.find({course: course});
        if(!foundBadges) return res.status(404).json({message: "Could not find course"});
        res.json(foundBadges);
    }catch (error){
        console.log(error.message);
        res.status(404).json({message: error.message});
    }
};

export const getBadge = async (req, res) => {
    try {
        console.log(req.params.id, req.course);
        const badge = await BadgeClass.findOne({_id: req.params.id, course: req.course});
        if(!badge) return res.status(400).json({message: "Inexistent Badge"});
        res.json(badge);
    } catch (error) {
        return res.sendStatus(500).json({message: error.message});
    }
    
};

/**
 * 
 * @param {{userID: Number}} req Recibimos la ID del usuario del que se quiere inspeccionar la lista de insignias
 * @param {*} res 
 */
export const getUserBadges = async (req, res) => {
    //Contactamos con el webservice de moodle, pasandole los parámetros obligatorios que nos pide (que no vienen en la request del usuario)
    var url = new URL(`${process.env.MOODLE_IP}/webservice/rest/server.php`);
    const functionName = "core_badges_get_user_badges"
    url.searchParams.append('wstoken', process.env.MOODLE_TK);
    url.searchParams.append('wsfunction', functionName);
    url.searchParams.append('moodlewsrestformat', 'json');

  // Añade parámetros
    Object.keys(req.params || {}).forEach(key => {
        url.searchParams.append(key, req.params[key]);
    });
    console.log(url.toString());
    try{
        var badge = await fetch(url.toString());

        var badgeJSON = await badge.json();
        console.log(badgeJSON)
        res.send(`<h1> Data recieved: badge json: </h1>\n
                  <p> ${JSON.stringify(badgeJSON,null,0)} </p>`);
    }catch (error){
        console.log(error);
        res.sendStatus(404);
    }

};