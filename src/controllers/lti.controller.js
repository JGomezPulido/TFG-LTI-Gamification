/*
El código para las funciones del protocolo LTI (jwks, login y launch) ha sido basado en el tutorial presente en este enlace: https://www.andresmartinezsoto.eu/integracion-lti-13-moodle/
Ver https://www.imsglobal.org/spec/lti/v1p3 para la especificación del protocolo LTI 1.3
Ver https://www.imsglobal.org/spec/security/v1p0/#openid_connect_launch_flow para ver el protoclo de autenticación OpenID, que es el que estamos usando para nuestra comunicación con la plataforma.

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

//Este endpoint es el que usa moodle para comunicar la plataforma con la herramienta LTI.
export const ltiLogin = (req, res) => {
        //Dado que este endpoint puede recibir tanto métodos POST como GET, comprobamos qué método es para recoger los datos de la petición
        const query = req.method === 'POST' ? req.body : req.query;
        /*Como parte del "login", recibimos los siguientes datos:
        ** {
        **  iss: issuer, es el url base de la plataforma que intenta comunicarse con nosotros
        **  login_hint, lti_message_hint: Según la especificación de LTI, estos dos parámetros son opacos para la herramienta (nosotros) pero, en caso de existir, deben incluirse intactos en la  respuesta a la plataforma sin ser modificados, ya que incluyen información necesaria sobre el mensaje LTI
        **  target_link_url: Esta es el url base de nuestra herramienta, según está indicado en la configuración del moodle
        **  client_id: es un código único que cada plataforma asigna a las herramientas para identificarse
        **  deployment_id: En este caso queda sin usar, pero según la especificación, se pueden hacer distintos despliegues de una misma herramienta para distintos servicios recogidos en la misma plataforma, y este deplyment_id, es el que nos indica cual de los despliegues se está comunicando
        ** }
        */
        const { iss, login_hint, target_link_uri, client_id, lti_message_hint} = query;
        console.log('📥 Petición a /login con:', query);
        
        if (!iss || !login_hint || !client_id || !target_link_uri) {
            return res.status(400).send('Faltan parámetros requeridos');
        }
        
        //Generamos las claves criptograficas necesarias para evitar CRSF y comprobar el estado una vez moodle nos lance utilizando el enpoint /launch
        //No entiendo muy bien porque el tutorial utlizaba esta forma de generar tanto state como nonce, pero estoy investigando formas más seguras de hacerlo.
        const state = Math.random().toString(36).substring(2, 15);
        const nonce = Math.random().toString(36).substring(2, 15);
        
        console.log('🧠 Guardando state en sesión:', state);
        
        //Guardamos el estado en la sesión del navegador
        req.session.state = state;
        req.session.nonce = nonce;
        req.session.client_id = client_id;  
        
        //Generamos la petición de autenticación a la plataforma, siguiendo la especificación
        const authUrl = new URL(`${iss}/mod/lti/auth.php`);
        const params = new URLSearchParams({
        response_type: 'id_token',
        response_mode: 'form_post',
        scope: 'openid',
        client_id,
        redirect_uri: `${process.env.REDIRECT_URI}`,
        login_hint,
        target_link_uri,
        state,
        nonce,
        prompt: 'none'
    });
    
    //Como comenté al principio, si este parámetro está presente en la petición, tenemos que redireccionarlo sin modificaciones
    if (lti_message_hint) {
        params.append('lti_message_hint', lti_message_hint);
    }
    
    res.redirect(`${authUrl}?${params.toString()}`);
};

/*
** Este endpoint es el que utiliza moodle para, ahora sí, lanzar la herramienta.
** Aquí si que nos llegan, a través del id_token (que viene codificado como jsonwebtoken), datos sobre el usuario que está usando la herramienta.
*/
export const ltiLaunch = async (req, res) => {
    const { id_token, state } = req.body;
    
    // console.log('🧠 State recibido:', state);
    // console.log('🧠 State en sesión:', req.session.state);
    
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
        
        // res.send(`
        //     <h1>✅ Lanzamiento Exitoso</h1>
        //     <p><strong>Usuario:</strong> ${payload.name} => ${payload.email}</p>
        //     <p><strong>Rol:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/roles']}</p>
        //     <p><strong>Curso:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/context']?.title || 'Desconocido'}</p>
        //     <p><strong>Deployment ID:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/deployment_id']}</p>
        //     <a href=${process.env.BACKEND_IP}/api/getBadge/3> Get Badges From user 3 </a>
        //     `);
        
        //Aquí deberiamos de redirigir a la página de registro o a la página de landing dependiendo de si el usuario está ya registrado o no (¿asumimos que está correctamente autenticado si viene directamente desde moodle?)
        res.redirect(`${process.env.FRONTEND_IP}`);
        
        } catch (err) {
            console.error('Error al verificar el token:', err.message);
            res.status(500).send(`<h1>❌ Error al procesar el lanzamiento</h1><p>${err.message}</p>`);
        }
};
   
