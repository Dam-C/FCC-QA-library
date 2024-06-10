/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config()
const mongoose = require('mongoose')
const Book = require('./models').Book

mongoose.connect(process.env.MONGO_URI)

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      let finalRes;
      try {
        let books = await Book.find({});
        if(!books){
          finalRes = [{
            _id: '',
            title: 'missing required field title',
            commentcount: 0
          }]
        } else {
  
          finalRes = books.map(b => ({
            _id: b._id,
            title: b.title || 'missing required field title',
            commentcount: b.comments.length
          }))
        }

      } catch (error) {
finalRes = 'oups'
      }
      res.json(finalRes);
    })
    
    .post(async (req, res) => {
      let finalRes;
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        finalRes = 'missing required field title';
      } else {
        let newBook = new Book({ title: title})
        let addBook = await newBook.save();
        if (!addBook) {
          finalRes = {error: 'could not add book'}
        } else {
          finalRes = { 
            _id: addBook._id, 
            title: addBook.title };
        }
      }
      res.send(finalRes)
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      let finalRes;
      let deleteBooks = await Book.deleteMany({});
      if(!deleteBooks) {
        finalRes = 'could not delete books';
      } else {
        finalRes = 'complete delete successful';
      }
      res.send(finalRes);
    });
    
    app.route('/api/books/:id')
    .get(async (req, res) => {
      let finalRes = 'no book exists';
      let bookid = req.params.id;
      try {
        let getBook = await Book.findById(bookid);
        finalRes = {
          _id: getBook._id,
          title: getBook.title,
          comments: getBook.comments,
        };
      } catch(error) {
        null;
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      res.send(finalRes);
    })
    
    .post(async (req, res) => {
      let finalRes;
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        finalRes = 'missing required field comment';
      
      } else {
        
        try {
          
          let addComment = await Book.findOneAndUpdate(
            {_id: bookid},
            {$push: {comments: comment}}, 
            {new: true}
            )
            
            if (!addComment) {
              finalRes = 'no book exists'
            } else {
              finalRes = addComment;
            };
          } catch (error) {
            finalRes = 'no book exists'
            // null
          }
        }
        res.send(finalRes)
    })
    
    .delete(async (req, res) => {
      let finalRes = 'no book exists';
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        let deleteOneBook = await Book.deleteOne({_id: bookid})
        if(deleteOneBook.deletedCount === 1){
          finalRes = 'delete successful';
        }
      } catch (error) {
        null;
      }
      res.send(finalRes)
    });
  
};
