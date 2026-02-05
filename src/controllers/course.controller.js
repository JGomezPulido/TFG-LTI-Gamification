import Course from "../models/course.model.js";

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