import jose from "node-jose"
import fs from "fs"
import jwt from "jsonwebtoken"
import fetch from "node-fetch"
import path from "path"

export const jwks = (req, res) => {
    const keystore = jose.JWK.createKeyStore();
    const keys = JSON.parse(fs.readFileSync(path.resolve('src/keys.json')));
    keystore.add(keys.keys[0]);
    console.log(keystore);
    console.log(keys.keys[0])
    res.json(keystore.toJSON());
};

export const launch = async (req, res) => {
    const { id_token, state } = req.body;

    console.log('🧠 State recibido:', state);
    console.log('🧠 State en sesión:', req.session.state);

    if (!id_token) return res.status(400).send('Falta el id_token');
    if (!state || req.session.state !== state) return res.status(400).send('Invalid state');

    try {
        const decoded = jwt.decode(id_token, { complete: true });
        if (!decoded) return res.status(400).send('Token JWT inválido');

        const { payload } = decoded;
        const expectedIssuer =  'http://192.168.0.17';
        const expectedClientId = req.session.client_id;

        console.log(payload);
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
        <p><strong>Usuario:</strong> ${payload.name || payload.email}</p>
        <p><strong>Rol:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/roles']}</p>
        <p><strong>Curso:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/context']?.title || 'Desconocido'}</p>
        <p><strong>Deployment ID:</strong> ${payload['https://purl.imsglobal.org/spec/lti/claim/deployment_id']}</p>
        `);
        // res.redirect("index.html")
    } catch (err) {
        console.error('Error al verificar el token:', err.message);
        res.status(500).send(`<h1>❌ Error al procesar el lanzamiento</h1><p>${err.message}</p>`);
    }
}

export const login = (req, res) => {
    const query = req.method === 'POST' ? req.body : req.query;
    const { iss, login_hint, target_link_uri, client_id, lti_message_hint } = query;

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
        redirect_uri: "http://localhost:3000/api/launch",
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

export const index = (req, res) => {
    res.sendFile(path.resolve("src/index.html"));
}