import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';

const Recommend = (props) => {
  const meResult = useQuery(ME);
  const favoriteGenre = meResult?.data?.me?.favoriteGenre;

  const booksResult = useQuery(ALL_BOOKS, {
    skip: !props.show || !meResult.data,
    variables: {
      genre: favoriteGenre,
    },
  });

  if (meResult.loading || booksResult.loading) {
    return <p>Loading...</p>;
  }

  if (!booksResult.data) {
    return null;
  }

  const books = booksResult.data.allBooks;

  return (
    <div>
      {books.length === 0 ? (
        <p>
          No books registered for your favorite genre{' '}
          <strong>{favoriteGenre}</strong>
        </p>
      ) : (
        <>
          <p>
            books in your favorite genre <strong>{favoriteGenre}</strong>
          </p>
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
        </>
      )}
    </div>
  );
};

export default Recommend;
