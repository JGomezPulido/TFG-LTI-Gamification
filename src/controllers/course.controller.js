import { createAccessToken } from "../libs/jwt.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const getUserByEmail = async (req, res) => {
    const {email} = req.params;
    const user = await User.findOne({email}).populate('roles.course', '_id name');
    console.log(user);
    if(!user) return res.status(200).json({found: false});
    res.json({
        found: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
        },
    });
}

export const profile = async (req, res) => {
    const {id} = req.user;
    const userFound = await User.findById(id);
    console.log(req.user)
    if(!userFound) return res.status(400).json({message: "User not found"});
    console.log(userFound);
    return res.json({
        id: userFound.id,
        username: userFound.username,
        email: userFound.email,
        roles: userFound.roles,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updateadAt,
    });
}

export const getUsers = async (req, res) => {
    const id = req.params.id;
    try {
        const foundCourse = await Course.findById(id, 'name users badges').populate({path: 'users', select: '_id username email'});

        if (!foundCourse)
            return res.status(404).json({message: "Course not found"});

        console.log(JSON.stringify(foundCourse));
        res.json(foundCourse.users);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
}

export const getCourse = async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    console.log(user, id);
    try {
        if(!id || !user)
            return res.status(400).json({message: "Incorrect Course or User"});
        const found = await Course.findOne({
            _id: id, 
            users: user.id
        }, 'name users _id')
        .populate({
            path: 'users',
            match: { _id: user.id, roles: {"$elemMatch" : {course: id}}},
            select: '_id roles.role'
        });
        res.json({
            course: {
                name: found.name,
                id: found._id,
            },
            role: found.users[0].roles[0].role,
        });
    } catch (error) {
        console.log(`Error while fetching course: ${error.message}`);
        return res.status(404).json({message: `Error while fetching course: ${error.message}`});
    }
};

export const loginCourse = async (req, res) => {
    const user = req.user;
    const course = req.params.id;
    try {
        const foundCourse = await Course.findById(course, 'name _id ')
        if(!foundCourse) return res.status(404).json({message: "Course not found"});
        const foundRoles = await User.findOne({_id: user.id, roles: {"$elemMatch": {course: course}}}, 'roles.role');
        if(!foundRoles || !foundRoles.roles[0]) return res.status(404).json({message: "Could not find roles for this course"});
        const token = await createAccessToken({id: foundCourse.id, role: foundRoles.roles[0].role});
        res.cookie('course', token, {
                sameSite: 'none',
                secure: true,
                htppOnly: false,
                partitioned: true,
            });
        return res.status(200).json({
            course: {
                id: foundCourse.id,
                name: foundCourse.name,
            },
            role: foundRoles.roles[0].role,
        });
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(400);
    }
};

export const logoutCourse = (req,res) => {
    res.cookie('course', "");
    res.sendStatus(200);
};

export const verifyCourse = (req, res) => {
    const {course} = req.cookies;
    const user = req.user;
    if(!course) return res.status(401).json({message: "Not authenticated"});
    jwt.verify(course, process.env.TK_SECRET, async (err, data) => {
        if(err) return res.status(401).json({message: "Not authenticated"});

        const foundRoles = await User.findOne({_id: user.id, roles: {"$elemMatch": {course: course.id}}}, 'roles').populate('roles.course', '_id name');
        console.log(user.roles[0])
        if(!foundRoles || ! foundRoles.roles[0]) return res.status(401).json({message: "Not authenticated"});
        
        res.json({
            course: {
                id: foundRoles.roles[0].id,
                name: foundRoles.roles[0].name,
            },
            role: foundRoles.roles[0].role,
        });
    });
}