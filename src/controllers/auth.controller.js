import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from 'jsonwebtoken';

export const register = async  (req, res) => {
    const {username, password, email, ltiUser} = req.body;
    try{
        //Creamos un hash de la contraseña para guardarla en la base de datos
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hash, username});
        
        
        if(ltiUser){
            newUser.role = ltiUser.role;
        };
        const userSaved = await newUser.save();
        const token = await createAccessToken({id: userSaved.id});
        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            htppOnly: false
        });
        console.log(userSaved);
        return res.json({
            id: userSaved.id,
            username: userSaved.username,
            email: userSaved.email,
            role: userSaved.role,
        });
    }catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}

export const login = async (req, res) => {
    const {email, password, ltiUser} = req.body;
    try{
        //Comprobamos que existe el usuario
        var foundUser = await User.findOne({ email });
        if(!foundUser) return res.status(400).json({message: 'User not found'});
        
        //Comprobamos la contraseña que nos han dado contra la del usuario guardado en la bbdd
        const matchPass = await bcrypt.compare(password, foundUser.password);
        if(!matchPass) return res.status(400).json({message: 'Incorrect password'});

        var updatedUser = null; 
        if(ltiUser){
            const {role, course} = ltiUser;
            //Encontrar el curso en la base de datos para conseguir su id
            if(!foundUser.role || !foundUser.role === role){
                foundUser.role = role;
            }
            updatedUser = await User.findOneAndUpdate(foundUser, {role});
        }
        if(updatedUser) foundUser = updatedUser;
        const token = await createAccessToken({id: foundUser.id});
        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            htppOnly: false,
            partitioned: true,
        });
        console.log(ltiUser);
        return res.json({
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
        });
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

export const logout = (req, res) => {
    res.cookie("token","");

    res.sendStatus(200);
}



export const verify = async (req, res) => {
    const {token} = req.cookies;
    if(!token) return res.status(401).json({message: "Not authenticated"});
    jwt.verify(token, process.env.TK_SECRET, async (err, data) => {
        if(err) return res.status(401).json({message: "Not authenticated"});

        const user = await User.findById(data.id).populate('roles.course', '_id name');
        console.log(user.roles[0])
        if(!user) return res.status(401).json({message: "Not authenticated"});
        
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
        });
    });
}