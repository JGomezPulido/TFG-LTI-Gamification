/*
El código para las funciones del protocolo LTI (jwks, login y launch) ha sido basado en el tutorial presente en este enlace: https://www.andresmartinezsoto.eu/integracion-lti-13-moodle/
Ver https://www.imsglobal.org/spec/lti/v1p3 para la especificación del protocolo LTI 1.3
Ver https://www.imsglobal.org/spec/security/v1p0/#openid_connect_launch_flow para ver el protoclo de autenticación OpenID, que es el que estamos usando para nuestra comunicación con la plataforma.

El paquete node-jose (JOSE = JavaScript Object Signing and Encryption) se usa tanto para generar las claves usadas en LTI (ver generate-keys.js), como para enviar las claves públicas a Moodle (endpoint api/jwks.json)

El paquete jsonwebtoken se utiliza para decodificar el id_token que moodle nos manda a launch por LTI, que está enciptado utilizando esta misma tecnologia (ver launch, línea 71)
*/
import jose from "node-jose";
import fs from "fs";

import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import { createAccessToken } from "../libs/jwt.js"

//Este endpoint devuelve las claves públicas que Moodle utilizará para verificar el token de la aplicaición
//Estas claves están en formato JWKS (JSON Web Key Set)
export const jwks = async (req, res) => {
    //Cargamos las keys desde el archivo pertinente y las devolvemos en la respuesta.
    const keys = fs.readFileSync(process.env.KEY_PATH);
    const keystore = await jose.JWK.asKeyStore(keys.toString());
    console.log('JWKS solicitadas');
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
        const {course, user} = req.ltiData;

        console.log(course, user);
        try {  
            //Comprobamos si el usuario existe en la BBDD
            var userFound = await User.findOne({email: user.email});
            var isNew = !userFound;
            if (isNew) {
                const newUser = new User({
                    username: user.username,
                    email: user.email,
                    password: process.env.DEFAULT_PASSWORD,
                });
                userFound = await newUser.save();
            } 

            const foundCourse = await Course.findOne({courseID: course.id});
            var finalUser; 
            if (!foundCourse) {
                //Si el curso no existe, lo creamos, guardamos y le damos roles al usuario
                const newCourse = new Course({
                    name: course.title,
                    courseID: course.id,
                    users: [userFound.id],
                });
                const savedCourse = await newCourse.save();

                userFound.roles.push({ course: savedCourse.id, role: user.role });
                finalUser = await userFound.save();
               
            } else if (isNew) {
                //Si el curso ya existia pero el usuario es nuevo, lo añadimos al curso y le damos roles
                foundCourse.users.push(userFound.id);
                await foundCourse.save();

                userFound.roles.push({ course: foundCourse.id, role: user.role });
                finalUser = await userFound.save();
            }
            finalUser = userFound;
            const token = await createAccessToken({id: finalUser.id});
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true,
                htppOnly: false
            });
            return res.redirect(`${process.env.FRONTEND_IP}/dashboard`);
            
        } catch (error) {
            return res.status(401).json({message: error.message});
        }
        // res.send(`
        //     <h1>✅ Lanzamiento Exitoso</h1>
        //     <p><strong>Usuario:</strong> ${payload.name} => ${payload.email}</p>
        //     <p><strong>Rol:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/roles']}</p>
        //     <p><strong>Curso:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/context']?.title || 'Desconocido'}</p>
        //     <p><strong>Deployment ID:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/deployment_id']}</p>
        //     <a href=${process.env.BACKEND_IP}/api/getBadge/3> Get Badges From user 3 </a>
        //     `);
        
        //Aquí deberiamos de redirigir a la página de registro o a la página de landing dependiendo de si el usuario está ya registrado o no (¿asumimos que está correctamente autenticado si viene directamente desde moodle?)
        console.log(course, user);
        const launchUrl = new URL(`${process.env.FRONTEND_IP}/ltiLaunch`);
        const params = new URLSearchParams({
            ... user,
            course,
        });
        //Deberia de redirigir al dashboard del curso en el que has logeado
        res.redirect(`${launchUrl}?${params.toString()}`);
        
};
   
