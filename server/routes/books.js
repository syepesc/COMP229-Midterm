/* 
COMP229 MIDTERM - FALL 2020

BY: 
SANTIAGO YEPES - 301082274
*/


// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const books = require('../models/books');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  
  /* there are two ways of doing this.... 
  1) pass an object with the field title and a second field as an empty object books:books - so the /books/details will fill their .values="" with empty content
  2) pass an object with the field title and NO second field - so we need to add on /books/details on each form field an if statement using ejs, like this:
  <% if (title == "Edit Book"){ %>           
    value="<%= books.genre %>" 
  <% } else {%>
    required>  
  <% } %>

  I CHOOSE 1) and did not change the details template
  */
  res.render('books/details', { title: "Add Book", books: book });

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

  // create and assign new book fields
  let newBook = book({
    "title": req.body.title,
    "description": req.body.description,
    "price": req.body.price,
    "author": req.body.author,
    "genre": req.body.genre
  });

  // use mongo command to create new book
  book.create(newBook, (err, Book) =>{
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/books');
    }
  });

});

// GET the Book Details page in order to edit an existing Book

// crate new path by adding /edit to be organize with my urls
router.get('/edit/:id', (req, res, next) => {
  
  let id = req.params.id;

  // use mongo command to find book
  book.findById(id, (err, books) => {
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      res.render('books/details', {title: 'Edit Book', books: books })
    }
  });

});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', (req, res, next) => {

  // retrieve book id from the req object
  let id = req.params.id

  // Assign new book fields
  let updatedBook = book({
    "_id": id,
    "title": req.body.title,
    "description": req.body.description,
    "price": req.body.price,
    "author": req.body.author,
    "genre": req.body.genre
  });

  // use mongo command to update book
  book.updateOne({_id: id}, updatedBook, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect('/books');
      }
  });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

  let id = req.params.id;

  // use mongo command to delete book
  book.remove({_id: id}, (err) => {
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/books');
    }
  });

});


module.exports = router;
