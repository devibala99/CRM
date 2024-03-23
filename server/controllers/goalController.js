const Goal = require("../modals/goalModal");


const getGoal = async (req, res) => {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
}
const setGoal = async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error("Please add text");
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal);
}

const updateGoal = async (req, res) => {
    try {
        const goalId = req.params.id;
        const newText = req.body.text;

        const goal = await Goal.findById(goalId);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }
        if (goal.user.toString() !== user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }


        const updatedGoal = await Goal.findByIdAndUpdate(
            { _id: goalId },
            { $set: { text: newText } },
            { new: true }
        );

        if (!updatedGoal) {
            return res.status(404).json({ message: 'Failed to update goal' });
        }

        res.status(200).json(updatedGoal);
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(400);
        throw new Error("Goal not found");
    }
    Goal.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json("Goal deleted"))
}

module.exports = {
    getGoal, setGoal, updateGoal, deleteGoal
}