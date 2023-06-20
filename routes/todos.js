var express = require('express');
var router = express.Router();
const Todo = require('../models/todo')
const { Response } = require('../helpers/util');
const User = require('../models/user');

router.get('/', async function (req, res, next) {
    try {
        const todos = await Todo.find().populate('executor')
        res.json(new Response(todos))
    } catch (error) {
        res.status(500).json(new Response(error, false))
    }
});

router.post('/', async function (req, res, next) {
    try {
        const user = await User.findById(req.body.executor)
        const todo = await Todo.create(req.body)
        user.todos.push(todo._id)
        await user.save()
        res.status(201).json(new Response(todo))
    } catch (error) {
        res.status(500).json(new Response(error, false))
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(201).json(new Response(todo))
    } catch (error) {
        res.status(500).json(new Response(error, false))
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        const todo = await Todo.findByIdAndRemove(req.params.id)
        const user = await User.findById(todo.executor)
        user.todos = user.todos.filter(item => !item.equals(todo._id))
        await user.save()
        res.status(200).json(new Response(todo))
    } catch (error) {
        res.status(500).json(new Response(error, false))
    }
});

module.exports = router;
