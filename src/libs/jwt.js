import jwt from "jsonwebtoken"
import {TK_SECRET} from "../config.js"
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            TK_SECRET,
            {
                "expiresIn": "1d",
            },
            (err, token) => {
                if (err) reject(error);
                resolve(token)
            }
        );
    })
}

        