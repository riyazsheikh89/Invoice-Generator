import User from "../models/user.js"

// User Registration
const signup = async (req, res) => {
    try {
        const isValidData = await validateInputData(req.body);
        if (isValidData !== "success") {    // if input data is not valid, 
            throw isValidData;              // throw the corresponding error
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
        const err = (error.code === 11000) ? "Email already exist!" : error
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Something went wrong in registration!',
            err
        });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.comparePassword(password)) {
            throw "Incorrect email or password! please check your credentials";
        } else {
            const auth_token = user.generateToken(); // will generate the JWT
            return res.status(200).json({
                success: true,
                data: auth_token,
                message: "Successfully logged into your account",
                err: {}
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Oops! Something went wrong with login',
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
    login,
}