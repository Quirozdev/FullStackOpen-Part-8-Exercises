import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from '../queries';

const BirthForm = ({ authors }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const [editBirthYear] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  function onSelection(event) {
    const authorName = event.target.value;
    setName(authorName);
    setBorn(authors.find((author) => author.name === authorName).born || '');
  }

  function onSubmit(event) {
    event.preventDefault();

    editBirthYear({
      variables: {
        name: name,
        newBirthYear: born,
      },
    });
  }

  if (authors.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={onSubmit}>
        <select defaultValue={'0'} onChange={onSelection}>
          <option value={'0'} disabled>
            Select an author
          </option>
          {authors.map((author) => {
            return (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            );
          })}
        </select>
        born{' '}
        <input
          type="number"
          value={born}
          onChange={({ target }) => setBorn(Number(target.value))}
        />
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default BirthForm;
