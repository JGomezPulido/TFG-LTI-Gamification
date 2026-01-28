import fetch from "node-fetch";
import BadgeClass from "../models/badge.model.js"

export const awardBadge = async (req, res) => {
    //TODO
    res.sendStatus(404);
};

export const createBadge = async (req, res) => {
    const {name, description, criteria, image, alignment, tags} = req.body;
    try{
        const newBadge = new BadgeClass({
            name,
            description,
            criteria,
            image,
            alignment, 
            tags,
            user: req.user.id,
        });
        const savedBadge = await newBadge.save();
        res.json(savedBadge);
    }catch (error){
        res.status(400).json({message: error.message});
    }
};

export const deleteBadge = async (req, res) => {
    console.log(req.params.id);
    const badge = await BadgeClass.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
    });
    if(!badge) return res.status(400).json({message: "Badge not found"});
    res.status(200).json(badge);
};

export const updateBadge = async (req, res) => {
    console.log(req.params.id);
    const badge = await BadgeClass.findOneAndUpdate(
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
    const badges = await BadgeClass.find({user: req.user.id})/*.populate('propiedad') para que mongoose inyecte los datos de la propiedad*/;
    res.json(badges)
};

export const getBadge = async (req, res) => {
    const badge = await BadgeClass.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    if(!badge) return res.status(400).json({message: "Inexistent Badge"});
    res.json(badge);
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