const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title : {type: String, required: true},
    comments: [String],
})

const Book = new mongoose.model('Book', bookSchema)

exports.Book = Book;