import User from "../models/user.js"

// User Registration
const signup = async (req, res) => {
    try {
        const isValidData = await validateInputData(req.body);
        if (isValidData !== "success") {
            return res.status(422).json({
                message: isValidData
            });
        } else {
            const { name, email, password } = req.body;
            const user = await User.create({ name, email, password });
            return res.status(201).json({
                success: true,
                data: user,
                message: "Successfully signed up",
                err: {}
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Something went wrong in registration!',
            err: error
        });
    }
}


// Helper function for input validation
async function validateInputData(inputData) {
    if (!inputData.name || !inputData.email || !inputData.password) {
        return "All fields are mandatory!"
    }

    // Regular expression for email & password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(inputData.email)) {
        return "Enter valid email address!";
    }
    if (!passwordRegex.test(inputData.password)) {
        return "Password must be at least 8 characters long and should contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character";
    }

    // if everything is okay, return success
    return "success";
}

export {
    signup,
}