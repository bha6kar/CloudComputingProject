import mongoose, { Schema } from 'mongoose'
import validator from 'validator'

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required!'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        trim: true,
        validate: {
            validator(email) {
                return validator.isEmail(email)
            },
            message: '{VALUE} is not a valid email!',
        },
    },

    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!'],
    }
})

export default mongoose.model('Users', UserSchema)
