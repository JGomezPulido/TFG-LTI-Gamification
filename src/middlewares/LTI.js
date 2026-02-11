import jose from "node-jose";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

import { parseRole } from "./validateRole.js";

export const checkLTI = async (req, res, next) => {
    const { id_token, state } = req.body;
    console.log(state);
    console.log(req.session.state);
    //Primero, verificamos que los datos están presentes, y verificamos el estado para mitigar Cross-site Request Forgery (CSRF)
    if (!id_token) return res.status(400).send('Falta el id_token');
    if (!state || req.session.state !== state) return res.status(400).send('Invalid state');
    
    try {
        //Decodificamos el id_token para obtener los datos necesarios para seguir con el resto de la autenticación
        //De momento no se verifica el token dado que los datos necesarios para ello se encuentran codificados dentro
        const decoded = jwt.decode(id_token, { complete: true });
        if (!decoded) return res.status(400).send('Token JWT inválido');
        
        //A continuación recogemos y verificamos los datos necesarios para verificar la identidad del usuario
        const { payload } = decoded;
        const expectedIssuer =  process.env.MOODLE_IP;
        const expectedClientId = req.session.client_id;
        
        //console.log(payload);
        //Verificamos que la plataforma que se está comunicando con nosotros, y el client ID que nos envía son los esperados
        if (payload.iss !== expectedIssuer) return res.status(401).send('Issuer no válido');
        if (
            (Array.isArray(payload.aud) && !payload.aud.includes(expectedClientId)) ||
            (!Array.isArray(payload.aud) && payload.aud !== expectedClientId)
        ) {
            return res.status(401).send('Client ID no válido');
        }
        //Este nonce tiene que ser el mismo que se estableció en /login
        if (payload.nonce !== req.session.nonce) return res.status(401).send('Nonce no válido');
        
        //Por último, verificamos que el jwt está correctamente firmado
        const jwksUrl = `${payload.iss}/mod/lti/certs.php`;
        const jwks = await fetch(jwksUrl).then(res => res.json());
        const client = await jose.JWK.asKeyStore(jwks);
        await jose.JWS.createVerify(client).verify(id_token);

        //Preparamos los datos de lti para que el endpoint los tenga de fácil acceso.
        const email = payload.email;
        const role = parseRole(payload["https://purl.imsglobal.org/spec/lti/claim/roles"]);
        const username = payload["https://purl.imsglobal.org/spec/lti/claim/ext"]?.user_username;
        const course = payload["https://purl.imsglobal.org/spec/lti/claim/context"];
        if(!email || !role || !username || !course){
            res.status(401).json({message: "Parameters on the LTI request were blank, couldn't validate"});
        }

        req.ltiData = {
            user: {email, username, role},
            course,
        }
        
        next();

    }catch(error){
        console.error('Error al verificar el token:', error.message);
        res.status(500).send(`<h1>❌ Error al procesar el lanzamiento</h1><p>${error.message}</p>`);
    }
}