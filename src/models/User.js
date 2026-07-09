const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    // Used only temporarily during a "Forgot Password" flow.
    // We store a HASH of the token (never the real one) so that
    // even someone with database access can't reset a password.
    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    }

}, { timestamps: true });

// Hash password before saving (only if it's new/changed)
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();

});

// Compare entered password with hashed one
userSchema.methods.comparePassword = function (enteredPassword) {

    return bcrypt.compare(enteredPassword, this.password);

};

module.exports = mongoose.model("User", userSchema);
