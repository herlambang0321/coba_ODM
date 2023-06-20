const { Schema, model } = require('mongoose')

const todoSchema = new Schema({
    title: String,
    complete: {
        type: Boolean,
        default: false
    },
    executor: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Todo', todoSchema);