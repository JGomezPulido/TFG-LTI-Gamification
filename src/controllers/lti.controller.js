/*
El código para las funciones del protocolo LTI (jwks, login y launch) ha sido basado en el tutorial presente en este enlace: https://www.andresmartinezsoto.eu/integracion-lti-13-moodle/
Ver https://www.imsglobal.org/spec/lti/v1p3#lti-links para detalles sobre el funcionamiento del protocolo LTI

El paquete node-jose (JOSE = JavaScript Object Signing and Encryption) se usa tanto para generar las claves usadas en LTI (ver generate-keys.js), como para enviar las claves públicas a Moodle (endpoint api/jwks.json)

El paquete jsonwebtoken se utiliza para decodificar el id_token que moodle nos manda a launch por LTI, que está enciptado utilizando esta misma tecnologia (ver launch, línea 71)
*/
import jose from "node-jose"
import fs from "fs"
import jwt from "jsonwebtoken"
import fetch from "node-fetch"

//Este endpoint devuelve las claves públicas que Moodle utilizará para verificar el token de la aplicaición
//Estas claves están en formato JWKS (JSON Web Key Set)
export const jwks = async (req, res) => {
    //Cargamos las keys desde el archivo pertinente y las devolvemos en la respuesta.
    const keys = fs.readFileSync(process.env.KEY_PATH);
    const keystore = await jose.JWK.asKeyStore(keys.toString());
    //El método toJSON() de la keystore acepta un bool, pero usando el valor por defecto (false), hace que solo se parseen las claves públicas, que es nuestro objetivo en ente caso.
    res.json(keystore.toJSON())
};

/*
** Esta función es la que usa moodle para comunicar la plataforma con la herramienta LTI.
** Aunque se llame login (es el nombre que utiliza moodle, no lo he elegido arbitrariamente), el mensaje realmente no contiene ninguna información sobre el usuario,
** únicamente nos envía información sobre la plataforma que está intentando acceder a la herramienta
*/
export const login = (req, res) => {
        //Dado que este endpoint puede recibir tanto métodos POST como GET, comprobamos qué método es para recoger los datos de la request
        const query = req.method === 'POST' ? req.body : req.query;
        const { iss, login_hint, target_link_uri, client_id, lti_message_hint} = query;
        
        console.log('📥 Petición a /login con:', query);
        
        if (!iss || !login_hint || !client_id || !target_link_uri) {
            return res.status(400).send('Faltan parámetros requeridos');
        }
        
        const state = Math.random().toString(36).substring(2, 15);
        const nonce = Math.random().toString(36).substring(2, 15);
        
        console.log('🧠 Guardando state en sesión:', state);
        
        req.session.state = state;
        req.session.nonce = nonce;
        req.session.client_id = client_id;  
        
        const authUrl = new URL(`${iss}/mod/lti/auth.php`);
        const params = new URLSearchParams({
        response_type: 'id_token',
        response_mode: 'form_post',
        scope: 'openid',
        client_id,
        redirect_uri: `${process.env.BACKEND_IP}/api/launch`,
        login_hint,
        target_link_uri,
        state,
        nonce,
        prompt: 'none'
    });
    
    if (lti_message_hint) {
        params.append('lti_message_hint', lti_message_hint);
    }
    
    res.redirect(`${authUrl}?${params.toString()}`);
};

export const launch = async (req, res) => {
    const { id_token, state } = req.body;
    // console.log(req.body);
    
    // console.log('🧠 State recibido:', state);
    // console.log('🧠 State en sesión:', req.session.state);
    
    if (!id_token) return res.status(400).send('Falta el id_token');
    if (!state || req.session.state !== state) return res.status(400).send('Invalid state');
    
    try {
        const decoded = jwt.decode(id_token, { complete: true });
        if (!decoded) return res.status(400).send('Token JWT inválido');
        
        const { payload } = decoded;
        const expectedIssuer =  process.env.MOODLE_IP;
        const expectedClientId = req.session.client_id;
        
        //console.log(payload);
        if (payload.iss !== expectedIssuer) return res.status(401).send('Issuer no válido');
        if (
            (Array.isArray(payload.aud) && !payload.aud.includes(expectedClientId)) ||
            (!Array.isArray(payload.aud) && payload.aud !== expectedClientId)
        ) {
            return res.status(401).send('Client ID no válido');
        }
        
        if (payload.nonce !== req.session.nonce) return res.status(401).send('Nonce no válido');
        
        const jwksUrl = `${payload.iss}/mod/lti/certs.php`;
        const jwks = await fetch(jwksUrl).then(res => res.json());
        const client = await jose.JWK.asKeyStore(jwks);
        await jose.JWS.createVerify(client).verify(id_token);
        
        res.send(`
            <h1>✅ Lanzamiento Exitoso</h1>
            <p><strong>Usuario:</strong> ${payload.name} => ${payload.email}</p>
            <p><strong>Rol:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/roles']}</p>
            <p><strong>Curso:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/context']?.title || 'Desconocido'}</p>
            <p><strong>Deployment ID:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/deployment_id']}</p>
            <a href=${process.env.BACKEND_IP}/api/getBadge/3> Get Badges From user 3 </a>
            `);
            // res.redirect("index.html")
        } catch (err) {
            console.error('Error al verificar el token:', err.message);
            res.status(500).send(`<h1>❌ Error al procesar el lanzamiento</h1><p>${err.message}</p>`);
        }
};
   
export const getBadge = async (req, res) => {
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