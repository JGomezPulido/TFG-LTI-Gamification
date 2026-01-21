import fetch from "node-fetch";

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