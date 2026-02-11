import User from "../models/user.model.js"
import jwt from "jsonwebtoken";

export const courseRequired = (req,res,next) => {
     const { course } = req.cookies;
        if(!course) return res.status(401).json({message: "Auth denied"});
        jwt.verify(course, process.env.TK_SECRET, (error, decoded) => {
            if(error) return  res.status(403).json({message: "Auth denied"});
            req.course = decoded;
            next();
        });    
}
export const roleRequired = (expectedRole) => {
    return async (req, res, next) => {
        var userRole = req.course;
        if(!userRole.role || userRole.role==="") return res.status(401).json({message: "Could not athorise role"});
        //Admins e Instructores pueden acceder a endpoints para el instructor
        if(expectedRole === "Instructor" && (userRole === "Student" || userRole === "" || userRole === null || userRole === undefined)){
            return res.status(401).json({message: "Incorrect Role, this endpoint is only accessible to instructors"});
        }
        //Solo los estudiantes pueden acceder a endpoints para estudiantes
        if(expectedRole === "Student" && userRole !== "Student"){
            return res.status(401).json({message: "Incorrect Role, this endpoint is only accessible to students"});
        }

        if(expectedRole === "Admin" && userRole !== "Admin"){
            return res.status(401).json({message: "Incorrect Role, this endpoint is only accessible to administrators"});
        }
        next()
    }
}

export const parseRole = (roles) => {
    for(var i = 0; i < roles.length; i++){
        if(roles[i] === "http://purl.imsglobal.org/vocab/lis/v2/membership#Administrator") {
            return "Admin";
        }
        else if(roles[i] === "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor") {
            return "Instructor";
        }
        else if(roles[i] === "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner") {
            return "Student";
        }
    }
    
    return null;
};