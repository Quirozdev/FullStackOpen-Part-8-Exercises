import { useEffect, useState } from 'react';
import Authors from './components/Author';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import { useApolloClient } from '@apollo/client';
import { useSubscription } from '@apollo/client';
import Recommend from './components/Recommend';
import { ALL_BOOKS, BOOK_ADDED } from './queries';

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (books) => {
    let seen = new Set();
    return books.filter((book) => {
      let k = book.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, (data) => {
    // the query has not been made yet
    if (!data) {
      return;
    }
    return {
      allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(
        `Book: ${addedBook.title} by ${addedBook.author.name} was added.`
      );
      updateCache(
        client.cache,
        { query: ALL_BOOKS, variables: { author: null, genre: null } },
        addedBook
      );
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('library-user-token');
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('library-user-token');
    client.resetStore();
    setPage('authors');
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
          </>
        )}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} showBirthForm={token ? true : false} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommend'} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
