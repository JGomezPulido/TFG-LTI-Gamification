import fetch from "node-fetch";
import BadgeClass from "../models/badge.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
export const awardBadge = async (req, res) => {
    const [course, badge, user] = req.params;
    try {
        const foundBadge = BadgeClass.findOne({_id: badge, courses: course});
        if(!foundBadge) return res.status(404).json({messsage: "Could not find badge"});

        const updateUser = await User.findByIdAndUpdate({_id: user, "badges.badge": badge},
             {"$push": {"badges.$.course": course}});
        if(!updateUser){
            const foundUser  = await User.findById(user, {"$push": {
                badges: {
                    badge: badge, courses: [course]
                }}});
            if(!foundUser) return res.status(404).json({messsage: "Could not find user"});
        }
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }    
};

export const createBadge = async (req, res) => {
    const {name, description, criteria, image, alignment, tags} = req.body;
    const {course} = req.params.course;
    try{
        const foundCourse = await Course.findById(course);
        console.log("here")
        if(!foundCourse) return res.status(404).json({message:"Course could not be found"})
            ;
        const newBadge = new BadgeClass({
            name,
            description,
            criteria,
            image,
            alignment, 
            tags,
            courses: [foundCourse._id],
        });
        const savedBadge = await newBadge.save();
        res.json(savedBadge);
    }catch (error){
        console.log(error.message)
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
    const badge = await BadgeClass.findByIdAndUpdate(
    {
        _id: req.params.id, 
        user: req.user.id,
    },
        req.body,
        {new: true}
    );
    if(!badge) return res.status(400).json({message: "Badge not found"});
    res.status(200).json(badge);
};

export const getBadges = async (req, res) => {
    const course = req.params.course;
    try{
        const foundCourse = await BadgeClass.findById(course, 'badges').populate('badges');
        if(!foundCourse) return res.status(404).json({message: "Could not find course"});
        res.json(foundCourse.badges);
    }catch (error){
        
    }
};

export const getBadge = async (req, res) => {
    try {
        
        const badge = await BadgeClass.findOne({id: req.params.id, courses: req.params.course},);
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