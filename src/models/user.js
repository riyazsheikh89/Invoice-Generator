import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

// encrypt the password before saving the model
userSchema.pre("save", function(next) {
    const user = this;
    const SALT = bcrypt.genSaltSync(9);
    const encryptedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = encryptedPassword;
    next();
});

// Compare the password
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
    // returns true, if the password matches
}

// Generate JWT token for authetication purpose
userSchema.methods.generateToken = function() {
    const token = jwt.sign(
        {id: this._id, email: this.email},  // this info is used to create the JWT
        process.env.JWT_KEY,                // secrect key: to sign the JWT
        {expiresIn: process.env.JWT_EXPIRES_IN} // JWT expiry time
    );
    return token;
}

// Creating user model
const User = mongoose.model('User', userSchema);
export default User;