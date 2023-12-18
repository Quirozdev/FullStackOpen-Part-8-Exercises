import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ALL_GENRES } from '../queries';
import { useState } from 'react';

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState('all genres');
  const booksResult = useQuery(ALL_BOOKS, {
    skip: !props.show,
    variables: {
      author: null,
      genre: genreFilter === 'all genres' ? null : genreFilter,
    },
  });
  const genresResult = useQuery(ALL_GENRES, {
    skip: !props.show,
  });

  if (!props.show) {
    return null;
  }

  if (booksResult.loading || genresResult.loading) {
    return <p>Loading...</p>;
  }

  const books = booksResult.data.allBooks;

  const genres = genresResult.data.allGenres;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => {
        return (
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        );
      })}
      <button onClick={() => setGenreFilter('all genres')}>all genres</button>
    </div>
  );
};

export default Books;
