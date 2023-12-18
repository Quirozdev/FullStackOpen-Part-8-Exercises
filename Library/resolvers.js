const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');

const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.collection.countDocuments();
    },
    authorCount: async () => {
      return Author.collection.countDocuments();
    },
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const book = await Book.find({}).populate('author');
        return book;
      }
      let promise;
      if (args.genre) {
        promise = Book.find({ genres: args.genre }).populate('author');
      } else {
        promise = Book.find().populate('author');
      }
      let filteredBooks = await promise;

      if (args.author) {
        filteredBooks = filteredBooks.filter(
          (book) => book.author.name === args.author
        );
      }

      return filteredBooks;
    },
    allAuthors: async () => {
      console.log('allAuthors');
      const authors = await Author.find({}).populate('books');
      authors.forEach((author) => {
        author.bookCount = author.books.length;
      });
      return authors;
    },
    allGenres: async () => {
      const books = await Book.find({});
      const genres = Array.from(
        new Set(books.map((book) => book.genres).flat())
      );
      return genres;
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('needs authentication', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let author = await Author.findOne({ name: args.author });
      try {
        if (!author) {
          author = new Author({ name: args.author, born: null, books: [] });
          await author.save();
        }
        const book = new Book({
          title: args.title,
          author: author,
          published: args.published,
          genres: args.genres,
        });

        const savedBook = await book.save();

        author = await Author.findOne({ name: args.author });

        author.books.push(savedBook._id);

        await author.save();

        pubsub.publish('BOOK_ADDED', { bookAdded: book });

        return book;
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('needs authentication', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          return null;
        }
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },
    createUser: async (root, args, context) => {
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });
        await user.save();
        return user;
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        id: user._id,
        username: user.username,
        favoriteGenre: user.favoriteGenre,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};

module.exports = resolvers;
