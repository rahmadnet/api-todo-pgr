const Todo = require('../routes/model/todo');
const mongoose = require('mongoose');

// membuat TODO baru
exports.create_todo = (req, res, next) => {
    const todo = new Todo({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        note: req.body.note
    });
    todo.save().then(result => {
            console.log(result);
            res.status(201).json([{
                status: true,
                message: 'success',
                data: {
                    _id: result._id,
                    title: result.title,
                    note: result.note,
                    is_true: result.is_true
                }
            }]);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

// menampilkan seluruh ToDo
exports.get_todo = (req,res,next) => {
    Todo.find().select('title note is_true').exec().then(
    docs => {
        if(docs.length < 1){
            res.status(500).json({
                status: true,
                message: "no found data",
                data: []
            });
        }
        const response = {
            count: docs.length,
            todo: docs.map(doc => {
                return {
                    status: true,
                    message: "Success",
                    data: [
                        {
                            title: doc.title,
                            note: doc.note,
                            is_true: doc.is_true,
                        }
                    ]
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json([{
            status: false,
            message: "Get Data Error"
        }]);
    });
};

// DATA EDIT TODO
exports.update_todo = (req, res, next) => {
    const id = req.params.todoId;
    const updateOps = {};
    console.log(updateOps);
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Todo.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json([{
                status: true,
                message: 'change success'
            }]);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json([{
                status: false,
                message: 'change failed'
            }]);
        });
};