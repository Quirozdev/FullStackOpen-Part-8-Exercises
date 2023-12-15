import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      bookCount
      born
      name
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author
      published
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      author
      published
      genres
    }
  }
`;

export const EDIT_BIRTH_YEAR = gql`
  mutation editBirthYear($name: String!, $newBirthYear: Int!) {
    editAuthor(name: $name, setBornTo: $newBirthYear) {
      id
      name
      born
      bookCount
    }
  }
`;
