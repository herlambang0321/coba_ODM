const { Schema, model } = require('mongoose')
const Todo = require('./todo')
var bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    },
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
});

userSchema.pre('save', function (next) {
    try {
        var user = this;
        if (!user.isModified('password')) return next()
        user.password = bcrypt.hashSync(user.password, saltRounds);
        next();
    } catch (err) {
        return next(err)
    }
});

userSchema.statics.generateHash = function (password) {
    return bcrypt.hashSync(password, saltRounds);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('findOneAndDelete', function (next) {
    // console.log('pre jalan', this._id);
    // Todo.deleteMany({ executor: this._id }).exec();
    Todo.deleteMany({ executor: this._conditions._id }).exec();
    next()
})

module.exports = model('User', userSchema);