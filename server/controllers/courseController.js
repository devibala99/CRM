const Courses = require("../modals/courseModal");

const fetchCourse = async (req, res) => {
    try {
        const courses = await Courses.find();
        if (!courses || courses.length === 0) {
            return res.status(200).json({ courses: [] });
        }

        const response = courses.map(course => ({
            courseId: course._id,
            course: course.course,
            courseFees: course.courseFees,
            duration: course.duration,
        }));
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const createCourse = async (req, res) => {
    try {
        const { course, courseFees, duration } = req.body;
        const newCourse = new Courses({ course, courseFees, duration });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating Course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(req.params);
        const { course, courseFees, duration } = req.body;
        const updatedCourse = await Courses.findByIdAndUpdate(id, { course, courseFees, duration }, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error('Error updating Course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await Courses.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });

    } catch (error) {
        console.error('Error deleting Course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { fetchCourse, createCourse, updateCourse, deleteCourse };
