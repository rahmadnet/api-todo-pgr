const mongoose = require('mongoose');
const todoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, require: true },
    note: { type: String, require: true },
    timestamp: { type: Date, require: true, default: Date.now()},
    is_true: { type: Number, default: 0}
});

module.exports = mongoose.model('Todo', todoSchema);