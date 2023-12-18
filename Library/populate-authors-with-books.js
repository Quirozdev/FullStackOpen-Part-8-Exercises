// This script was done for populating the authors with their corresponding books,
// to avoid the n + 1 problem in the query allAuthors, however this approach may cause
// a lot of redundance
require('dotenv').config();
const mongoose = require('mongoose');

const Author = require('./models/author');
const Book = require('./models/book');
const book = require('./models/book');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('connected to MongoDB');
    const books = await Book.find({}).populate('author');
    for (const book of books) {
      const author = await Author.findById(book.author.id);
      author.books.push(book._id);
      await author.save();
    }
    console.log('done');
  })
  .catch((error) => {
    console.log('error while connecting to MongoDB');
    console.error(error);
  });
