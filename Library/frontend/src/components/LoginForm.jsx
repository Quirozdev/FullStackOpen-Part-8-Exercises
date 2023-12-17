import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { LOGIN } from '../queries';

const LoginForm = ({ show, setToken, setPage }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
      setName('');
      setPassword('');
      setPage('authors');
    }
  }, [result.data]);

  if (!show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();

    login({
      variables: {
        username: name,
        password,
      },
    });
  };

  return (
    <form onSubmit={submit}>
      <div>
        name{' '}
        <input
          type="text"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
